"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResetEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const email_config_1 = require("./email.config");
function sendResetEmail(to, verificationCode, type = 'register') {
    return __awaiter(this, void 0, void 0, function* () {
        // Choose Ethereal for dev, Gmail for prod
        const transporter = nodemailer_1.default.createTransport(email_config_1.emailConfig.ethereal); // Change to gmail for prod
        let subject = 'Account Verification';
        let html = `<b>Your verification code is: ${verificationCode}</b>`;
        let text = `Your verification code is: ${verificationCode}`;
        if (type === 'register') {
            subject = 'Verify your GabayLakad Account';
            html = `<p>Thank you for registering your device!</p>
                <p>Your verification code is: <b>${verificationCode}</b></p>`;
            text = `Thank you for registering your device!\nYour verification code is: ${verificationCode}`;
            // Log the code for testing
            console.log(`[TEST MODE] Account Verification code for ${to}: ${verificationCode}`);
        }
        else if (type === 'reset') {
            // Password reset link
            const resetUrl = `http://localhost:3000/reset-password?email=${encodeURIComponent(to)}&token=${verificationCode}`;
            subject = 'Reset your GabayLakad Password';
            html = `<p>You requested a password reset.</p>
                <p>Your password reset code is: <b>${verificationCode}</b></p>
                <p>Or click the link below to reset your password:</p>
                <a href="${resetUrl}">Reset Password</a>`;
            text = `You requested a password reset.\nYour password reset code is: ${verificationCode}\nOr visit: ${resetUrl}`;
        }
        const info = yield transporter.sendMail({
            from: email_config_1.emailConfig.ethereal.auth.user,
            to,
            subject,
            text,
            html,
        });
        // Preview URL for Ethereal
        return nodemailer_1.default.getTestMessageUrl(info);
    });
}
exports.sendResetEmail = sendResetEmail;
