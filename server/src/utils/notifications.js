import nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

/**
 * Send a routine reminder email
 * @param {string} email - User's email address
 * @param {string} username - User's name
 * @param {Object} routine - Routine details
 * @returns {Promise<Object>} - Email sending result
 */
export const sendRoutineReminder = async (email, username, routine) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Daily Skincare Routine Reminder',
      html: `
        <h2>Hello ${username}!</h2>
        <p>It's time for your skincare routine:</p>
        <ul>
          ${routine.steps.map(step => `
            <li>
              <strong>${step.productName}</strong>
              ${step.time ? `(Time: ${step.time})` : ''}
            </li>
          `).join('')}
        </ul>
        <p>Stay consistent for the best results!</p>
      `
    };

    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending routine reminder:', error);
    throw error;
  }
};

/**
 * Schedule routine reminders for all users
 * @returns {Promise<void>}
 */
export const scheduleRoutineReminders = async () => {
  try {
    // Get all users with active routines
    const users = await prisma.user.findMany({
      where: {
        routines: {
          some: {
            isActive: true
          }
        }
      },
      include: {
        routines: {
          where: {
            isActive: true
          },
          include: {
            steps: true
          }
        }
      }
    });

    // Send reminders to each user
    for (const user of users) {
      for (const routine of user.routines) {
        await sendRoutineReminder(user.email, user.name, routine);
      }
    }
  } catch (error) {
    console.error('Error scheduling routine reminders:', error);
    throw error;
  }
}; 