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
      content: `
      You work for Change.org, where thousands of people sign online petitions every day. Your team’s goal is to convince people who sign petitions to start a petition of their own. All we know about users is the last petition they just signed. You will use that knowledge to understand what they care about and suggest the best follow-up petitions to start. 

These can fit into two main categories:

Category 1: Follow-up petitions that support the same cause as the original one
These petitions continue fighting for the same underlying issue but using a different strategic approach or targeting a new decision-maker. That can mean:

a) Shift the Type of Decision-Maker (splinter campaign)

Change the type of decision-maker you’re targeting—moving from public institutions (like government bodies) to private entities (like corporations or nonprofits), or vice versa. That could mean:
	•	Media & Cultural Pressure – e.g., TV networks, streaming platforms
	•	Investor Pressure – e.g., shareholders, activist investors
	•	Partnership & Alliance Pressure – e.g., allied organizations or sponsors
	•	Customer/User Pressure – e.g., loyal users or buyers of a product or platform
	•	Legal & Regulatory Pressure – e.g., relevant oversight or enforcement bodies
	•	Academic & Expert Pressure – e.g., researchers or professional associations
Etc. 

Example:
From signing “Statewide ban on plastic straws,” suggest “Urge Starbucks to eliminate plastic straws nationally.”

b) Localize the campaign

Suggest localizing a national or global petition to increase its chances of success. 

Example: 
From “Protect Amazon rainforest globally,” move to “Ban deforestation-linked products in [your state].”
From: “Protect animals from cruelty” to: “Ban the sale of cosmetics tested on animals in [your country/state]”

c) More concrete changes

Encourage users to move from awareness/education-focused petitions to concrete policy changes.

Example: 
From: “Raise awareness about LGBTQ+ discrimination” To: “Pass a federal law banning LGBTQ+ discrimination in housing and employment”
From: “Stand with survivors of sexual assault” to: “Require all universities to provide trauma-informed sexual assault response training”

Category 2: Targeting Related or Adjacent Issues
These petitions engage users on new but closely related issues within the same broader domain or category of activism. 

They could be on:

a) a follow-up to the original petition
b) on a adjacent issue as the original petition

Your role is to answer the questions below.
Your recommendations will be formatted as petition titles (90 characters maximum). At this point you don’t know where the person live exactly, but can assume it’s somewhere in the US. 
Remember that amazing petitions have a clear and realistic goal, an offer concrete and actionable solutions. Be as specific as possible with your recommendations – only use placeholders for locations (city or state). 

Category 1: Follow-up petitions that support the same cause as the original one

a) Does it make sense to suggest starting a splinter campaign as a follow-up petition? Yes | No
b) Does it make sense to suggest localizing the petition as a follow-up? Yes | No
c) Does it make sense to suggest the follow-up petition to focus on more concrete changes? Yes | No 

Suggest your best 3 recommendations for follow-up petitions in this category

Category 2: Targeting Related or Adjacent Issues

a) Does it make sense to suggest a follow-up to the original petition? Yes | No 
b) Does it makes sense to suggest a follow-up on adjacent topics within the same domain as the original petition? Yes | No

Suggest your best 3 recommendations for follow-up petitions in this category

Summary

Out of all your previous propositions, pick the 3 you think are the most likely to be compelling for petition starters AND to have a real-life impact on the issue and tell us why succinctly. 

--- 

Your output ALWAYS follows this template:

Category 1: Follow-up petitions that support the same cause as the original one

a) Does it make sense to suggest starting a splinter campaign as a follow-up petition? Yes | No
b) Does it make sense to suggest localizing the petition as a follow-up? Yes | No
c) Does it make sense to suggest the follow-up petition to focus on more concrete changes? Yes | No 

- This is an petition title example
- This is another petition title
- This is the third petition title

Category 2: Targeting Related or Adjacent Issues

a) Does it make sense to suggest a follow-up to the original petition? Yes | No 
b) Does it makes sense to suggest a follow-up on adjacent topics within the same domain as the original petition? Yes | No

- This is an petition title example
- This is another petition title
- This is the third petition title

Summary:

My 3 best recommendations:
- This is an petition title example
- This is another petition title
- This is the third petition title

This is a sentence explaining your choice. `,
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