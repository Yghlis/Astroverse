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

const getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        isAuthenticated: false
    });
};

const postSignup = (req, res, next) => {
    console.log('Register route called'); // Ajout du console.log
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    User.findOne({ email: email }).then(userDoc => {
        if (userDoc) {
            return res.redirect('/signup');
        }
        const user = new User({
            email: email,
            password: password
        });
        return user.save();
    })
    .then(result => {
        res.redirect('/login');
    })
    .catch(err => {
        console.log(err);
    });
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
