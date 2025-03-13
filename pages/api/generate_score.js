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

  let prompt = `Here is the petition Title: "${petitionTitle}". Here is the petition content "${petitionContent}"`;

  const messages = [
    {
      role: 'system',
      content: `You work for Change.org. Your role is to give petitions a quality score from 0 to 5. To do that, you rate petitions based on the five criteria below. Each criteria has a score out of 5. 
                Your response ALWAYS follow this structure:  
                Total score: X/5
                
                Score by category: 
                The score by category is following by a one sentence summary. 
                

                The 5 criteria: 

                1. Clear Goal  
                • What it means:
                The petition clearly articulates the issue it seeks to address, why it matters, and what change is needed.
                • How to evaluate:
                Is the main request easy to grasp in a single reading? Does the title and first paragraphs paint a clear picture of what’s at stake?

                ⸻

                2. Specific and Achievable Request
                • What it means:
                The petition clearly identifies who has the power to make the desired change and specifically states the action required.
                • How to evaluate:
                Does the call to action feel realistic and achievable? Does the petition mention who can solve the issue (the target: local representative, CEO, city council, etc.) and how they can solve it? Does it give signers a sense of what comes next if they sign?

                ⸻

                3. Emotional Power and Personal story
                • What it means:
                The petition appeals effectively to emotions, motivating supporters by highlighting real human impact or consequences.
                • How to evaluate: 
                Does the narrative emotionally connect readers to the issue? Does the petitioner share relevant personal experience or show genuine passion for the issue? Is the emotional appeal compelling enough to inspire immediate action?

                ⸻

                4. Supporting evidence and context
                • What it means:
                The petition effectively uses evidence, data, or credible sources to back up claims, strengthening its legitimacy.
                • How to evaluate:
                Are facts, figures, authoritative sources, or clear reasoning provided to convince signers and decision-makers? Does the petition feature clear reasoning and argumentation? Does it provide evidence, data, or credible references to support the cause? Is there relevant context—background info, statistics, quotes, or real-life examples—that shows the significance of the issue?

                ⸻

                5. Professionalism and Presentation
                • What it means:
                The petition is polished and professional, indicating care and seriousness of intent.
                • How to evaluate:
                Is the language clear, grammatically correct, free of typos, and well-structured? Does the petition present information in a logical, easy-to-follow structure? Is the petition visually appealing and formatted cleanly? Is the language respectful and persuasive rather than hostile or overly aggressive?`,
                    },
    { role: 'user', content: prompt },
  ];

  try {
    const responseGPT4o = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
    });


    res.status(200).json({
      score: responseGPT4o.choices[0].message.content.trim(),
    });

  } catch (error) {
    console.error("OpenAI API Error:", error);
    res.status(500).json({ error: 'Failed to generate score' });
  }
}