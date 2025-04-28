import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Questions to be asked for feedback analysis
const FEEDBACK_QUESTIONS = [3, 4, 5, 6, 12, 13, 14, 15, 16, 17, 18];

export const analyzeFeedbackResponses = async (userId, responses) => {
  try {
    // Get the current skin profile
    const currentProfile = await prisma.skinProfile.findUnique({
      where: { userId },
      include: { history: true }
    });

    if (!currentProfile) {
      throw new Error('No skin profile found for user');
    }

    // Get the questions for feedback analysis
    const questions = await prisma.question.findMany({
      where: {
        id: {
          in: FEEDBACK_QUESTIONS
        }
      }
    });

    // Create a map of responses for easy access
    const responseMap = new Map(responses.map(r => [r.questionId, r.answer]));

    // Initialize new profile data
    let newProfile = {
      skinType: currentProfile.skinType,
      concerns: currentProfile.concerns,
      allergies: currentProfile.allergies,
      currentRoutine: currentProfile.currentRoutine,
      lifestyleFactors: {
        hydration: currentProfile.lifestyleFactors?.hydration || null,
        sleep: currentProfile.lifestyleFactors?.sleep || null,
        sunExposure: currentProfile.lifestyleFactors?.sunExposure || null,
        stress: currentProfile.lifestyleFactors?.stress || null,
        diet: currentProfile.lifestyleFactors?.diet || null,
        environment: currentProfile.lifestyleFactors?.environment || null,
        airConditioning: currentProfile.lifestyleFactors?.airConditioning || null
      },
      recommendations: {
        immediate: [],
        lifestyle: [],
        products: []
      }
    };

    // Analyze each response
    for (const question of questions) {
      const answer = responseMap.get(question.id);
      if (!answer) continue;

      switch (question.text) {
        case "How would you describe your skin type?":
          newProfile.skinType = answer;
          break;

        case "Do you have sensitive skin?":
          if (answer === "Yes") {
            newProfile.concerns = [...new Set([...newProfile.concerns, "Sensitive Skin"])];
          }
          break;

        case "Do you experience any of the following skin concerns?":
          if (answer) {
            newProfile.concerns = [...new Set([...newProfile.concerns, ...answer.split(',').map(c => c.trim())])];
          }
          break;

        case "How often do you get breakouts?":
          if (answer === "Always" || answer === "Hormonal") {
            newProfile.concerns = [...new Set([...newProfile.concerns, "Acne"])];
          }
          break;

        // Lifestyle factors analysis
        case "How much water do you drink daily?":
          newProfile.lifestyleFactors.hydration = answer;
          if (answer === "Less than 1L") {
            newProfile.recommendations.lifestyle.push("Increase water intake to at least 2L daily for better skin hydration");
          }
          break;

        case "How many hours of sleep do you get on average?":
          newProfile.lifestyleFactors.sleep = answer;
          if (answer === "Less than 5") {
            newProfile.recommendations.lifestyle.push("Aim for 7-8 hours of sleep to allow skin repair and regeneration");
          }
          break;

        case "How often are you exposed to the sun without sunscreen?":
          newProfile.lifestyleFactors.sunExposure = answer;
          if (answer === "Daily") {
            newProfile.recommendations.immediate.push("Start using sunscreen daily to prevent premature aging and skin damage");
          }
          break;

        case "What is your stress level on most days?":
          newProfile.lifestyleFactors.stress = answer;
          if (answer === "High") {
            newProfile.recommendations.lifestyle.push("Practice stress management techniques as stress can exacerbate skin conditions");
          }
          break;

        case "How would you describe your diet?":
          newProfile.lifestyleFactors.diet = answer;
          if (answer === "High in sugar" || answer === "High in processed food") {
            newProfile.recommendations.lifestyle.push("Consider reducing sugar and processed food intake for better skin health");
          }
          break;

        case "Do you live in a humid or dry environment?":
          newProfile.lifestyleFactors.environment = answer;
          if (answer === "Dry") {
            newProfile.recommendations.immediate.push("Use a humidifier and increase moisturizer application due to dry environment");
          }
          break;

        case "Are you exposed to air conditioning or heating for long hours?":
          newProfile.lifestyleFactors.airConditioning = answer;
          if (answer === "Yes") {
            newProfile.recommendations.immediate.push("Use a hydrating mist throughout the day to combat air conditioning/heating effects");
          }
          break;
      }
    }

    // Create a new history entry with the new profile data
    const historyEntry = await prisma.skinProfileHistory.create({
      data: {
        skinProfileId: currentProfile.id,
        skinType: newProfile.skinType,
        concerns: newProfile.concerns,
        allergies: newProfile.allergies,
        currentRoutine: newProfile.currentRoutine,
        lifestyleFactors: newProfile.lifestyleFactors,
        recommendations: newProfile.recommendations
      }
    });

    return {
      currentProfile,
      newProfile,
      historyEntry
    };
  } catch (error) {
    console.error('Error analyzing feedback responses:', error);
    throw error;
  }
}; 