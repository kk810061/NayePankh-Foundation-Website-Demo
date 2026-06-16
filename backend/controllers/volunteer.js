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
    const volunteers = await Volunteer.find().populate('user', 'name email');
    return res.status(StatusCodes.OK).json({
        volunteers,
        count: volunteers.length
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
    if(newstatus === "rejected"){
        await Volunteer.findByIdAndDelete(volunteerId);
        return res.json({
            msg:"Volunteer rejected and removed"
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

module.exports = {createVolunteer, getAllVolunteers, updateVolunteer, deleteVolunteer};
