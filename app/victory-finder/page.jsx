'use client';

import { useState } from 'react';
import Form_victories from '../../components/Form_victories';


export default function Victories() {

  const [result, setResult] = useState(null)

  return (
    <div className="bg-gray-100 w-full max-w-screen-md mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 rounded-2xl">
      <h1 className="text-2xl font-bold mb-4">Find similar victorious petitions</h1>
      <Form_victories onSubmit={setResult} />
      {result && (
        <div className="mt-6 space-y-4">
        <h2 className="text-lg font-semibold">Result</h2>
        <pre className="bg-gray-200 p-3 rounded font-sans text-base whitespace-pre-wrap break-words">
          {typeof result?.recs === 'string'
            ? result.recs
            : JSON.stringify(result?.recs, null, 2)}
        </pre>
    
      </div>
      )}
    </div>
  );
}