export interface PackingGeneratorInput {
  destination: string;
  season: string;
  duration: number;
  travelerType: string; // solo, couple, family, group
  tripType: string; // beach, mountain, city, business, adventure
  specificNeeds?: string;
}

export function buildPackingGeneratorPrompt(input: PackingGeneratorInput): { system: string; prompt: string } {
  const system = `You are a professional travel packing expert for the Traveloop platform.
Your goal is to generate comprehensive, context-aware packing lists tailored to specific trips.
Focus on practical, essential items. Avoid over-packing recommendations.
Consider climate, cultural norms, activities, and trip duration.
Do not suggest any prescription medications without noting they require a doctor's prescription.`;

  const prompt = `Generate a comprehensive packing list for the following trip:

TRIP DETAILS:
- Destination: ${input.destination}
- Season: ${input.season}
- Duration: ${input.duration} days
- Traveler Type: ${input.travelerType}
- Trip Type: ${input.tripType}
${input.specificNeeds ? `- Special Needs/Considerations: ${input.specificNeeds}` : ''}

REQUIREMENTS:
- Organize items into logical categories (clothing, electronics, documents, hygiene, medicine, accessories, travel_gear)
- Include only the most essential items — avoid over-packing
- Adjust clothing quantities for the ${input.duration}-day duration
- Consider the climate in ${input.destination} during ${input.season}
- Add any destination-specific items (e.g., universal adapter for Europe, insect repellent for tropics)
- Include any activity-specific gear for ${input.tripType} trips`;

  return { system, prompt };
}
