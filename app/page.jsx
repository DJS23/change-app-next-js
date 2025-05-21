'use client';

import { useState } from 'react';

export default function Home() {
  const [result, setResult] = useState(null);

  return (
    <div className="relative isolate px-6 pt-6 lg:px-8">
   
      <div className="mx-auto max-w-2xl py-8 sm:py-48 lg:py-38">
        
        <div className="text-center">
          <h1 className="text-8xl font-bold tracking-tight text-balance text-gray-2500 sm:text-10xl">Welcome to the 
            {" "}
              <span className="bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
                future
              </span>
            .
          </h1>

        </div>

        <div className="hidden sm:mb-8 sm:flex sm:justify-center">
          <div className="relative rounded-full mt-8 px-3 py-1 text-sm/6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
            Check out our latest prototype <a href="/quality-score" className="font-semibold text-indigo-600"><span className="absolute inset-0" aria-hidden="true"></span>here <span aria-hidden="true">&rarr;</span></a>
          </div>
        </div>
      </div>

    </div>
  );
}