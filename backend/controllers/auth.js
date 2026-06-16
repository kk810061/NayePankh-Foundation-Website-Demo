const User = require('../models/User');
const createJWT = require('../utils/createJWT')
const bcrypt = require('bcryptjs')
const {StatusCodes} = require('http-status-codes')

const register = async (req, res) => {
    const {name, email, password} = req.body;
    if(!email || !name || !password){
        return res.status(StatusCodes.BAD_REQUEST).json({
            msg: 'All credentials are required'
        })
    }
    const user = {name, email, password};
    if(await User.findOne({email: user.email})){
        return res.status(StatusCodes.BAD_REQUEST).json({
            msg: 'User already exists'
        });
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    const newUser = await User.create(user);
    const token = createJWT({userID: newUser._id, role: newUser.role});
    return res.status(StatusCodes.CREATED).json({
        msg: 'User created successfully',
        token,
        user:{
            id: newUser._id,
            email: newUser.email,
            role: newUser.role
        }
    })
}

const login = async(req, res) => {
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(StatusCodes.BAD_REQUEST).json({
            msg: "Please enter all the required credentials"
        })
    }
    const user = await User.findOne({email});
    if(!user){
        return res.status(StatusCodes.UNAUTHORIZED).json({
            msg: "Invalid credentials"
        });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        return res.status(StatusCodes.UNAUTHORIZED).json({
            msg: "Invalid credentials"
        })
    }
    const token = createJWT({userID: user._id, role: user.role});
    return res.status(StatusCodes.OK).json({
        msg: "Authentication successful",
        token,
        user: {
            id: user._id,
            email: user.email,
            role: user.role
        }
    })
}

module.exports = {register, login};
