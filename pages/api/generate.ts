import type { NextApiRequest, NextApiResponse } from 'next';
import { researcherPrompt } from '@/lib/agents/researcher';
import { copywriterPrompt } from '@/lib/agents/copywriter';

// Simple authentication check
const isAuthorized = (req: NextApiRequest) => {
  // For testing, you can use a simple token
  // In production, use proper authentication
  const authToken = req.headers.authorization;
  return authToken === process.env.TEST_TOKEN;
};

// Rate limiting setup - more lenient for testing
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_REQUESTS_PER_HOUR = 100; // Increased for testing
const requestCounts = new Map<string, { count: number; resetTime: number }>();

const checkRateLimit = (ip: string) => {
  const now = Date.now();
  const userData = requestCounts.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW };

  if (now > userData.resetTime) {
    userData.count = 0;
    userData.resetTime = now + RATE_LIMIT_WINDOW;
  }

  if (userData.count >= MAX_REQUESTS_PER_HOUR) {
    return false;
  }

  userData.count++;
  requestCounts.set(ip, userData);
  return true;
};

// Usage tracking
let totalTokensUsed = 0;
const trackUsage = (tokens: number) => {
  totalTokensUsed += tokens;
  console.log(`Total tokens used: ${totalTokensUsed}`);
};

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
  
  // Track token usage
  if (data.usage) {
    trackUsage(data.usage.total_tokens);
  }
  
  return data.choices?.[0]?.message?.content || 'Error';
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Check authentication
  if (!isAuthorized(req)) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Get client IP
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  // Check rate limit
  if (!checkRateLimit(clientIp as string)) {
    return res.status(429).json({ 
      message: 'Rate limit exceeded. Please try again later.',
      limit: MAX_REQUESTS_PER_HOUR,
      window: '1 hour'
    });
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

    res.status(200).json({ 
      slides,
      usage: {
        totalTokens: totalTokensUsed,
        estimatedCost: `$${(totalTokensUsed * 0.06 / 1000).toFixed(2)}`
      }
    });
  } catch (error) {
    console.error('Error generating pitch deck:', error);
    res.status(500).json({ message: 'Error generating pitch deck' });
  }
} 