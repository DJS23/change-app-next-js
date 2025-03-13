'use client';

import { useState } from 'react';
import Form_quality from '../../components/Form_quality';


export default function PetitionQuality() {

  const [result, setResult] = useState(null)
  const [petitionTitle, setPetitionTitle] = useState('');
  const [petitionContent, setPetitionContent] = useState('');

  return (
    <div className="bg-gray-50 mx-40 p-10 rounded-2xl">
      <h1 className="text-2xl font-bold mb-4">Petition Quality Scoring</h1>
      <Form_quality onSubmit={setResult} />
      {result && (
        <div className="mt-6 space-y-4">
        <h2 className="text-lg font-semibold">Result</h2>
        <pre className="bg-gray-200 p-3 rounded font-sans text-base whitespace-pre-wrap break-words">
          <p>{result.score}</p>
        </pre>
    
      </div>
      )}
    </div>
  );
}