import Anthropic from "@anthropic-ai/sdk";

export const getOptimalModel = async (userInput: string) => {
  const anthropic = new Anthropic({dangerouslyAllowBrowser: true, apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY});

  return await anthropic.messages.create({
    model: 'claude-3-5-haiku-latest',
    messages: [{
      role: "user",
      content: [{
        type: "text",
        text: `Reference ONLY the following user input data: ${userInput}. Only explain in simple, concise language. You are evaluating effective AI models from all of Anthropic's offerings. Only reference available AI models from the mentioned resource. Only use the following definition of 'optimal:' most accurate AI model while minimizing the number of parameters for the given user profile. ALWAYS Return a JSON containing three results with two attributes numeric value 'ranking' referencing the relative performance; 'model-title' referencing the name of the model; and 'explanation' explaining why the listed model is most efficient, emphasizing sustainability. List each object from most to least optimal. If the user mentions an existing AI/LLM agent and it is different from your results, compare why the results are better for each result.`
      }]
    }],
    max_tokens: 500
  });
};

