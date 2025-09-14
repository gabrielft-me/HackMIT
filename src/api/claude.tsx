import Anthropic from "@anthropic-ai/sdk";

export const getUserProfile = async (userInput: string) => {
  const anthropic = new Anthropic({dangerouslyAllowBrowser: true, apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY});

  const message = await anthropic.messages.create({
    model: 'claude-3-5-haiku-latest',
    messages: [{
      role: "user",
      content: [{
        type: "text",
        text: `Reference ONLY the following user input data: ${userInput}. Your output must follow a JSON format, with the following data 'size_of_company' where size should be numeric and inferred when needed, 'current_model' where current_model should only have data if mentioned by the user, 'business_model' where the data is either B2B or B2C, 'type_of_data' where the field is either text, string, etc; 'amount_of_latency' where the field should be filled if mentioned otherwise null, 'data_sensitivity' where you should determine how sensitive the data is between low, medium, high, and critical; and 'savings' where you will estimate the amount of savings for the user switching to the service. Create a user profile based on the previously mentioned fields, and return an array of three objects with these fields.`
      }]
    }],
    max_tokens: 500
  });

  return message.content;
};

