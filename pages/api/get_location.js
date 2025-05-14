export const config = { runtime: 'edge' }

export default async function handler(request) {
  // DEBUG: inspect geolocation and headers in production
  console.log('🔍 request.geo:', request.geo);
  console.log('🔍 x-forwarded-for header:', request.headers.get('x-forwarded-for'));
  console.log('🔍 x-real-ip header:', request.headers.get('x-real-ip'));

  // request.geo is injected by Vercel at the edge
  const {
    city = '',
    region = '',
    country = '',
    countryCode = '',
  } = request.geo || {}

  // Build a location string, or fall back to empty
  const location = [city, region, country]
    .filter(Boolean)
    .join(', ')

  return new Response(
    JSON.stringify({ city, region, country, countryCode, location }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  )
}


/* export default async function handler(req, res) {
  try {
    // Disable caching
    // res.setHeader('Cache-Control', 'no-store');
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    if (!response.ok) {
      console.error('Geo API HTTP error:', response.status, await response.text());
      return res.status(200).json({});
    }
    const data = await response.json();
    const { city, region, country_name: country, error, reason } = data;
    
    // if ipapi returns an error or no useful fields, fallback
    if (error || (!city && !region && !country)) {
      console.warn('Geo lookup failed or empty for IP:', ip, data);
      return res.status(200).json({});
    }
    return res.status(200).json({ city, region, country });
  } catch (error) {
    console.error('Failed to fetch location:', error);
    res.status(500).json({ error: 'Failed to get location' });
  }
} */