import { useEffect, useState } from 'react';

export default function PetitionFetcher({ onSubmit }) {
    const [petitionUrl, setPetitionUrl] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState('');

    
    useEffect(() => {
      async function fetchLocation() {
        const res = await fetch('/api/get_location')
        const { location } = await res.json()
        setLocation(location)  // e.g. “San Francisco, California, United States”
      }
      fetchLocation()
    }, [])
    

    async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
        const response = await fetch('/api/get_petition_content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ petitionUrl }),
        });

        const data = await response.json();

        if (!response.ok) {
        setErrorMessage(data.error || 'Error fetching petition data.');
        } else {
        // Extract petition details
        const petitionTitle = data.ask;
        const petitionContent = data.description.replace(/<[^>]+>/g, '');
        
        

        // Call the get_victories API with the petition data and location
        const victoriesResponse = await fetch('/api/get_victories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ petitionTitle, petitionContent, location })
        });
 
        const victories = await victoriesResponse.json();

        
 
        // Pass the petition data along with the generated score to the parent
        onSubmit({
          petitionTitle,
          petitionContent,
          recs: victories.recs
        });
        }
    } catch (error) {
        console.error(error);
        setErrorMessage('An error occurred while fetching petition data.');
    }
      finally {
        setLoading(false)
    }
  }

  

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

            <div className="sm:col-span-6">
              <label htmlFor="url" className="block text-sm/6 font-medium text-gray-900">URL of your petition</label>
              <div className="mt-2">
                
                <div className="w-full flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                <input
                  type="text"
                  name="url"
                  id="url"
                  className="block min-w-0 w-full py-2 pr-3 pl-1 text-sm/6 text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-base/6"
                  placeholder="https://www.change.org/p/petition_slug"
                  value={petitionUrl}
                  onChange={(e) => setPetitionUrl(e.target.value)}
                />
                </div>
                <p className="text-sm text-gray-500 mt-6 break-words">
                  {location
                    ? <>Detected location: <span className="font-medium">{location}</span></>
                    : 'No location found yet...'}
                </p>
              </div>
            </div>


          </div>
        </div>
      </div>


      {errorMessage && (
        <p className="mt-4 text-sm text-red-600">{errorMessage}</p>
      )}
      
      <div className="mt-6 flex items-center justify-end gap-x-6">
      <button type="submit"
              className="flex items-center rounded-lg bg-indigo-600 px-12 py-3 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer"
              disabled={loading}>
              {loading && (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>)}
              {loading ? "Loading..." : "Submit"}
      </button>
      </div>
    </form>
  );
}
