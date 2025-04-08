export const researcherPrompt = (idea: string) => `
You are a startup researcher.

Based on the idea below, write:
1. Target market size
2. Key industry trends
3. Top 3 competitors
4. SWOT analysis

Startup Idea:
${idea}
`; 