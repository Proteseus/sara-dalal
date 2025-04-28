import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Function to generate a routine based on recommended products
const generateRoutine = async (userId, recommendedProducts, skinProfile) => {
  // Define category order and names
  const categoryOrder = {
    1: { name: 'Cleanser', order: 1 },
    2: { name: 'Toner', order: 2 },
    3: { name: 'Serum', order: 3 },
    4: { name: 'Moisturizer', order: 4 },
    5: { name: 'Exfoliant', order: 5 },
    6: { name: 'Scrub', order: 6 },
    7: { name: 'Eye Cream', order: 7 },
    8: { name: 'Sunscreen', order: 8 }
  };

  // First, create the routine
  const routine = await prisma.userRoutine.create({
    data: {
      userId,
      name: 'Personalized Skincare Routine',
      isActive: true
    }
  });

  // Group products by time of day and category
  const morningProducts = recommendedProducts.filter(p => p.isDay && p.id);
  const eveningProducts = recommendedProducts.filter(p => p.isNight && p.id);
  const anytimeProducts = recommendedProducts.filter(p => !p.isDay && !p.isNight && p.id);

  // Create routine steps
  const steps = [];
  let order = 1;

  // Helper function to create steps for a time of day
  const createTimeSteps = (products, time) => {
    const timeSteps = [];
    
    // Group products by category
    const productsByCategory = {};
    products.forEach(product => {
      if (!product.id) return; // Skip products without IDs
      if (!productsByCategory[product.categoryId]) {
        productsByCategory[product.categoryId] = [];
      }
      productsByCategory[product.categoryId].push(product);
    });

    // Always include cleanser first if available
    const cleanserCategory = Object.entries(categoryOrder).find(([_, cat]) => cat.name === 'Cleanser');
    if (cleanserCategory) {
      const [categoryId, category] = cleanserCategory;
      const cleanserProducts = productsByCategory[categoryId];
      if (cleanserProducts && cleanserProducts.length > 0) {
        const sortedCleansers = [...cleanserProducts].sort((a, b) => (b.score || 0) - (a.score || 0));
        timeSteps.push({
          order: order++,
          time,
          categoryId: parseInt(categoryId),
          categoryName: category.name,
          notes: getCategoryNotes(category.name, time),
          primaryProduct: sortedCleansers[0],
          alternativeProducts: sortedCleansers.slice(1, 4)
        });
        delete productsByCategory[categoryId]; // Remove cleanser from remaining categories
      }
    }

    // Create steps for remaining categories in order
    Object.entries(categoryOrder)
      .filter(([_, cat]) => cat.name !== 'Cleanser') // Skip cleanser as it's already handled
      .forEach(([categoryId, category]) => {
        const categoryProducts = productsByCategory[categoryId];
        if (categoryProducts && categoryProducts.length > 0) {
          const sortedProducts = [...categoryProducts].sort((a, b) => (b.score || 0) - (a.score || 0));
          timeSteps.push({
            order: order++,
            time,
            categoryId: parseInt(categoryId),
            categoryName: category.name,
            notes: getCategoryNotes(category.name, time),
            primaryProduct: sortedProducts[0],
            alternativeProducts: sortedProducts.slice(1, 4)
          });
        }
      });

    return timeSteps;
  };

  // Helper function to get notes based on category and time
  const getCategoryNotes = (category, time) => {
    const notes = {
      Cleanser: `Start your ${time.toLowerCase()} routine by gently massaging the cleanser onto damp skin in circular motions. Rinse thoroughly with lukewarm water and pat dry with a clean towel. This step removes impurities and prepares your skin for the next products.`,
      Toner: `After cleansing, apply toner to a cotton pad and gently swipe across your face, or pat directly onto skin with clean hands. This helps restore your skin's natural pH balance and enhances absorption of subsequent products.`,
      Serum: `Apply 2-3 drops of serum to clean fingertips and gently press into skin, focusing on areas of concern. Allow the serum to absorb fully before moving to the next step. Serums are concentrated treatments that target specific skin concerns.`,
      Moisturizer: `Take a pea-sized amount of moisturizer and warm it between your fingertips. Gently press and massage into skin using upward motions. This step helps lock in moisture and strengthen your skin's natural barrier.`,
      Exfoliant: `Apply exfoliant to clean, dry skin and gently massage in circular motions for 30-60 seconds. Rinse thoroughly with lukewarm water. This step helps remove dead skin cells and promote cell turnover. Use 2-3 times per week.`,
      Scrub: `Apply scrub to damp skin and gently massage in circular motions for 1-2 minutes, avoiding the eye area. Rinse thoroughly with lukewarm water. This physical exfoliant helps remove dead skin cells and improve skin texture. Use 1-2 times per week.`,
      'Eye Cream': `Using your ring finger (it applies the least pressure), gently pat a small amount of eye cream around the orbital bone, starting from the inner corner and moving outward. This delicate area requires special care and attention.`,
      Sunscreen: time === 'Morning' ? 
        `Apply sunscreen as the final step in your morning routine. Use a nickel-sized amount and dot it across your face, then blend in thoroughly. Reapply every 2 hours if exposed to direct sunlight. This is crucial for preventing premature aging and protecting against UV damage.` : 
        'Not typically used in evening routine'
    };
    return notes[category] || `Apply ${category.toLowerCase()} as part of your ${time.toLowerCase()} routine, following the product's specific instructions.`;
  };

  // Create morning routine steps
  if (morningProducts.length > 0) {
    steps.push(...createTimeSteps(morningProducts, 'Morning'));
  }

  // Create evening routine steps
  if (eveningProducts.length > 0) {
    steps.push(...createTimeSteps(eveningProducts, 'Evening'));
  }

  // Create anytime steps (if any)
  if (anytimeProducts.length > 0) {
    const sortedProducts = [...anytimeProducts].sort((a, b) => (b.score || 0) - (a.score || 0));
    steps.push({
      order: order++,
      time: 'Anytime',
      categoryId: null,
      categoryName: 'Additional Products',
      notes: 'Use these products as needed throughout the day',
      primaryProduct: sortedProducts[0],
      alternativeProducts: sortedProducts.slice(1, 4)
    });
  }

  // Then create all steps with their products and alternatives
  for (const step of steps) {
    if (!step.primaryProduct?.id) continue; // Skip if no primary product
    
    // Create the routine step with primary product
    const createdStep = await prisma.routineStep.create({
      data: {
        routine: {
          connect: {
            id: routine.id
          }
        },
        product: {
          connect: {
            id: step.primaryProduct.id
          }
        },
        order: step.order,
        time: step.time,
        categoryName: step.categoryName,
        notes: step.notes
      }
    });

    // Create alternatives for the step
    if (step.alternativeProducts?.length > 0) {
      for (const altProduct of step.alternativeProducts) {
        if (!altProduct.id) continue;
        
        await prisma.stepAlternative.create({
          data: {
            step: {
              connect: {
                id: createdStep.id
              }
            },
            product: {
              connect: {
                id: altProduct.id
              }
            },
            name: altProduct.name,
            brand: altProduct.brand,
            description: altProduct.description,
            price: altProduct.price || 0,
            size: altProduct.size || 0,
            unit: altProduct.unit || '',
            keyIngredients: altProduct.keyIngredients || [],
            isNatural: altProduct.isNatural || false,
            isGentle: altProduct.isGentle || false,
            score: altProduct.score,
            scoreBreakdown: altProduct.scoreBreakdown,
            userRating: altProduct.userRating
          }
        });
      }
    }
  }

  // Fetch the complete routine with all steps, products, and alternatives
  const completeRoutine = await prisma.userRoutine.findUnique({
    where: { id: routine.id },
    include: {
      steps: {
        include: {
          product: true,
          alternatives: {
            include: {
              product: true
            }
          }
        },
        orderBy: {
          order: 'asc'
        }
      }
    }
  });

  return completeRoutine;
};

