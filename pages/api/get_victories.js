import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  project: process.env.OPENAI_PROJECT,
  organization: process.env.OPENAI_ORG_ID,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const vectorStoreId = process.env.OPENAI_VECTOR_STORE_ID; // <- prebuilt victorious-petitions store
  if (!apiKey) {
    console.error("Missing OPENAI_API_KEY");
    return res.status(500).json({ error: "Internal Server Error: Missing API Key" });
  }
  if (!vectorStoreId) {
    console.error("Missing OPENAI_VECTOR_STORE_ID");
    return res.status(500).json({ error: "Internal Server Error: Missing Vector Store ID" });
  }

  const { petitionTitle, petitionContent, location } = req.body || {};
  if (!petitionTitle || !petitionContent) {
    return res.status(400).json({ error: "petitionTitle and petitionContent are required" });
  }

  // Build the RAG query
  const prompt = [
    `Petition title: ${petitionTitle}`,
    `Petition description: ${petitionContent}`,
    location ? `User location: ${location}` : null,
  ]
    .filter(Boolean)
    .join("\n\n");

  // Ask the model to return a compact JSON object describing the single best match.
  const system = `You are a retrieval assistant for Change.org. For any given current petition, you will search in Change.org's archive the most similar petition that achieved victory in the past. 
  Your directions:
- Return the single most similar victorious petition.
- Prefer matches from the same country/region when content similarity is close.
- If nothing is clearly relevant, return an empty result with reason. 
Output STRICT JSON with keys: {"id","title","url","similarity","match_reason","excerpt"} where "excerpts" is an array of a single supporting quote.`;

  try {
    const response = await openai.responses.create({
      model: "gpt-5-mini",
      input: prompt,
      instructions: system,
      // Use OpenAI's built-in File Search tool attached to your vector store
      tools: [
        {
          type: "file_search",
          vector_store_ids: [vectorStoreId],
          max_num_results: 5,
          // Optionally, add metadata filters here once you've added attributes
          // filters: { document: { country: "US" } }
        },
      ],
      // Keep responses lean
      //max_output_tokens: 600,
      //temperature: 0.1,
    });

    // The SDK exposes a helper with consolidated plain text
    const text = response.output_text?.trim?.() ?? "";

    // Try to parse JSON; if parsing fails, still return the raw text for debugging
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (_) {
      parsed = { raw: text };
    }

    return res.status(200).json({ recs: parsed });
  } catch (err) {
    console.error("OpenAI Responses API error:", err);
    return res.status(500).json({ error: "Failed request" });
  }
}