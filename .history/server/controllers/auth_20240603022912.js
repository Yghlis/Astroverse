import User from '../models/user.js';


const postLogin = (req, res, next) => {
    console.log('Login route called'); // Ajout du console.log
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email }).then(user => {
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        // Vérifier le mot de passe (nécessite une méthode de vérification)
        if (user.password !== password) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save(err => {
            if (err) {
                return res.status(500).json({ message: 'Server error' });
            }
            res.status(200).json({ message: 'Login successful', userId: user._id });
        });
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    });
};

const postSignup = async (req, res, next) => {
    console.log('Register route called'); // Ajout du console.log
    const { email, password, confirmPassword, first_name, last_name } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Les mots de passe ne correspondent pas' });
    }

    try {
        const userDoc = await User.findOne({ email: email });
        if (userDoc) {
            return res.status(400).json({ message: 'L\'email existe déjà' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = new User({
            email: email,
            password_hash: hashedPassword,
            first_name: first_name,
            last_name: last_name
        });

        await user.save();
        res.status(201).json({ message: 'Utilisateur créé avec succès' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Erreur serveur ABOUBOUBOU' });
    }
};

const postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.error(err);
        res.redirect('/');
    });
};

export default {
    postLogin,
    postSignup,
    postLogout
};

/*
const getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false
    });
};

const postLogin = (req, res, next) => {
    console.log('Login route called'); // Ajout du console.log
    res.status(200).json({ message: 'Login successful' });
};

const getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        isAuthenticated: false
    });
};

const postSignup = (req, res, next) => {
    console.log('Register route called'); // Ajout du console.log
    // Ajoutez ici la logique d'inscription
};

const postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.error(err);
        res.redirect('/');
    });
};

export default {
    getLogin,
    postLogin,
    getSignup,
    postSignup,
    postLogout
};
*/