// Function to analyze responses and generate product recommendations
const analyzeProductRecommendations = async (responses, skinProfile) => {
  // Create a map of responses for easy access
  const responseMap = new Map(responses.map(r => [r.questionId, r.answer]));

  // Get all products from database with their feedback
  const allProducts = await prisma.product.findMany({
    include: {
      category: true,
      feedback: {
        where: {
          userId: skinProfile.userId
        }
      }
    }
  });

  // Initialize scoring criteria
  const scoredProducts = allProducts.map(product => {
    let score = 0;
    let scoreBreakdown = {
      skinTypeMatch: 0,
      concernMatch: 0,
      lifestyleCompatibility: 0,
      environmentalAdaptation: 0,
      userPreferences: 0,
      routineCompatibility: 0,
      priceMatch: 0,
      userRating: 0
    };

    // 1. Skin Type Match (Base Score)
    if (skinProfile.skinType && product.skinType) {
      const userSkinType = skinProfile.skinType.toLowerCase();
      if (product.skinType.some(type => type.toLowerCase().includes(userSkinType))) {
        score += 3;
        scoreBreakdown.skinTypeMatch = 3;
      }
    }

    // 2. Concern Match (Weighted by severity)
    if (skinProfile.concerns && product.targetConcerns) {
      const userConcerns = skinProfile.concerns.map(c => c.toLowerCase());
      const matchedConcerns = product.targetConcerns.filter(concern => 
        userConcerns.some(userConcern => concern.toLowerCase().includes(userConcern))
      );
      
      // Prioritize primary concerns
      const primaryConcerns = ['acne', 'wrinkles', 'hyperpigmentation'];
      matchedConcerns.forEach(concern => {
        if (primaryConcerns.some(pc => concern.toLowerCase().includes(pc))) {
          score += 2;
          scoreBreakdown.concernMatch += 2;
        } else {
          score += 1;
          scoreBreakdown.concernMatch += 1;
        }
      });
    }

    // 3. Lifestyle Compatibility
    if (skinProfile.lifestyleFactors) {
      // Hydration
      if (skinProfile.lifestyleFactors.hydration === "Less than 1L" && 
          product.keyIngredients.some(ing => ing.toLowerCase().includes('hyaluronic'))) {
        score += 1;
        scoreBreakdown.lifestyleCompatibility += 1;
      }

      // Sun Exposure
      if (skinProfile.lifestyleFactors.sunExposure === "Daily" && 
          product.keyIngredients.some(ing => ing.toLowerCase().includes('vitamin c'))) {
        score += 1;
        scoreBreakdown.lifestyleCompatibility += 1;
      }
    }

    // 4. Environmental Adaptation
    if (skinProfile.lifestyleFactors) {
      // Dry Environment
      if (skinProfile.lifestyleFactors.environment === "Dry" && 
          product.keyIngredients.some(ing => ing.toLowerCase().includes('ceramide'))) {
        score += 1;
        scoreBreakdown.environmentalAdaptation += 1;
      }

      // Air Conditioning
      if (skinProfile.lifestyleFactors.airConditioning === "Yes" && 
          product.keyIngredients.some(ing => ing.toLowerCase().includes('glycerin'))) {
        score += 1;
        scoreBreakdown.environmentalAdaptation += 1;
      }
    }

    // 5. User Preferences
    const naturalPreference = responseMap.get(
      responses.find(r => r.questionId === "preference_natural")?.id
    );
    if (naturalPreference === "Yes" && product.isNatural) {
      score += 2;
      scoreBreakdown.userPreferences += 2;
    }

    const hasSensitiveSkin = responseMap.get(
      responses.find(r => r.questionId === "sensitive_skin")?.id
    ) === "Yes";
    if (hasSensitiveSkin && product.isGentle) {
      score += 2;
      scoreBreakdown.userPreferences += 2;
    }

    // 6. Current Routine Compatibility
    if (skinProfile.currentRoutine) {
      const currentRoutine = skinProfile.currentRoutine;
      if (!currentRoutine.includes(product.category?.name?.toLowerCase() || '')) {
        score += 1;
        scoreBreakdown.routineCompatibility += 1;
      }
    }

    // 7. Price Range Consideration
    const pricePreference = responseMap.get(
      responses.find(r => r.questionId === "price_range")?.id
    );
    if (pricePreference && product.price) {
      const priceRanges = {
        "Less than 100 SAR": { min: 0, max: 100 },
        "100-300 SAR": { min: 100, max: 300 },
        "300-500 SAR": { min: 300, max: 500 },
        "More than 500 SAR": { min: 500, max: Infinity }
      };
      
      const range = priceRanges[pricePreference];
      if (product.price >= range.min && product.price <= range.max) {
        score += 1;
        scoreBreakdown.priceMatch += 1;
      }
    }

    // Add user rating to score if exists
    if (product.feedback && product.feedback.length > 0) {
      const userRating = product.feedback[0].rating;
      score += userRating;
      scoreBreakdown.userRating = userRating;
    }

    return {
      ...product,
      score,
      scoreBreakdown,
      userRating: product.feedback?.[0]?.rating || 0
    };
  });

  // Group products by category
  const productsByCategory = {};
  scoredProducts.forEach(product => {
    const categoryId = product.categoryId || 'other';
    if (!productsByCategory[categoryId]) {
      productsByCategory[categoryId] = {
        category: product.category,
        products: []
      };
    }
    productsByCategory[categoryId].products.push(product);
  });

  // Select top products from each category and format as alternatives
  const recommendedProducts = [];
  
  // Helper function to add products for a category
  const addCategoryProducts = (categoryGroup) => {
    if (categoryGroup.products.length > 0) {
      const sortedProducts = categoryGroup.products.sort((a, b) => b.score - a.score);
      const topProduct = sortedProducts[0];
      const alternatives = sortedProducts.slice(1, 4).filter(p => p.score > 0);
      
      recommendedProducts.push({
        category: categoryGroup.category,
        alternatives: [
          {
            id: topProduct.id,
            name: topProduct.name,
            brand: topProduct.brand,
            description: topProduct.description,
            price: topProduct.price,
            size: topProduct.size,
            unit: topProduct.unit,
            keyIngredients: topProduct.keyIngredients,
            isNatural: topProduct.isNatural,
            isGentle: topProduct.isGentle,
            score: topProduct.score,
            scoreBreakdown: topProduct.scoreBreakdown,
            userRating: topProduct.userRating
          },
          ...alternatives.map(product => ({
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
            scoreBreakdown: product.scoreBreakdown,
            userRating: product.userRating
          }))
        ]
      });
    }
  };

  // First, ensure cleanser and moisturizer are included
  const essentialCategories = ['Cleanser', 'Moisturizer'];
  essentialCategories.forEach(categoryName => {
    const categoryGroup = Object.values(productsByCategory).find(
      group => group.category?.name === categoryName
    );
    if (categoryGroup) {
      addCategoryProducts(categoryGroup);
      // Remove from productsByCategory to avoid duplicate processing
      delete productsByCategory[categoryGroup.category?.id];
    }
  });

  // Then process remaining categories
  Object.values(productsByCategory).forEach(categoryGroup => {
    addCategoryProducts(categoryGroup);
  });

  // Sort categories by average score of their top product
  return recommendedProducts.sort((a, b) => {
    const scoreA = a.alternatives[0]?.score || 0;
    const scoreB = b.alternatives[0]?.score || 0;
    return scoreB - scoreA;
  });
};

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
  
    // Get product recommendations
    const recommendedProducts = await analyzeProductRecommendations(responses, skinProfile);
  
    // Format product recommendations for the skin profile
    skinProfile.recommendations.products = recommendedProducts.map(category => ({
      category: category.category,
      alternatives: category.alternatives
    }));
  
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

    // Flatten the recommended products for routine generation
    const flattenedProducts = recommendedProducts.flatMap(category => 
      category.alternatives.map(product => ({
        ...product,
        categoryId: category.category?.id,
        isDay: category.category?.name === 'Sunscreen' || category.category?.name === 'Moisturizer',
        isNight: category.category?.name === 'Exfoliant' || category.category?.name === 'Serum'
      }))
    );

    // After creating/updating skin profile, generate routine
    const routine = await generateRoutine(userId, flattenedProducts, skinProfile);

    return {
      ...updatedProfile,
      routine
    };
};
