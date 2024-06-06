import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User from '../models/user.js';

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

    await transporter.sendMail(mailOptions);
}

// Connexion
const postLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return sendError(res, 400, 'Invalid email or password');
        }
        if (!user.isEmailVerified) {
            return sendError(res, 401, 'Email not verified');
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
    } catch (err) {
        console.error(err);
        sendError(res, 500, 'Server error');
    }
};

// Inscription
const postSignup = async (req, res) => {
    const { email, password, confirmPassword, first_name, last_name } = req.body;

    if (password !== confirmPassword) {
        return sendError(res, 400, 'Les mots de passe ne correspondent pas');
    }

    try {
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
            emailVerificationToken: uuidv4(), // Ajouter le token de vérification ici
        });

        await user.save();
        await sendVerificationEmail(user, req);
        res.status(201).json({ message: 'Inscription réussie. Veuillez vérifier votre email pour activer votre compte.' });
    } catch (err) {
        console.error(err);
        sendError(res, 500, 'Erreur serveur');
    }
};

// Déconnexion
const postLogout = (req, res) => {
    res.json({ message: 'Déconnexion réussie' });
};

export default {
    postLogin,
    postSignup,
    postLogout
};
