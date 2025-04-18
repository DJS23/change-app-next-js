import { useState } from 'react';

export default function PetitionFetcher({ onSubmit }) {
    const [petitionUrl, setPetitionUrl] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [petitionTitle, setPetitionTitle] = useState('');
    const [petitionContent, setPetitionContent] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setPetitionTitle('');
    setPetitionContent('');

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
        
        

        // Call the generate_suppastars_recs API with the petition data
        const suppastarsResponse = await fetch('/api/generate_suppastars_recs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ petitionTitle, petitionContent })
        });
 
        const suppastarsRecs = await suppastarsResponse.json();

        
 
        // Pass the petition data along with the generated score to the parent
        onSubmit({
          petitionTitle,
          petitionContent,
          recs: suppastarsRecs.recs
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
              <label htmlFor="ask" className="block text-sm/6 font-medium text-gray-900">URL of the petition you just signed</label>
              <div className="mt-2">
                
                <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                <input type="text" name="url" id="url" className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6" placeholder="https://www.change.org/p/petition_slug"
                value={petitionUrl} 
                onChange={(e) => setPetitionUrl(e.target.value)} />
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>


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


