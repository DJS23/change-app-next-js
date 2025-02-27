'use client';

import { useState } from 'react';
import Form_draft from '../components/Form_draft.jsx';

export default function Home() {
  const [result, setResult] = useState(null);

  return (
    <div className="bg-gray-50 mx-40 p-10 rounded-2xl">
  <h1 className="text-2xl font-bold mb-4">Petition Generator</h1>
  <Form_draft onSubmit={setResult} />
  {result && (
    <div className="mt-6 space-y-4">
    <h2 className="text-lg font-semibold">Result from GPT-4:</h2>
    <pre className="bg-gray-200 p-3 rounded font-sans text-base whitespace-pre-wrap break-words">
      {result.result_gpt4}
    </pre>

    <h2 className="text-lg font-semibold">Result from GPT-4o:</h2>
    <pre className="bg-gray-200 p-3 rounded font-sans text-base whitespace-pre-wrap break-words">
      {result.result_gpt4o}
    </pre>
  </div>
  )}
</div>
  );
}