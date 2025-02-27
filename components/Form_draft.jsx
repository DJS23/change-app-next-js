import { useState } from 'react';
import axios from 'axios';

export default function Form({ onSubmit }) {
  const [ask, setAsk] = useState('');
  const [geo, setGeo] = useState('');
  const [personal, setPersonal] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post('/api/generate_draft', { ask, geo, personal });
    onSubmit(response.data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

            <div className="sm:col-span-4">
              <label htmlFor="ask" className="block text-sm/6 font-medium text-gray-900">Ask </label>
              <div className="mt-2">
                
                <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                <input type="text" name="ask" id="ask" className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6" placeholder="make cat adoption easier"
                value={ask} 
                onChange={(e) => setAsk(e.target.value)} />
                </div>
              </div>
            </div>


            <div className="sm:col-span-4">    
              <label htmlFor="geo" className="block text-sm/6 font-medium text-gray-900">Geo</label>
              <div className="mt-2">

                <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                    <input type="text" name="geo" id="geo" className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6" placeholder="San Francisco"
                    value={geo} 
                    onChange={(e) => setGeo(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="sm:col-span-4">   
              <label htmlFor="personal" className="block text-sm/6 font-medium text-gray-900">Personal</label>
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
          <button type="submit" className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer">Submit</button>
      </div>
    </form>
  );
}