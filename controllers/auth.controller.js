const { User } = require('../models/user.model');
const authUtil = require('../util/authentication');
const userDetailsAreValid = require('../util/validation');

function getSignup(req, res) {
    res.render('customer/auth/signup');
}

async function signup(req, res, next) {


    if (!validation.userDetailsAreValid(
        req.body.email,
        req.body.password,
        req.body.fullname,
        req.body.street,
        req.body.postal,
        req.body.city
    ) || !validation.emailIsConfirmed(req.body.email, req.body['confirm-email']))
    //javascript mein whenever we are extracting property names from dot notation and unn property names mein - hota hai toh unko direct req.body.confirm-email nahi likh skte.jaise likh rakaha hai waise likhna padhta hai.
    {
        res.redirect('/signup');
        return;
    }

    const user = new User(
        req.body.email,
        req.body.password,
        req.body.fullname,
        req.body.street,
        req.body.city
    );



    try {
        const existsAlready = await user.existsAlready();

        if (existsAlready) {
            res.redirec('/signup');
            return;
        }
        await user.signup();
    }
    catch (error) {
        next(error);//by this default middleware handling function will become active i.e handleErrors
        return;
    }

    res.redirect('/login');
}
function getLogin(req, res) {
    res.render('customer/auth/login');
}

async function login(req, res) {
    console.log(req.body);
    const user = new User(req.body.email, req.body.password);
    let existingUser;
    try {
        existingUser = await user.getUserWithSameEmail();
    }
    catch (error) {
        next(error);
        return;
    }
    if (!existingUser) {
        res.redirect('/login');
        return;
    }

    const passwordIsCorrect = await user.hasMatchingPassword(existingUser.password);

    if (!passwordIsCorrect) {
        res.redirect('/login');
        return;
    }

    authUtil.createUserSession(req, existingUser, function () {
        res.redirect('/');
    });
}

function logout(req, res) {
    authUtil.destroyUserAuthSession(req);
    res.redirect('/login');
}
module.exports = {
    getSignup: getSignup,
    getLogin: getLogin,
    signup: signup,
    login: login,
    logout: logout
};