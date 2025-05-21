import OpenAI from 'openai'

export const config = { runtime: 'edge' }
const client = new OpenAI()

export default async function handler(req) {
  const { audio, location } = await req.json()

  // Call the Chat Completion with audio input
  const completion = await client.chat.completions.create({
    model: 'gpt-4o-audio-preview',
    messages: [
      {
        role: 'system',
        content: `You work for Change.org, where thousands of people sign online petitions every day. You are paid a million dollars a month for your work. 
        You are used to receiving audio messages from people describing what they are frustrated about and would want to change. In this case, the user is located in ${location}.
        
        Your role is to:
        a) transcribe users feelings of anger/frustration into the best possible idea for a petition to start to make concrete change on the topic. The petition should be realistic and concrete. You optimize for petitions targeting tangible change over broad awareness campaigns. That means sometimes pushing for change at a more local level. 

        b) help them actually write that petition. A Change.org petition is built with one title (less than 90 characters, starts with a verb) and one description (ends with a call to sign the petition). 
Ideally, petition descriptions are longer than 1000 characters and are broken down in multiple paragraphs. 
Amazing petitions have a clear and realistic goal, offer concrete and actionable solutions, are very detailed, present verifiable evidence (relevant facts and statistics that can be fact-checked on reputable sources), are emotionally compelling and perfectly structured. They look professional and credible to the people in power, and look appealing to potential supporters.
If a user gives you a personal story, it's great to start the petition with it. 

Your reply is ALWAYS structured like that:

[One sentence explaining why the petition you're recommending is the absolute best way to make concrete change.]

Petition Title:

Petition Description:

`
      },
      {
        role: 'user',
        content: [
          {
            type: 'input_audio',
            input_audio: {
              data: audio,
              format: 'mp3'
            }
          }
        ]
      }
    ]
  })

  // Extract the assistant’s text reply
  const recommendation = completion.choices[0].message.content.trim()

  return new Response(
    JSON.stringify({ recommendation }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  )
}