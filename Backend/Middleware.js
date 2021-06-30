const jwt = require('jsonwebtoken');
const tokenModel = require('./models/Token')
//REFACTOR - Place within env var file, never commit.
const privateKey = 'shhhhhhh';


const AuthenticateJWT = function(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        console.log("no authH")
        return res.status(401).end();
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, privateKey, (err, decoded) => {
        if (err) {
            console.log("no t v");
            return res.status(401).json({
                msg: "Token could not be verified"
            });
        }
        if (!decoded) {
            console.log("no user");
            res.status(401).end();
        }
        tokenModel.findOne({ "Token": token }, (err, userToken) => {
            if (err) {
                console.log(err + err)
                throw err;
            }
            if (!userToken) {
                console.log("no user token")
                return res.status(401).end();
            }
            if (userToken.UserRole != decoded.userRole || userToken.UserId != decoded.userId) {
                console.log("bad token")
                return res.status(401).end();
            }
            console.log("user verified")
            req.user = decoded;
            next();
        });
    });
}

module.exports = AuthenticateJWT;