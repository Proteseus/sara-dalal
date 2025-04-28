import nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Email transporter configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
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

/**
 * Send a welcome email
 * @param {string} email - User's email address
 * @param {string} username - User's name
 * @param {Object} routine - Routine details
 * @returns {Promise<Object>} - Email sending result
 */
export const sendGreetingEmail = async (email, username) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to our skincare journey!',
      html: `
        <h2>Hello ${username}!</h2>
        <p>Welcome to our skincare journey!</p>
        <p>We're excited to have you on board!</p>
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
 * Send a routine created  email
 * @param {string} email - User's email address
 * @param {string} username - User's name
 * @param {Object} routine - Routine details
 * @returns {Promise<Object>} - Email sending result
 */
export const sendRoutineCreatedEmail = async (email, username, routine) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Routine Has Been Created',
      html: `
        <h2>Hello ${username}!</h2>
        <p>Your routine has been created!</p>
        <p>We're excited to have you on board!</p>
        <p>Stay consistent for the best results!</p>
      `
    };

    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending routine created email:', error);
    throw error;
  }
};
