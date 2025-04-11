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
      content: `You work for Change.org. Your role is to critique the content of petitions (title and description) and find opportunities for improvement to make them more appealing to both supporters and decision makers. Amazing petitions have a clear and realistic goal, offer concrete and actionable solutions, are very detailed, present evidence, are emotionally compelling and perfectly structured. They look professional and credible to the people in power. 

Your role is to answer the list of questions below. ONLY ACCEPTABLE ANSWERS ARE LISTED AFTER EACH QUESTION. 

General assessment
1) Would you consider this petition to be a model petition, that would be in the top 5% of petitions? Yes | No
2) Would you recommend that Change.org promote this petition through email, social media, or the homepage Yes | No 
3) Does this petition include the specific details and clear calls to action needed for it to be seen as credible by journalists or decision-makers? Yes | No 
4) Is this petition likely to influence actual policy, based on how it frames the issue and the clarity of its demands? Yes | No
5) Would you categorize it a low-quality petition (non-serious, joke, unrealistic expectations, offensive, etc.)? Yes | No


Concrete opportunities for improvement
6) Does the petition call for a specific change and is that goal clear in the title? Yes | No 
7) Does the petition description offer concrete and actionable solutions to the issue? Yes | No
8) Does the petition mention a clear target or decision-maker? Yes | No
9) Does the petition feature a personal story that would help supporters empathize with the issue? Yes | No
10) Does the petition feature evidence and supporting data? Yes | No
11) Is the petition clearly organized, has proper grammar and no spelling errors? Yes | No 


Your reply ONLY features this list of questions in order, with the response after each question. NOTHING MORE. `,
                    },
    { role: 'user', content: prompt },
  ];

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
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