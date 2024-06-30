import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';
import User from '../models/user.js';  // Sequelize model

function sendError(res, statusCode, message) {
    res.status(statusCode).json({ error: message });
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

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
        where: {
            emailVerificationToken: token,
            emailVerificationExpires: { [Op.gt]: new Date() }
        }
    });

    if (!user) {
        return res.status(400).send('Lien de vérification invalide ou expiré');
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
    await user.save();

    res.send('Email vérifié avec succès!');
};

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

const postLogin = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
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
        { userId: user.user_id, email: user.email, role: user.roles[0], mustChangePassword: user.mustChangePassword }, // Include mustChangePassword
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    // Check if the user must change their password
    if (user.mustChangePassword) {
        return res.status(200).json({
            message: 'Must change password',
            mustChangePassword: true,
            userId: user.user_id,
            token: token,
        });
    }

    res.status(200).json({
        message: 'Login successful',
        token: token,
        userId: user.user_id,
        firstName: user.first_name,
        lastName: user.last_name,
        mustChangePassword: user.mustChangePassword // Ensure this is included in the response
    });
};





  

const postChangePassword = async (req, res) => {
    const { userId, newPassword } = req.body;

    if (!validatePassword(newPassword)) {
        return sendError(res, 400, 'Le mot de passe doit contenir au moins 12 caractères, dont un chiffre, une majuscule, une minuscule, et un symbole.');
    }

    const user = await User.findByPk(userId);
    if (!user) {
        return sendError(res, 404, 'User not found');
    }

    user.password_hash = await bcrypt.hash(newPassword, 12);
    user.mustChangePassword = false; // Reset the flag
    await user.save();

    res.status(200).json({ 
        message: 'Password changed successfully',
        mustChangePassword: user.mustChangePassword 
    });
};



function validatePassword(password) {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{12,}$/;
    return passwordRegex.test(password);
}

const postSignup = async (req, res) => {
    const { email, password, confirmPassword, first_name, last_name } = req.body;

    if (!first_name || !last_name || !email || !password || !confirmPassword) {
        return sendError(res, 400, 'Tous les champs doivent être remplis.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return sendError(res, 400, 'Format de l\'email invalide.');
    }

    if (!validatePassword(password)) {
        return sendError(res, 400, 'Le mot de passe doit contenir au moins 12 caractères, dont un chiffre, une majuscule, une minuscule, et un symbole.');
    }

    if (password !== confirmPassword) {
        return sendError(res, 400, 'Les mots de passe ne correspondent pas.');
    }

    const userDoc = await User.findOne({ where: { email } });
    if (userDoc) {
        return sendError(res, 400, 'L\'email existe déjà.');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
        email: email,
        password_hash: hashedPassword,
        first_name: first_name,
        last_name: last_name,
        emailVerificationToken: uuidv4(),
        emailVerificationExpires: new Date(Date.now() + 10*60*1000)
    });

    await sendVerificationEmail(user, req);
    res.status(201).json({ message: 'Inscription réussie. Veuillez vérifier votre email pour activer votre compte.' });
};

const postLogout = (req, res) => {
    res.json({ message: 'Déconnexion réussie' });
};

const resetPasswordGet = async (req, res) => {
    const { token } = req.params;
    const user = await User.findOne({
        where: {
            resetPasswordToken: token,
            resetPasswordExpires: { [Op.gt]: new Date() }
        }
    });

    if (!user) {
        return res.status(400).json({ error: 'Le lien de réinitialisation est invalide ou a expiré.' });
    }

    res.json({ message: "Token est valide.", token: token });
};

const postForgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (user) {
        user.resetPasswordToken = uuidv4();
        user.resetPasswordExpires = new Date(Date.now() + 3600000);
        await user.save();

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${user.resetPasswordToken}`;
        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: user.email,
            subject: 'Réinitialisation de votre mot de passe',
            html: `Pour réinitialiser votre mot de passe, veuillez cliquer sur ce lien : <a href="${resetUrl}">${resetUrl}</a>`
        };

        try {
            await transporter.sendMail(mailOptions);
        } catch (error) {
            console.error("Failed to send reset email", error);
            sendError(res, 500, 'Impossible d\'envoyer l\'email de réinitialisation.');
        }
    }
    res.status(200).json({ message: 'Si votre email est enregistré chez nous, un lien de réinitialisation a été envoyé.' });
};

const postResetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    const user = await User.findOne({
        where: {
            resetPasswordToken: token,
            resetPasswordExpires: { [Op.gt]: new Date() }
        }
    });

    if (!user) {
        return sendError(res, 400, 'Le token de réinitialisation est invalide ou a expiré.');
    }

    if (!validatePassword(newPassword)) {
        return sendError(res, 400, 'Le mot de passe doit contenir au moins 12 caractères, dont un chiffre, une majuscule, une minuscule, et un symbole.');
    }

    user.password_hash = await bcrypt.hash(newPassword, 12);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({ message: 'Votre mot de passe a été mis à jour avec succès.' });
};

export default {
    postLogin,
    postSignup,
    postLogout,
    verifyEmail,
    postForgotPassword,
    postResetPassword,
    resetPasswordGet,
    postChangePassword, // N'oubliez pas d'ajouter cette méthode ici
};
