// utils/emailHelper.js

const nodemailer = require('nodemailer');
const user=require('../models/user')
const otp=require('../models/Otp')

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,//true for 465, false for 587 this 587 means it is not secure because of that 
    requireTLS: true,
    auth: {
        user: process.env.EMAIL_USERNAME,  // Your email address (e.g., 'example@gmail.com')
        pass: process.env.EMAIL_PASSWORD,  // Your email password or app-specific password
    },

});

// Send an email
const sendEmailtoUser = async (to, subject, htmlContent) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USERNAME, // sender address
            to:to,                           // recipient address
            subject:subject,                      // subject line
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
    const htmlContent = `<h1>Hi ${name}, welcome to our website!</h1>`;
    await sendEmailtoUser(to, subject, htmlContent);
}

const sendPasswordResetEmail = async (to) => {
    const subject = 'Password Reset Request';
    const otpToSend = genarateOTP();
    const otp_to_send = await new otp({
        email: to,
        otp: otpToSend
    })
    await otp_to_send.save();
    const opt = otpToSend
    const htmlContent = `<h1>Please Use the following OTP to reset your password: ${opt}</h1>`;
    await sendEmailtoUser(to, subject, htmlContent);
}


// Example usage of sendEmail function:
const sendVerificationEmail = async (to) => {
    const subject = 'Please verify your email address';
    const verificationCode = genarateOTP();
    const otp_to_send=await new otp({
        email:to,
        otp:verificationCode
    })
    await otp_to_send.save();
    
    const htmlContent = `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; padding: 20px;">
                <img src="https://i.imgur.com/7B6v3kX.png" alt="Logo" style="width: 150px; margin-bottom: 20px;">
            </div>
            <div style="text-align: center; font-family: Arial, sans-serif; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
                <h1 style="color: #2c3e50; margin: 0 0 20px 0; font-size: 28px;">Verify Your Email Address</h1>
                <p style="color: #34495e; font-size: 16px; line-height: 24px; margin-bottom: 20px;">To complete your registration, please use the verification code below:</p>
                <div style="background-color: #e9ecef; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <span style="font-size: 32px; font-weight: bold; color: #2c3e50; letter-spacing: 5px;">${verificationCode}</span>
                </div>
                <p style="color: #7f8c8d; font-size: 14px; margin: 20px 0;">This code will expire in 10 minutes. If you did not request this verification, please ignore this email.</p>
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                    <p style="color: #2c3e50; font-weight: bold; margin: 0;">Need Help?</p>
                    <p style="color: #7f8c8d; font-size: 14px; margin: 10px 0;">Contact our support team at support@example.com</p>
                </div>
            </div>
            <div style="text-align: center; margin-top: 20px; color: #95a5a6; font-size: 12px;">
                <p>© 2024 Your Company Name. All rights reserved.</p>
            </div>
        </div>
    `;

    await sendEmailtoUser(to, subject, htmlContent);
};

module.exports = {
    sendEmailtoUser,
    sendVerificationEmail,
};
