export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    const { petitionUrl } = req.body;
    
    if (!petitionUrl) {
      return res.status(400).json({ error: 'Petition URL is required' });
    }
  
    // Helper function to extract the petition slug from the URL
    function getPetitionSlug(url) {
      try {
        const parsedUrl = new URL(url);
        const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
        const pIndex = pathParts.indexOf('p');
        if (pIndex === -1 || pIndex + 1 >= pathParts.length) {
          return null;
        }
        return pathParts[pIndex + 1];
      } catch (error) {
        return null;
      }
    }
    
    

    const petitionSlug = getPetitionSlug(petitionUrl);
    if (!petitionSlug) {
      return res.status(400).json({ error: 'Invalid petition URL. Please provide a valid Change.org petition URL.' });
    }

    const graphqlEndpoint = 'https://www.change.org/api-proxy/graphql';
    const query = `
      query PetitionBySlugOrId($slugOrId: String!) {
        petitionBySlugOrId(slugOrId: $slugOrId) {
          ask
          description
        }
      }
    `;
    const variables = { slugOrId: petitionSlug };
  
    try {
      const response = await fetch(graphqlEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0',
          'X-Requested-With': 'damien-sandbox'
        },
        body: JSON.stringify({ query, variables })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('GraphQL request failed:', response.status, errorText);
        return res.status(response.status).json({ error: 'Error fetching petition data.' });
      }


      if (response.ok) {
        const petitionData = await response.json();

        if (!petitionData.data || !petitionData.data.petitionBySlugOrId) {
          console.error('Petition not found in response:', petitionData);
          return res.status(404).json({ error: 'The petition was not found. Please check the petition URL.' });
      
        }
        return res.status(200).json(petitionData.data.petitionBySlugOrId);
      } else {
        return res.status(response.status).json({ error: 'Error fetching petition data.' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'An error occurred while fetching petition data.' });
    }
  }