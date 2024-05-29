const getLogin = (req, res, next) => {
    //
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false
    });
};

const postLogin = (req, res, next) => {
    req.session.isLoggedIn = true;
    res.redirect('/');
};

export default {
    getLogin,
    postLogin
};
