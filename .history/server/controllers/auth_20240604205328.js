import bcrypt from 'bcryptjs'; 
import jwt from 'jsonwebtoken'; 
import User from '../models/user.js';

//Connexion
const postLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const doMatch = await bcrypt.compare(password, user.password_hash);
        if (!doMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Créer un JWT token au lieu de sauvegarder la session
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,  // Assure-toi que JWT_SECRET est défini dans tes variables d'environnement
            { expiresIn: '1h' }
        );

        // Envoie le token au client
        res.status(200).json({
            message: 'Login successful',
            token: token,
            userId: user._id,
            firstName: user.first_name,
            lastName: user.last_name
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

//Inscription
const postSignup = async (req, res, next) => {
    console.log('Register route called');
    const { email, password, confirmPassword, first_name, last_name } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Les mots de passe ne correspondent pas' });
    }

    try {
        const userDoc = await User.findOne({ email: email });
        if (userDoc) {
            console.log('User already exists:', email);
            return res.status(400).json({ message: 'L\'email existe déjà' });
        }

        // Ne pas oubliez d'ajouter le hash du mot de passe
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = new User({
            email: email,
            password_hash: hashedPassword, 
            first_name: first_name,
            last_name: last_name
        });

        const result = await user.save();
        console.log('User saved:', result);
        res.status(201).json({ message: 'Utilisateur créé avec succès' });
    } catch (err) {
        console.error('Error saving user:', err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

//Déconnexion
const postLogout = (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
            return res.status(500).send('Unable to log out');
        }
        res.redirect('/');
    });
};

export default {
    postLogin,
    postSignup,
    postLogout
};
