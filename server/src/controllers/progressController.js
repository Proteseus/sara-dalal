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
    const { startDate, endDate } = req.query;

    // Get all responses within the date range
    const responses = await prisma.userResponse.findMany({
      where: {
        userId,
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      },
      include: {
        question: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    if (responses.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Not enough responses to generate progress report'
      });
    }

    // Group responses by questionnaire date
    const groupedResponses = responses.reduce((acc, response) => {
      const date = response.createdAt.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(response);
      return acc;
    }, {});

    // Get the first and last questionnaire responses
    const dates = Object.keys(groupedResponses).sort();
    const firstResponses = groupedResponses[dates[0]];
    const lastResponses = groupedResponses[dates[dates.length - 1]];

    // Generate progress report
    const progressReport = compareResponses(firstResponses, lastResponses);

    // Add timeline data
    progressReport.timeline = dates.map(date => ({
      date,
      responses: groupedResponses[date]
    }));

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

/**
 * Get progress summary for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getProgressSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all responses
    const responses = await prisma.userResponse.findMany({
      where: { userId },
      include: {
        question: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    if (responses.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No responses found'
      });
    }

    // Group responses by month
    const monthlyProgress = responses.reduce((acc, response) => {
      const month = response.createdAt.toISOString().slice(0, 7); // YYYY-MM
      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push(response);
      return acc;
    }, {});

    // Calculate monthly averages for numerical questions
    const summary = Object.entries(monthlyProgress).map(([month, monthResponses]) => {
      const numericalResponses = monthResponses.filter(r => 
        r.question.type === 'NUMERICAL' || r.question.type === 'RATING'
      );

      const averages = numericalResponses.reduce((acc, response) => {
        const value = parseFloat(response.answer);
        if (!acc[response.question.text]) {
          acc[response.question.text] = {
            sum: 0,
            count: 0
          };
        }
        acc[response.question.text].sum += value;
        acc[response.question.text].count += 1;
        return acc;
      }, {});

      // Calculate final averages
      Object.keys(averages).forEach(question => {
        averages[question] = averages[question].sum / averages[question].count;
      });

      return {
        month,
        averages
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