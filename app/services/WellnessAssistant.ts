import { EnvironmentalData } from "../types";

export interface WellnessAdvice {
  type: "environmental" | "wellness" | "activity";
  title: string;
  description: string;
  severity: "info" | "warning" | "alert";
  source: "sensor" | "ai";
}

export class WellnessAssistant {
  private static readonly DISCLAIMER =
    "This information is for general wellness purposes only and is not medical advice. " +
    "Always consult healthcare professionals for medical concerns.";

  /**
   * Processes environmental data and returns wellness recommendations
   */
  static async getEnvironmentalAdvice(
    data: EnvironmentalData
  ): Promise<WellnessAdvice[]> {
    const recommendations: WellnessAdvice[] = [];

    // Process air quality data
    if (data.aqi > 150) {
      recommendations.push({
        type: "environmental",
        title: "Poor Air Quality Alert",
        description:
          "Consider staying indoors or wearing appropriate protection when outside.",
        severity: "alert",
        source: "sensor",
      });
    }

    // Process temperature data
    if (data.temperature > 30) {
      recommendations.push({
        type: "wellness",
        title: "High Temperature Alert",
        description: "Stay hydrated and avoid prolonged sun exposure.",
        severity: "warning",
        source: "sensor",
      });
    }

    return recommendations;
  }

  /**
   * Gets the disclaimer message
   */
  static getDisclaimer(): string {
    return this.DISCLAIMER;
  }

  /**
   * Validates if the advice is appropriate to show
   */
  static validateAdvice(advice: WellnessAdvice): boolean {
    // Ensure no medical diagnoses or treatment recommendations
    const forbiddenTerms = [
      "diagnos",
      "disease",
      "treatment",
      "medicine",
      "prescription",
      "cure",
      "therapy",
    ];

    const content = `${advice.title} ${advice.description}`.toLowerCase();
    return !forbiddenTerms.some((term) => content.includes(term));
  }
}
