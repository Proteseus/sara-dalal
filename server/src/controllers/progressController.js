import { PrismaClient } from '@prisma/client';
import { compareResponses } from '../utils/feedbackComparison.js';

const prisma = new PrismaClient();

/**
 * Get progress report comparing two sets of questionnaire responses
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getProgressReport = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get the skin profile with the last two history entries
    const skinProfile = await prisma.skinProfile.findUnique({
      where: { userId },
      include: {
        history: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 2
        }
      }
    });

    if (!skinProfile) {
      return res.status(404).json({
        success: false,
        error: 'No skin profile found'
      });
    }

    if (skinProfile.history.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Not enough history entries to generate progress report'
      });
    }

    // Get the previous and latest history entries
    const [latestEntry, previousEntry] = skinProfile.history;

    // Compare the profiles
    const progressReport = {
      skinType: {
        previous: previousEntry.skinType,
        current: latestEntry.skinType,
        changed: previousEntry.skinType !== latestEntry.skinType
      },
      concerns: {
        previous: previousEntry.concerns,
        current: latestEntry.concerns,
        added: latestEntry.concerns.filter(c => !previousEntry.concerns.includes(c)),
        removed: previousEntry.concerns.filter(c => !latestEntry.concerns.includes(c))
      },
      lifestyleFactors: {
        hydration: {
          previous: previousEntry.lifestyleFactors.hydration,
          current: latestEntry.lifestyleFactors.hydration,
          improved: isLifestyleFactorImproved('hydration', previousEntry.lifestyleFactors.hydration, latestEntry.lifestyleFactors.hydration)
        },
        sleep: {
          previous: previousEntry.lifestyleFactors.sleep,
          current: latestEntry.lifestyleFactors.sleep,
          improved: isLifestyleFactorImproved('sleep', previousEntry.lifestyleFactors.sleep, latestEntry.lifestyleFactors.sleep)
        },
        sunExposure: {
          previous: previousEntry.lifestyleFactors.sunExposure,
          current: latestEntry.lifestyleFactors.sunExposure,
          improved: isLifestyleFactorImproved('sunExposure', previousEntry.lifestyleFactors.sunExposure, latestEntry.lifestyleFactors.sunExposure)
        },
        stress: {
          previous: previousEntry.lifestyleFactors.stress,
          current: latestEntry.lifestyleFactors.stress,
          improved: isLifestyleFactorImproved('stress', previousEntry.lifestyleFactors.stress, latestEntry.lifestyleFactors.stress)
        },
        diet: {
          previous: previousEntry.lifestyleFactors.diet,
          current: latestEntry.lifestyleFactors.diet,
          improved: isLifestyleFactorImproved('diet', previousEntry.lifestyleFactors.diet, latestEntry.lifestyleFactors.diet)
        }
      },
      recommendations: {
        previous: previousEntry.recommendations,
        current: latestEntry.recommendations,
        new: latestEntry.recommendations.immediate.filter(r => !previousEntry.recommendations.immediate.includes(r))
          .concat(latestEntry.recommendations.lifestyle.filter(r => !previousEntry.recommendations.lifestyle.includes(r)))
      }
    };

    res.status(200).json({
      success: true,
      data: progressReport
    });
  } catch (error) {
    console.error('Error generating progress report:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate progress report'
    });
  }
};

// Helper function to determine if a lifestyle factor has improved
function isLifestyleFactorImproved(factor, previous, current) {
  if (!previous || !current) return null;
  
  const improvementMap = {
    hydration: {
      'Less than 1L': 1,
      '1-2L': 2,
      '2-3L': 3,
      'More than 3L': 4
    },
    sleep: {
      'Less than 5': 1,
      '5-6': 2,
      '6-7': 3,
      '7-8': 4,
      'More than 8': 5
    },
    sunExposure: {
      'Daily': 1,
      'Weekly': 2,
      'Monthly': 3,
      'Rarely': 4,
      'Never': 5
    },
    stress: {
      'Very High': 1,
      'High': 2,
      'Moderate': 3,
      'Low': 4,
      'Very Low': 5
    },
    diet: {
      'Poor': 1,
      'Average': 2,
      'Good': 3,
      'Excellent': 4
    }
  };

  const previousScore = improvementMap[factor][previous];
  const currentScore = improvementMap[factor][current];
  
  return currentScore > previousScore;
}

/**
 * Get progress summary for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getProgressSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get the skin profile with all history
    const skinProfile = await prisma.skinProfile.findUnique({
      where: { userId },
      include: {
        history: {
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });

    if (!skinProfile) {
      return res.status(404).json({
        success: false,
        error: 'No skin profile found'
      });
    }

    if (skinProfile.history.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No history entries found'
      });
    }

    // Group history entries by month
    const monthlyProgress = skinProfile.history.reduce((acc, entry) => {
      const month = entry.createdAt.toISOString().slice(0, 7); // YYYY-MM
      if (!acc[month]) {
        acc[month] = {
          entries: [],
          metrics: {
            skinHealth: {},
            lifestyle: {},
            routineAdherence: {},
            productEfficacy: {}
          }
        };
      }
      acc[month].entries.push(entry);
      return acc;
    }, {});

    // Calculate monthly metrics
    const summary = Object.entries(monthlyProgress).map(([month, monthData]) => {
      const numericalResponses = monthData.entries.flatMap(entry => 
        entry.responses.filter(r => 
          r.question.type === 'NUMERICAL' || r.question.type === 'RATING'
        )
      );

      // Calculate metrics for different categories
      const metrics = numericalResponses.reduce((acc, response) => {
        const value = parseFloat(response.answer);
        const category = response.question.category || 'general';
        
        if (!acc[category]) {
          acc[category] = {};
        }
        
        if (!acc[category][response.question.text]) {
          acc[category][response.question.text] = {
            sum: 0,
            count: 0,
            min: Infinity,
            max: -Infinity
          };
        }
        
        const metric = acc[category][response.question.text];
        metric.sum += value;
        metric.count += 1;
        metric.min = Math.min(metric.min, value);
        metric.max = Math.max(metric.max, value);
        
        return acc;
      }, {});

      // Calculate final metrics for each category
      Object.entries(metrics).forEach(([category, questions]) => {
        Object.entries(questions).forEach(([question, data]) => {
          metrics[category][question] = {
            average: data.sum / data.count,
            range: {
              min: data.min,
              max: data.max
            },
            consistency: (data.max - data.min) / data.count
          };
        });
      });

      // Calculate trend indicators
      const trendIndicators = {};
      Object.entries(metrics).forEach(([category, questions]) => {
        trendIndicators[category] = {};
        Object.entries(questions).forEach(([question, data]) => {
          trendIndicators[category][question] = {
            direction: data.average > (data.range.min + data.range.max) / 2 ? 'improving' : 'declining',
            stability: data.consistency < 0.5 ? 'stable' : 'volatile'
          };
        });
      });

      return {
        month,
        metrics,
        trendIndicators,
        entryCount: monthData.entries.length
      };
    });

    res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Error generating progress summary:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate progress summary'
    });
  }
}; 