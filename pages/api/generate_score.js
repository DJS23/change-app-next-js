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

  const { petitionTitle, petitionContent } = req.body;

  let prompt = `Here is the petition Title: "${petitionTitle}". Here is the petition description "${petitionContent}"`;

  const messages = [
    {
      role: 'system',
      content: `You work for Change.org. Your role is to critique the content of petitions (title and description) and find opportunities for improvement to make them more appealing to both supporters and decision makers. Amazing petitions have a clear goal, offer concrete and actionable solutions, are very detailed, present evidence, are emotionally compelling and perfectly structured. They look professional and credible to the people in power. 


a) Would you consider this petition to be a model petition, that would be in the top 5% of petitions?
b) Would you suggest Change.org could promote this petition via email, social media, or on our homepage?
c) Can this petition be improved in any way to make it more compelling?
d) Would you categorize it a low-quality petition (non-serious, joke, unrealistic expectations, offensive, etc.)

d) Does the petition title state the petition’s goal as clearly as possible?
e) Does the petition description offer concrete and actionable solutions to the issue? 
f) Does the petition mention a clear target or decision-maker?

g) Does the petition feature a personal story that would help supporters empathize with the issue?
h) Does the petition feature evidence and supporting data?

i) Does the petition description have more than 1000 characters?
J)  Does the petition description have more than 2000 characters?
k) Does the petition description have more than one paragraph?

Bonus question: Is the petition likely to make impact?

For questions a) to k) return the question followed by Yes or No.
For the bonus question, return the question followed by 'Likely', 'Possible', 'Aspirational', or ‘Unlikely’. `,
                    },
    { role: 'user', content: prompt },
  ];

  try {
    const response = await openai.chat.completions.create({
      model: "o3-mini",
      messages,
    });


    res.status(200).json({
      score: response.choices[0].message.content.trim(),
    });

  } catch (error) {
    console.error("OpenAI API Error:", error);
    res.status(500).json({ error: 'Failed to generate score' });
  }
}