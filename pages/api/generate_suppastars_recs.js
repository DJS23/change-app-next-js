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

  let prompt = `Here is the petition Title of the petition that was just signed: "${petitionTitle}". Here is the petition description "${petitionContent}"`;

  const messages = [
    {
      role: 'system',
      content: `You work for Change.org, where thousands of people sign online petitions every day. Your goal is to convince a petition signer to start a petition of their own. All you know about them is the petition they just signed. You will use that knowledge to understand what they care about and suggest the best follow-up petitions to start. 
At this point you don’t know where the person live, so feel free to use placeholders in your ideas. Your ideas will be formatted as petition titles (90 characters maximum)

Your role is to answer the following questions:

a) Does it make sense to suggest starting a local version of the petition? Yes | No

If Yes,  suggest the best 3 ideas to localize the fight and target local decision makers.

b) Does it make sense to suggest starting a petition to support the original one by targeting a different decision maker? Yes | No
For example, by identifying influential people, organizations or companies who might want to support the petition or take some action that would build momentum toward it. 

c) Suggest the 3 topics that make the most sense to start a follow-up petition on

For each topic, suggest the best 3 petition title examples you think of

d) Out of all your previous propositions, pick the 3 you think are the most likely to be compelling for petition starters AND to have a real-life impact on the issue.


-

Your output ALWAYS follows this template:

a) Does it make sense to suggest starting a local version of the petition?  Yes

- This is an petition title example
- This is another petition title
- This is the third petition title

b) Does it make sense to suggest starting a petition to support the original one by targeting a different decision maker? Yes

- This is an petition title example
- This is another petition title
- This is the third petition title

c) Suggest the 3 topics that make the most sense to start a follow-up petition on

Topic 1: This is an example of topic
- This is an petition title example
- This is another petition title
- This is the third petition title

Topic 2: This is an example of topic
- This is an petition title example
- This is another petition title
- This is the third petition title

Topic 3: This is an example of topic
- This is an petition title example
- This is another petition title
- This is the third petition title

d) My top 3 ideas:

- This is an petition title example
- This is another petition title
- This is the third petition title
        `,
                    },
    { role: 'user', content: prompt },
  ];

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
    });


    res.status(200).json({
      recs: response.choices[0].message.content.trim(),
    });

  } catch (error) {
    console.error("OpenAI API Error:", error);
    res.status(500).json({ error: 'Failed request' });
  }
}