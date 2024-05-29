exports.getLogin = (req, res, next) => {
    const isLoggedIn = req
    .get('Cookie')
    .split(';')[0].
    trim().split('=')[1] === 'true'; //permet de savoir si l'utilisateur est connecté
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: req.isLoggedIn
    });
}

exports.postLogin = (req, res, next) => {
    req.setHeader('Set-Cookie', 'loggedIn=true'); //permet de mettre un cookie qui permet de savoir si l'utilisateur est connecté
    res.redirect('/');
}