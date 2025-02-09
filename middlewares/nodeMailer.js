// utils/emailHelper.js

const nodemailer = require('nodemailer');
const user=require('../model/user')
const otp=require('../model/Otp')

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use another email service like 'sendgrid', 'mailgun', etc.
    auth: {
        user: process.env.EMAIL_USER,  // Your email address (e.g., 'example@gmail.com')
        pass: process.env.EMAIL_PASS,  // Your email password or app-specific password
    },
});

// Send an email
const sendEmail = async (to, subject, text, htmlContent) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER, // sender address
            to,                           // recipient address
            subject,                      // subject line
            text,                         // plain text body
            html: htmlContent,            // html body (optional)
        });

        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email: ', error);
        throw new Error('Failed to send email');
    }
};

const genarateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp;
}

const sendWelcomeEmail = async (to, name) => {
    const subject = 'Welcome to Our Website';
    const textContent = `Hi ${name}, welcome to our website!`;
    const htmlContent = `<h1>Hi ${name}, welcome to our website!</h1>`;
    await sendEmail(to, subject, textContent, htmlContent);
}

const sendPasswordResetEmail = async (to) => {
    const subject = 'Password Reset Request';
    const otpToSend = genarateOTP();
    const otp = new otp({
        email: to,
        otp: otpToSend
    })
    await otp.save();
    const opt = otpToSend
    const textContent = `Please Use the following OTP to reset your password: ${opt}`;
    const htmlContent = `<h1>Please Use the following OTP to reset your password: ${opt}</h1>`;
    await sendEmail(to, subject, textContent, htmlContent);
}


// Example usage of sendEmail function:
const sendVerificationEmail = async (to) => {
    const subject = 'Please verify your email address';
    const verificationCode = genarateOTP();
    const otp=new otp({
        email:to,
        otp:verificationCode
    })
    await otp.save();
    
    const htmlContent = `
        <div style="text-align: center; font-family: Arial, sans-serif; font-size: 16px;">
            <h1 style="margin-top: 0; font-size: 24px;"> Verify Your Email</h1>
            <p>Your verification code is: <strong>${verificationCode}</strong></p>
            <p>If you did not request this, please ignore this email.</p>
            <p style="font-weight: bold; font-size: 18px;">Thank you!</p>
        </div>
    `;

    await sendEmail(to, subject, `Your verification code is: ${verificationCode}`, htmlContent);
};

module.exports = {
    sendEmail,
    sendVerificationEmail,
};
