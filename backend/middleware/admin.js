const { StatusCodes } = require("http-status-codes")

const admin = (req, res, next) => {
    if(req.user.role !==  "Admin"){
        return res.status(StatusCodes.FORBIDDEN).json({
            msg: "Access Denied"
        })
    }
    next();
}

module.exports = admin;
