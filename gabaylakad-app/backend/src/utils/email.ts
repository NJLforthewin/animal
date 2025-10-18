import nodemailer from 'nodemailer';
import { emailConfig } from './email.config';

export async function sendResetEmail(to: string, verificationCode: string, type: 'register' | 'reset' = 'register') {
    // Choose Ethereal for dev, Gmail for prod
    const transporter = nodemailer.createTransport(emailConfig.ethereal); // Change to gmail for prod

    let subject = 'Account Verification';
    let html = `<b>Your verification code is: ${verificationCode}</b>`;
    let text = `Your verification code is: ${verificationCode}`;

    if (type === 'register') {
        // Verification link for registration
        const verifyUrl = `http://localhost:5000/verify?email=${encodeURIComponent(to)}&code=${verificationCode}`;
        subject = 'Verify your GabayLakad Account';
        html = `<p>Thank you for registering your device!</p>
                <p>Your verification code is: <b>${verificationCode}</b></p>
                <p>Or click the link below to verify your account:</p>
                <a href="${verifyUrl}">Verify Account</a>`;
        text = `Thank you for registering your device!\nYour verification code is: ${verificationCode}\nOr visit: ${verifyUrl}`;
    } else if (type === 'reset') {
        // Password reset link
        const resetUrl = `http://localhost:3000/reset-password?email=${encodeURIComponent(to)}&token=${verificationCode}`;
        subject = 'Reset your GabayLakad Password';
        html = `<p>You requested a password reset.</p>
                <p>Your password reset code is: <b>${verificationCode}</b></p>
                <p>Or click the link below to reset your password:</p>
                <a href="${resetUrl}">Reset Password</a>`;
        text = `You requested a password reset.\nYour password reset code is: ${verificationCode}\nOr visit: ${resetUrl}`;
    }

    const info = await transporter.sendMail({
        from: emailConfig.ethereal.auth.user,
        to,
        subject,
        text,
        html,
    });

    // Preview URL for Ethereal
    return nodemailer.getTestMessageUrl(info);
}
