export interface BudgetPredictorInput {
  destinations: string[];
  travelerCount: number;
  duration: number;
  tripStyle: string;
  season: string;
  currency: string;
}

export function buildBudgetPredictorPrompt(input: BudgetPredictorInput): { system: string; prompt: string } {
  const system = `You are a travel finance expert for the Traveloop platform. 
Your role is to provide accurate, realistic travel budget estimates based on current market conditions.
Always ground your estimates in real-world pricing. Do not suggest any financial advice.
Be transparent about your assumptions and flag any high-uncertainty estimates.`;

  const prompt = `Estimate the travel budget for the following trip:

TRIP PARAMETERS:
- Destinations: ${input.destinations.join(', ')}
- Duration: ${input.duration} days total
- Travelers: ${input.travelerCount} person(s)
- Trip Style: ${input.tripStyle} (e.g., budget backpacking, mid-range comfort, luxury)
- Season: ${input.season}
- Currency: ${input.currency}

INSTRUCTIONS:
- Provide per-person estimates for each major cost category
- Scale to ${input.travelerCount} travelers where applicable (e.g., shared accommodation)
- Include brief reasoning for each category based on the destination and style
- Flag any categories with high pricing variability
- Note seasonal price fluctuations if relevant`;

  return { system, prompt };
}
