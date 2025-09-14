import Anthropic from "@anthropic-ai/sdk";

const getUserProfile = async (userInput: string) => {
  const anthropic = new Anthropic();

  return await anthropic.messages.create({model: 'claude-3-5-sonnet-20240620', messages: [{role: 'assistant', content: `Convert this data into a JSON format. ${userInput} `}], max_tokens: 100})
};