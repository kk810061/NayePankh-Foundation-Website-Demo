const Volunteer = require('../models/Volunteer');
const {StatusCodes} = require('http-status-codes');

const createVolunteer = async(req, res) => {
    const {phone, city, skills, availability} = req.body;
    const volunteer = {phone, city, skills, availability};
    volunteer.user = req.user.userID;
    const newVolunteer = await Volunteer.create(volunteer);
    return res.status(StatusCodes.CREATED).json({
        msg: "Successfully created",
        newVolunteer
    })
}

const getAllVolunteers = async(req, res) => {
    let filter = {};
    if (req.query.status === 'pending') {
        filter.status = 'pending';
    } else if (req.query.status === 'processed') {
        filter.status = { $ne: 'pending' };
    }
    let result = Volunteer.find(filter).sort({updatedAt: -1}).populate('user', 'name email');
    const totalCount = await Volunteer.countDocuments(filter);
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);
    const volunteers = await result;
    return res.status(StatusCodes.OK).json({
        volunteers,
        nbHits: volunteers.length,
        totalCount
    })
}

const updateVolunteer = async(req, res) => {
    const {
        body : {status: newstatus},
        params: { id: volunteerId },
    } = req;
    const volunteer = await Volunteer.findById(volunteerId)
    if(!volunteer){
        return res.status(StatusCodes.BAD_REQUEST).json({
            msg: `No volunteer with ID ${volunteerId}`
        });
    }
    volunteer.status = newstatus;
    await volunteer.save();
    return res.status(StatusCodes.CREATED).json({
        msg: "Successfully updated",
        volunteer
    })
}

const deleteVolunteer = async(req, res) => {
    const {id : volunteerId} = req.params;
    const volunteer = await Volunteer.findByIdAndDelete(volunteerId);
    if(!volunteer){
        return res.status(StatusCodes.BAD_REQUEST).json({
            msg: `No volunteer with ID ${volunteerId}`
        })
    }
    res.status(StatusCodes.OK).send();
}

const getMyProfile = async(req, res) => {
    const volunteer = await Volunteer.findOne({user: req.user.userID}).populate('user', 'name email');
    if(!volunteer){
        return res.status(StatusCodes.NOT_FOUND).json({
            msg: "No volunteer profile found"
        });
    }
    return res.status(StatusCodes.OK).json({
        volunteer
    });
}

module.exports = {createVolunteer, getAllVolunteers, updateVolunteer, deleteVolunteer, getMyProfile};
