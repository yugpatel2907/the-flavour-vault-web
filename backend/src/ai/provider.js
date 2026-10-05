// All provider-specific configuration lives here. No browser imports this module.
async function getModel() {
  if (!process.env.GROQ_API_KEY || !process.env.AI_MODEL) {
    const error = new Error('Flavour AI is temporarily unavailable. You can still order from the menu.');
    error.status = 503;
    throw error;
  }
  const { createGroq } = await import('@ai-sdk/groq');
  return createGroq({ apiKey: process.env.GROQ_API_KEY })(process.env.AI_MODEL);
}
module.exports = { getModel };
