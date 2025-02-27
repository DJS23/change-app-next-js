'use client';

export default function PetitionQuality() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 rounded-lg">
      <h1 className="text-3xl font-bold mb-4">Petition Quality Guidelines</h1>
      <p className="mb-2">
        A high-quality petition is clear, concise, and compelling. Here are some key factors:
      </p>
      <ul className="list-disc ml-6 space-y-2">
        <li><strong>Clarity:</strong> Clearly define the issue and the change you want.</li>
        <li><strong>Compelling Title:</strong> A strong title grabs attention.</li>
        <li><strong>Impactful Story:</strong> Explain why this matters with a personal or data-driven story.</li>
        <li><strong>Strong Call to Action:</strong> Tell people exactly what they need to do.</li>
        <li><strong>Relevant Target:</strong> Address the right decision-makers.</li>
      </ul>
      <p className="mt-4">
        Want help crafting your petition? Try our <a href="/" className="text-blue-500 underline">Petition Generator</a>.
      </p>
    </div>
  );
}