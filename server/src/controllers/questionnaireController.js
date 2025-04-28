import { PrismaClient } from '@prisma/client';
import { analyzeResponses } from '../utils/alnalyzeResponse.js';
import { analyzeFeedbackResponses } from '../utils/feedbackAnalysis.js';
import { sendRoutineCreatedEmail } from '../utils/notifications.js';

const prisma = new PrismaClient();

const FEEDBACK_QUESTIONS = [3, 4, 5, 6, 12, 13, 14, 15, 16, 17, 18];

export const getQuestions = async (req, res) => {
  try {
    const questions = await prisma.question.findMany({
      orderBy: {
        order: 'asc'
      }
    });

    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Error fetching questions' });
  }
};

export const getFeedbackQuestions = async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if user has a skin profile
    const skinProfile = await prisma.skinProfile.findUnique({
      where: { userId }
    });

    if (!skinProfile) {
      return res.status(404).json({ error: 'No skin profile found' });
    }

    // Get the feedback questions
    const questions = await prisma.question.findMany({
      where: {
        id: {
          in: [3, 4, 5, 6, 12, 13, 14, 15, 16, 17, 18]
        }
      },
      orderBy: {
        order: 'asc'
      }
    });

    res.json(questions);
  } catch (error) {
    console.error('Error fetching feedback questions:', error);
    res.status(500).json({ error: 'Error fetching feedback questions' });
  }
};

export const submitResponses = async (req, res) => {
  try {
    const userId = req.user.id;
    const { responses } = req.body;

    // Validate responses
    const questions = await prisma.question.findMany();
    const questionIds = new Set(questions.map(q => q.id));
    
    for (const response of responses) {
      if (!questionIds.has(response.questionId)) {
        return res.status(400).json({ error: `Invalid question ID: ${response.questionId}` });
      }
    }

    // Create or update responses
    const createdResponses = await Promise.all(
      responses.map(response => 
        prisma.userResponse.upsert({
          where: {
            userId_questionId: {
              userId,
              questionId: response.questionId
            }
          },
          update: {
            answer: response.answer
          },
          create: {
            userId,
            questionId: response.questionId,
            answer: response.answer
          }
        })
      )
    );

    // Analyze responses and update skin profile
    const skinProfile = await analyzeResponses(userId, responses);

    // Send routine created email
    await sendRoutineCreatedEmail(userId);

    res.status(201).json({
      message: 'Responses submitted successfully',
      count: createdResponses.length,
      skinProfile
    });
  } catch (error) {
    console.error('Error submitting responses:', error);
    res.status(500).json({ error: 'Error submitting responses' });
  }
};

export const getUserResponses = async (req, res) => {
  try {
    const { userId } = req.user.id;

    const responses = await prisma.userResponse.findMany({
      where: { userId },
      include: {
        question: true
      }
    });

    res.json(responses);
  } catch (error) {
    console.error('Error fetching user responses:', error);
    res.status(500).json({ error: 'Error fetching user responses' });
  }
};

export const getSkinProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's skin profile
    const skinProfile = await prisma.skinProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    if (!skinProfile) {
      return res.status(200).json({ error: 'Skin profile not found' });
    }

    // Get user's responses for additional context
    const responses = await prisma.userResponse.findMany({
      where: { userId },
      include: {
        question: true
      }
    });

    // Format the response
    const profile = {
      ...skinProfile,
      responses: responses.map(r => ({
        question: r.question.text,
        answer: r.answer
      }))
    };

    res.json(profile);
  } catch (error) {
    console.error('Error fetching skin profile:', error);
    res.status(500).json({ error: 'Error fetching skin profile' });
  }
}; 

export const getSkinProfileHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's skin profile with history
    const skinProfile = await prisma.skinProfile.findUnique({
      where: { userId },
      include: {
        history: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!skinProfile) {
      return res.status(404).json({ error: 'Skin profile not found' });
    }

    res.json(skinProfile.history);
  } catch (error) {
    console.error('Error fetching skin profile history:', error);
    res.status(500).json({ error: 'Error fetching skin profile history' });
  }
};

export const submitFeedback = async (req, res) => {
  try {
    const userId = req.user.id;
    const { responses } = req.body;

    // Validate responses
    const questions = await prisma.question.findMany({
      where: {
        id: {
          in: FEEDBACK_QUESTIONS
        }
      }
    });

    const questionIds = new Set(questions.map(q => q.id));
    
    for (const response of responses) {
      if (!questionIds.has(response.questionId)) {
        return res.status(400).json({ error: `Invalid question ID: ${response.questionId}` });
      }
    }

    // Create or update responses
    const createdResponses = await Promise.all(
      responses.map(response => 
        prisma.userResponse.upsert({
          where: {
            userId_questionId: {
              userId,
              questionId: response.questionId
            }
          },
          update: {
            answer: response.answer
          },
          create: {
            userId,
            questionId: response.questionId,
            answer: response.answer
          }
        })
      )
    );

    // Analyze feedback responses and update skin profile
    const updatedProfile = await analyzeFeedbackResponses(userId, responses);

    res.status(201).json({
      message: 'Feedback submitted successfully',
      count: createdResponses.length,
      skinProfile: updatedProfile
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: 'Error submitting feedback' });
  }
};
