import { useState } from 'react';
import axios from 'axios';

export default function Form({ onSubmit }) {
  const [ask, setAsk] = useState('');
  const [geo, setGeo] = useState('');
  const [personal, setPersonal] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/api/generate_draft', { ask, geo, personal });
      onSubmit(response.data);
    } catch (error) {
      // Optionally handle error here
      console.error(error);
    }
    setLoading(false);
  };


  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

            <div className="sm:col-span-6">
              <label htmlFor="ask" className="block text-sm/6 font-medium text-gray-900">I want to... </label>
              <div className="mt-2">
                
                <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                <input type="text" name="ask" id="ask" className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6" placeholder="make cat adoption easier"
                value={ask} 
                onChange={(e) => setAsk(e.target.value)} />
                </div>
              </div>
            </div>


            <div className="sm:col-span-6">    
              <label htmlFor="geo" className="block text-sm/6 font-medium text-gray-900">Which geographic communities are affected?</label>
              <div className="mt-2">

                <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                    <input type="text" name="geo" id="geo" className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6" placeholder="San Francisco"
                    value={geo} 
                    onChange={(e) => setGeo(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="sm:col-span-6">   
              <label htmlFor="personal" className="block text-sm/6 font-medium text-gray-900">I personally care because...</label>
              <div className="mt-2">
                
                <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                    <input type="text" name="personal" id="personal" className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6" placeholder="I tried 3 times already"
                    value={personal} 
                    onChange={(e) => setPersonal(e.target.value)} />
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