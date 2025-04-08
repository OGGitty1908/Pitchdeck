import type { NextApiRequest, NextApiResponse } from 'next';
import { researcherPrompt } from '@/lib/agents/researcher';
import { copywriterPrompt } from '@/lib/agents/copywriter';

const callOpenAI = async (prompt: string) => {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  const data = await res.json();
  return data.choices?.[0]?.message?.content || 'Error';
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, oneliner, problem, features, businessModel, competitors } = req.body;

  if (!name || !oneliner || !problem || !features || !businessModel) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const idea = `${name}: ${oneliner}\nProblem: ${problem}\nFeatures: ${features}\nBusiness Model: ${businessModel}\nCompetitors: ${competitors}`;

    const research = await callOpenAI(researcherPrompt(idea));
    const copy = await callOpenAI(copywriterPrompt(research, idea));

    const slides = [
      { title: 'Cover Slide', content: `${name} – ${oneliner}` },
      { title: 'Problem', content: problem },
      { title: 'Solution', content: features },
      { title: 'Market Research', content: research },
      { title: 'Story & UVP', content: copy },
      { title: 'Business Model', content: businessModel },
      { title: 'Competitors', content: competitors || 'N/A' },
      { title: 'Call to Action', content: 'Contact us to invest or join the team!' },
    ];

    res.status(200).json({ slides });
  } catch (error) {
    console.error('Error generating pitch deck:', error);
    res.status(500).json({ message: 'Error generating pitch deck' });
  }
} 