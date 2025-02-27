import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your API key is correctly loaded
});


export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

    // Ensure environment variable is available
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("Error: Missing OpenAI API Key");
    return res.status(500).json({ error: "Internal Server Error: Missing API Key" });
  }

  const { ask, geo, urgent, personal } = req.body;

  let prompt = `This is a quote from the user describing what they want: "${ask}". If that quote is in English, write the petition title and petition description in English. If that quote is in a different language, use that language to write the petition title and description. Do not start the petition with "we, the undersigned" or the word "As" (or equivalents in other languages). Add relevant facts and statistics to the petition description, but only if they are correct and you have good confidence in them. Cite your sources, but do not try to provide links in your response.`;

  if (geo) prompt += `. The petition will be relevant for people in ${geo}`;
  if (urgent) prompt += `. The petition is urgent because ${urgent}`;
  if (personal) prompt += `. The Change.org user said the petition was personal to them because: ${personal}. Start the petition with the personal story and try to use the tone of the Change.org user.`;

  const messages = [
    {
      role: 'system',
      content: `You write petitions for Change.org users using their input. A Change.org petition is built with one title (less than 90 characters, starts with a verb) and one description (ends with a call to sign the petition). You will always reply with one petition title, and one petition description (nothing before, nothing after). Your output follows this exact format: Petition Title: {the title you wrote} Petition Details: {the petition description you wrote}. 'Petition Title:' and 'Petition Details:' are always in English in your response, and written exactly like that.`,
    },
    { role: 'user', content: prompt },
  ];

  try {
    const responseGPT4 = await openai.chat.completions.create({
      model: "gpt-4",
      messages,
    });

    const responseGPT4O = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
    });

    res.status(200).json({
      result_gpt4: responseGPT4.choices[0].message.content.trim(),
      result_gpt4o: responseGPT4O.choices[0].message.content.trim(),
    });

  } catch (error) {
    console.error("OpenAI API Error:", error);
    res.status(500).json({ error: 'Failed to generate petition' });
  }
}