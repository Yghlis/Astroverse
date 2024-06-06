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
