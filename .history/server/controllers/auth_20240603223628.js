import bcrypt from 'bcryptjs'; 
import User from '../models/user.js';

const postLogin = (req, res, next) => {
    console.log('Login route called');
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email }).then(user => {
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Utiliser bcrypt pour comparer le mot de passe envoyé avec le hash enregistré
        bcrypt.compare(password, user.password_hash).then(doMatch => {
            if (!doMatch) {
                return res.status(400).json({ message: 'Invalid email or password' });
            }

            // Configurer la session après la connexion réussie
            req.session.isLoggedIn = true;
            req.session.user = user;
            req.session.save(err => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Server error' });
                }
                res.status(200).json({ message: 'Login successful', userId: user._id,isLoggedIn: req.session.isLoggedIn,firstName: user.first_name,          // Prénom de l'utilisateur
                lastName: user.last_name    // Confirme que l'utilisateur est connecté
                sessionId: req.sessionID  });
            });
        }).catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        });
    }).catch(err => {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    });
};

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

        // Hasher le mot de passe avant de le sauvegarder
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = new User({
            email: email,
            password_hash: hashedPassword, // Stocker le hash, pas le mot de passe en clair
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

const postLogout = (req, res, next) => {
    // Détruire la session lors de la déconnexion
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
