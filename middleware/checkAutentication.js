export function checkAuthentication(req, res, next) {
    const isLoggedIn = req.session.signed;
    const username = req.session.username;

    if (!isLoggedIn) {
        console.log(`User ${username || 'Anonymous'} is not logged in!`);
        return res.status(400).redirect('/login');
    }

    next(); 
}