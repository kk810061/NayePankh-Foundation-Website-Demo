const User = require('../models/User');
const jwt = require('jsonwebtoken');
const {StatusCodes} = require('http-status-codes');
require('dotenv').config();

const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer")){
        return res.status(StatusCodes.UNAUTHORIZED).json({
            msg: "Authentication Invalid"
        })
    }
    const token = authHeader.split(" ")[1];
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {userID: decoded.userID, name: decoded.name, role: decoded.role};
        next();
    }
    catch(err){
        res.status(StatusCodes.UNAUTHORIZED).json({
            msg: "Authentication Invalid"
        })
    }
}

module.exports = auth;
