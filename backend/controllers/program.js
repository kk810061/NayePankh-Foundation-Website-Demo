const {StatusCodes} = require('http-status-codes');
const Program = require('../models/Program');

const createProgram = async(req, res) => {
    const {title, description, location, date, category} = req.body;
    const program = {title, description, location, date, category};
    program.createdBy = req.user.userID;
    const newProgram = await Program.create(program);
    res.status(StatusCodes.CREATED).json({
        msg: "Successfully created",
        newProgram
    });
}

const getPrograms = async(req, res) => {
    let result = Program.find().sort({createdAt: -1}).populate('createdBy', 'name email');
    const totalCount = await Program.countDocuments();
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);
    const programs = await result;
    res.status(StatusCodes.OK).json({
        programs,
        nbhits: programs.length,
        totalCount
    });
}

const getSingleProgram = async(req, res) => {
    const {id: programId} = req.params;
    const program = await Program.findById(programId).populate('createdBy', 'name email');
    if(!program){
        return res.status(StatusCodes.BAD_REQUEST).json({
            msg: `No such program with ID ${programId}`
        });
    }
    res.status(StatusCodes.OK).json({
        program
    });
}

const updateProgram = async(req, res) => {
    const {id: programId} = req.params;
    const newProgram = await Program.findByIdAndUpdate({_id: programId}, req.body, {
        new: true,
        runValidators: true
    })
    if(!newProgram){
        return res.status(StatusCodes.BAD_REQUEST).json({
            msg: `No such program with ID ${programId}`
        });
    }
    res.status(StatusCodes.ACCEPTED).json({
        newProgram
    });
}

const deleteProgram = async(req, res) => {
    const {id: programId} = req.params;
    const program = await Program.findByIdAndDelete({_id: programId});
    if(!program){
        return res.status(StatusCodes.BAD_REQUEST).json({
            msg: `No program with ID ${programId}`
        });
    }
    res.status(StatusCodes.OK).send();
}

module.exports = {createProgram, getPrograms, getSingleProgram, updateProgram, deleteProgram};
