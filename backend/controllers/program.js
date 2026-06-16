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
    const programs = await Program.find().populate('createdBy', 'name email');
    res.status(StatusCodes.OK).json({
        programs,
        count: programs.length
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
