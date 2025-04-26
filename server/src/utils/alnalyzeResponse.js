import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const analyzeResponses = async (userId, responses) => {
    // Get all questions with their responses
    const questions = await prisma.question.findMany({
      where: {
        id: {
          in: responses.map(r => r.questionId)
        }
      }
    });
  
    // Create a map of responses for easy access
    const responseMap = new Map(responses.map(r => [r.questionId, r.answer]));
  
    // Initialize skin profile data
    let skinProfile = {
      skinType: null,
      concerns: [],
      allergies: [],
      currentRoutine: [],
      lifestyleFactors: {
        hydration: null,
        sleep: null,
        sunExposure: null,
        stress: null,
        diet: null,
        environment: null,
        airConditioning: null
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
  
      switch (question.text) {
        case "How would you describe your skin type?":
          skinProfile.skinType = answer;
          break;
  
        case "Do you experience any of the following skin concerns?":
          if (answer) {
            skinProfile.concerns = answer.split(',').map(c => c.trim());
          }
          break;
  
        case "Do you have any existing skin conditions?":
          if (answer && answer !== "None") {
            skinProfile.concerns = [...skinProfile.concerns, ...answer.split(',').map(c => c.trim())];
          }
          break;
  
        case "What is your current skincare routine?":
          if (answer) {
            skinProfile.currentRoutine = answer.split(',').map(c => c.trim());
          }
          break;
  
        case "Do you have any known allergies to skincare ingredients?":
          if (answer === "Yes") {
            skinProfile.allergies = ["Unknown - needs follow-up"];
          }
          break;
  
        // Lifestyle factors analysis
        case "How much water do you drink daily?":
          skinProfile.lifestyleFactors.hydration = answer;
          if (answer === "Less than 1L") {
            skinProfile.recommendations.lifestyle.push("Increase water intake to at least 2L daily for better skin hydration");
          }
          break;
  
        case "How many hours of sleep do you get on average?":
          skinProfile.lifestyleFactors.sleep = answer;
          if (answer === "Less than 5") {
            skinProfile.recommendations.lifestyle.push("Aim for 7-8 hours of sleep to allow skin repair and regeneration");
          }
          break;
  
        case "How often are you exposed to the sun without sunscreen?":
          skinProfile.lifestyleFactors.sunExposure = answer;
          if (answer === "Daily") {
            skinProfile.recommendations.immediate.push("Start using sunscreen daily to prevent premature aging and skin damage");
          }
          break;
  
        case "What is your stress level on most days?":
          skinProfile.lifestyleFactors.stress = answer;
          if (answer === "High") {
            skinProfile.recommendations.lifestyle.push("Practice stress management techniques as stress can exacerbate skin conditions");
          }
          break;
  
        case "How would you describe your diet?":
          skinProfile.lifestyleFactors.diet = answer;
          if (answer === "High in sugar" || answer === "High in processed food") {
            skinProfile.recommendations.lifestyle.push("Consider reducing sugar and processed food intake for better skin health");
          }
          break;
  
        case "Do you live in a humid or dry environment?":
          skinProfile.lifestyleFactors.environment = answer;
          if (answer === "Dry") {
            skinProfile.recommendations.immediate.push("Use a humidifier and increase moisturizer application due to dry environment");
          }
          break;
  
        case "Are you exposed to air conditioning or heating for long hours?":
          skinProfile.lifestyleFactors.airConditioning = answer;
          if (answer === "Yes") {
            skinProfile.recommendations.immediate.push("Use a hydrating mist throughout the day to combat air conditioning/heating effects");
          }
          break;
      }
    }
  
    // Get product recommendations from database based on skin type and concerns
    if (skinProfile.skinType) {
      let recommendedProducts = await prisma.product.findMany({
        where: {
          AND: [
            {
              skinType: {
                has: skinProfile.skinType.toLowerCase()
              }
            },
            {
              OR: skinProfile.concerns.map(concern => ({
                targetConcerns: {
                  has: concern.toLowerCase()
                }
              }))
            }
          ]
        },
        select: {
          id: true,
          name: true,
          brand: true,
          description: true,
          price: true,
          size: true,
          unit: true,
          keyIngredients: true,
          isNatural: true,
          isGentle: true,
          categoryId: true
        }
      });
  
      // Filter products based on user preferences
      const naturalPreference = responseMap.get(
        questions.find(q => q.text === "Do you prefer natural/organic skincare?")?.id
      );
  
      if (naturalPreference === "Yes") {
        recommendedProducts = recommendedProducts.filter(product => product.isNatural);
      }
  
      // Check for gentle products if user has sensitive skin
      const hasSensitiveSkin = responseMap.get(
        questions.find(q => q.text === "Do you have sensitive skin?")?.id
      ) === "Yes";
  
      if (hasSensitiveSkin) {
        recommendedProducts = recommendedProducts.filter(product => product.isGentle);
      }
  
      // Calculate scores for each product
      const scoredProducts = recommendedProducts.map(product => {
        let score = 0;
        
        // 1. Skin Type Match (Base Score)
        if (product.skinType.includes(skinProfile.skinType.toLowerCase())) {
          score += 3; // Increased from 2 to 3 as it's the most important factor
        }
  
        // 2. Concern Match (Weighted by severity)
        skinProfile.concerns.forEach(concern => {
          if (product.targetConcerns.includes(concern.toLowerCase())) {
            // Prioritize primary concerns
            if (concern.toLowerCase() === "acne" || 
                concern.toLowerCase() === "wrinkles" || 
                concern.toLowerCase() === "hyperpigmentation") {
              score += 2;
            } else {
              score += 1;
            }
          }
        });
  
        // 3. Lifestyle Compatibility
        // Check if product ingredients match lifestyle needs
        if (skinProfile.lifestyleFactors.hydration === "Less than 1L" && 
            product.keyIngredients.includes("Hyaluronic Acid")) {
          score += 1;
        }
        
        if (skinProfile.lifestyleFactors.sunExposure === "Daily" && 
            product.keyIngredients.includes("Vitamin C")) {
          score += 1;
        }
  
        // 4. Environmental Adaptation
        if (skinProfile.lifestyleFactors.environment === "Dry" && 
            product.keyIngredients.includes("Ceramides")) {
          score += 1;
        }
  
        if (skinProfile.lifestyleFactors.airConditioning === "Yes" && 
            product.keyIngredients.includes("Glycerin")) {
          score += 1;
        }
  
        // 5. User Preferences
        if (naturalPreference === "Yes" && product.isNatural) {
          score += 2; // Increased from 1 to 2 as it's a strong preference
        }
  
        if (hasSensitiveSkin && product.isGentle) {
          score += 2; // Increased from 1 to 2 as it's a health consideration
        }
  
        // 6. Current Routine Compatibility
        const currentRoutine = skinProfile.currentRoutine.map(item => item.toLowerCase());
        if (currentRoutine.length > 0) {
          // Check if product complements existing routine
          if (!currentRoutine.includes(product.categoryId.toLowerCase())) {
            score += 1; // Bonus for adding a new product type
          }
        }
  
        // 7. Price Range Consideration
        const pricePreference = responseMap.get(
          questions.find(q => q.text === "How much do you usually spend on skincare products?")?.id
        );
        
        if (pricePreference) {
          const priceRanges = {
            "Less than 100 SAR": { min: 0, max: 100 },
            "100-300 SAR": { min: 100, max: 300 },
            "300-500 SAR": { min: 300, max: 500 },
            "More than 500 SAR": { min: 500, max: Infinity }
          };
          
          const range = priceRanges[pricePreference];
          if (product.price >= range.min && product.price <= range.max) {
            score += 1;
          }
        }
  
        return {
          ...product,
          score,
          scoreBreakdown: {
            skinTypeMatch: product.skinType.includes(skinProfile.skinType.toLowerCase()) ? 3 : 0,
            concernMatch: skinProfile.concerns.filter(c => 
              product.targetConcerns.includes(c.toLowerCase())
            ).length,
            lifestyleCompatibility: (skinProfile.lifestyleFactors.hydration === "Less than 1L" && 
              product.keyIngredients.includes("Hyaluronic Acid") ? 1 : 0) +
              (skinProfile.lifestyleFactors.sunExposure === "Daily" && 
              product.keyIngredients.includes("Vitamin C") ? 1 : 0),
            environmentalAdaptation: (skinProfile.lifestyleFactors.environment === "Dry" && 
              product.keyIngredients.includes("Ceramides") ? 1 : 0) +
              (skinProfile.lifestyleFactors.airConditioning === "Yes" && 
              product.keyIngredients.includes("Glycerin") ? 1 : 0),
            userPreferences: (naturalPreference === "Yes" && product.isNatural ? 2 : 0) +
              (hasSensitiveSkin && product.isGentle ? 2 : 0),
            routineCompatibility: currentRoutine.length > 0 && 
              !currentRoutine.includes(product.categoryId.toLowerCase()) ? 1 : 0,
            priceMatch: pricePreference && product.price >= priceRanges[pricePreference].min && 
              product.price <= priceRanges[pricePreference].max ? 1 : 0
          }
        };
      });
  
      // Group products by category
      const productsByCategory = {};
      scoredProducts.forEach(product => {
        if (!productsByCategory[product.categoryId]) {
          productsByCategory[product.categoryId] = [];
        }
        productsByCategory[product.categoryId].push(product);
      });
  
      // Select top 2 products from each category
      const topProducts = [];
      Object.values(productsByCategory).forEach(categoryProducts => {
        // Sort by score in descending order
        const sortedProducts = categoryProducts.sort((a, b) => b.score - a.score);
        // Take top 2 products
        topProducts.push(...sortedProducts.slice(0, 2));
      });
  
      // Format product recommendations
      skinProfile.recommendations.products = topProducts.map(product => ({
        id: product.id,
        name: product.name,
        brand: product.brand,
        description: product.description,
        price: product.price,
        size: product.size,
        unit: product.unit,
        keyIngredients: product.keyIngredients,
        isNatural: product.isNatural,
        isGentle: product.isGentle,
        score: product.score,
        scoreBreakdown: product.scoreBreakdown
      }));
    }
  
    // Create or update skin profile
    const updatedProfile = await prisma.skinProfile.upsert({
      where: { userId },
      update: {
        skinType: skinProfile.skinType,
        concerns: skinProfile.concerns,
        allergies: skinProfile.allergies,
        currentRoutine: skinProfile.currentRoutine.join(', '),
        lifestyleFactors: skinProfile.lifestyleFactors,
        recommendations: skinProfile.recommendations
      },
      create: {
        userId,
        skinType: skinProfile.skinType,
        concerns: skinProfile.concerns,
        allergies: skinProfile.allergies,
        currentRoutine: skinProfile.currentRoutine.join(', '),
        lifestyleFactors: skinProfile.lifestyleFactors,
        recommendations: skinProfile.recommendations
      }
    });

    return updatedProfile;
};
