function handleErrors(error, req, res, next) {
    console.log(error);
    res.status(500).render('shared/500');
}
//this middleware function will be called whenever we have error in any of our routes or middlewares

module.exports = handleErrors;