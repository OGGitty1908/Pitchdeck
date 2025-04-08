export const copywriterPrompt = (research: string, idea: string) => `
You're a pitch deck copywriter.

Using the idea and research below, write:
- Tagline
- Problem & solution story
- Unique value proposition
- Go-to-market strategy
- Why now

Startup Idea: ${idea}

Research: ${research}
`; 