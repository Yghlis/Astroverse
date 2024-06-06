import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User from '../models/user.js';
import { v4 as uuidv4 } from 'uuid';

// Fonction pour envoyer des erreurs de manière uniforme
function sendError(res, statusCode, message) {
    res.status(statusCode).json({ error: message });
}

// Configuration de Nodemailer pour envoyer des emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Fonction pour envoyer l'email de vérification
async function sendVerificationEmail(user, req) {
    const verifyUrl = `${req.protocol}://${req.get('host')}/auth/verify-email?token=${user.emailVerificationToken}`;
    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: user.email,
        subject: 'Vérifiez votre adresse email',
        html: `Veuillez cliquer sur ce lien pour vérifier votre adresse email: <a href="${verifyUrl}">${verifyUrl}</a>`
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Failed to send verification email", error);
    }
}

const verifyEmail = async (req, res) => {
    const { token } = req.query;
    const user = await User.findOne({
        emailVerificationToken: token,
        emailVerificationExpires: { $gt: new Date() }
    });

    if (!user) {
        return res.status(400).send('Lien de vérification invalide ou expiré');
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.send('Email vérifié avec succès!');
};

// Connexion
const postLogin = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return sendError(res, 400, 'Invalid email or password');
    }
    if (!user.isEmailVerified) {
        return sendError(res, 401, 'Your email address has not been verified. Please check your email for the verification link.');
    }

    const doMatch = await bcrypt.compare(password, user.password_hash);
    if (!doMatch) {
        return sendError(res, 400, 'Invalid email or password');
    }

    const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    res.status(200).json({
        message: 'Login successful',
        token: token,
        userId: user._id,
        firstName: user.first_name,
        lastName: user.last_name
    });
};

// Inscription
const postSignup = async (req, res) => {
    const { email, password, confirmPassword, first_name, last_name } = req.body;
    if (password !== confirmPassword) {
        return sendError(res, 400, 'Les mots de passe ne correspondent pas');
    }

    const userDoc = await User.findOne({ email });
    if (userDoc) {
        return sendError(res, 400, 'L\'email existe déjà');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
        email: email,
        password_hash: hashedPassword,
        first_name: first_name,
        last_name: last_name,
        emailVerificationToken: uuidv4(),
        emailVerificationExpires: new Date(Date.now() + 10*60*1000)
    });

    await user.save();
    await sendVerificationEmail(user, req);
    res.status(201).json({ message: 'Inscription réussie. Veuillez vérifier votre email pour activer votre compte.' });
};

// Déconnexion
const postLogout = (req, res) => {
    res.json({ message: 'Déconnexion réussie' });
};

// Générer un token de réinitialisation et envoyer un email
const postForgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return sendError(res, 404, 'Aucun utilisateur trouvé avec cet email.');
    }

    user.resetPasswordToken = uuidv4();
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // Le token expire dans 1 heure
    await user.save();

    const resetUrl = `${req.protocol}://${req.get('host')}/auth/reset-password/${user.resetPasswordToken}`;
    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: user.email,
        subject: 'Réinitialisation de votre mot de passe',
        html: `Pour réinitialiser votre mot de passe, veuillez cliquer sur ce lien : <a href="${resetUrl}">${resetUrl}</a>`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Un email de réinitialisation a été envoyé à votre adresse email.' });
    } catch (error) {
        console.error("Failed to send reset email", error);
        sendError(res, 500, 'Impossible d\'envoyer l\'email de réinitialisation.');
    }
};

// Réinitialiser le mot de passe
const postResetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
        return sendError(res, 400, 'Le token de réinitialisation est invalide ou a expiré.');
    }

    user.password_hash = await bcrypt.hash(newPassword, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Votre mot de passe a été mis à jour avec succès.' });
};


export default {
    postLogin,
    postSignup,
    postLogout,
    verifyEmail,
};
