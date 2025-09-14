import Anthropic from "@anthropic-ai/sdk";

export const getUserProfile = async (userInput: string) => {
  const anthropic = new Anthropic({dangerouslyAllowBrowser: true, apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY});

  const message = await anthropic.messages.create({
    model: 'claude-3-5-haiku-20241022',
    messages: [{
      role: "user",
      content: [{
        type: "text",
        text: `Reference ONLY the following user input data: ${userInput}. Your output must follow a JSON format. ONLY add the following keys: 'size_of_company' where value should be numeric and inferred a range based on the company type and number of customers received, key 'current_model' where value should only have data if mentioned by the user, key 'business_model' where the value is either B2B or B2C, key 'type_of_data' where the value is either text, string, etc; key 'amount_of_latency' where the value should be filled if mentioned otherwise null, key 'data_sensitivity' where you should determine the value based on how sensitive the data is between low, medium, high, and critical levels; and key 'savings' where the value will be an estimate of the amount of savings for the user switching to the service in United States Dollars (USD). NEVER add any other keys not mentioned in this request. Create a user profile based on the previously mentioned fields, and return the three objects with these fields.`
      }]
    }],
    max_tokens: 500
  });

  return message.content[0];
};

