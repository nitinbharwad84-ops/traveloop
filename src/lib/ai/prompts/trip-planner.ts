export interface TripPlannerInput {
  destination: string;
  duration: number; // in days
  travelerCount: number;
  budget: number;
  currency: string;
  tripStyle: string;
  preferences?: string;
  season?: string;
}

export function buildTripPlannerPrompt(input: TripPlannerInput): { system: string; prompt: string } {
  // Layer 1 (Safety) + Layer 2 (System)
  const system = `You are an expert travel planner for the Traveloop AI platform. 
Your job is to create detailed, accurate, and realistic travel itineraries. 
Always prioritize user safety. Do not suggest illegal activities or dangerous travel to conflict zones.
Be specific with activity names, realistic with cost estimates, and culturally sensitive.`;

  // Layer 3 (Context) + Layer 4 (User preferences)
  const prompt = `Create a detailed ${input.duration}-day trip itinerary to ${input.destination} for ${input.travelerCount} traveler(s).

TRIP PARAMETERS:
- Destination: ${input.destination}
- Duration: ${input.duration} days
- Travelers: ${input.travelerCount} person(s)
- Budget: ${input.budget} ${input.currency} (total for all travelers)
- Budget per day per person: approximately ${Math.round(input.budget / input.duration / input.travelerCount)} ${input.currency}
- Trip Style: ${input.tripStyle}
- Season/Time: ${input.season || 'flexible'}
${input.preferences ? `- Special Preferences: ${input.preferences}` : ''}

REQUIREMENTS:
- Provide 3-5 activities per day with specific names, not generic descriptions
- Include realistic cost estimates in ${input.currency}
- Keep total estimated budget within the specified limit
- Distribute activities across morning, afternoon, and evening where relevant
- Include at least 1 local dining recommendation per day
- Note any important travel tips or warnings
- Consider travel time between activities`;

  return { system, prompt };
}
