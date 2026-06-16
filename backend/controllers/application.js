const {StatusCodes} = require('http-status-codes');
const Volunteer = require('../models/Volunteer');
const Application = require('../models/Application');

const applyProgram = async(req, res) => {
    const {programId} = req.params;
    const volunteerProfile = await Volunteer.findOne({user: req.user.userID});
    if(!volunteerProfile){
        return res.status(StatusCodes.BAD_REQUEST).json({
            msg: "No volunteer profile found"
        })
    }
    if(volunteerProfile.status === 'rejected'){
        return res.status(StatusCodes.FORBIDDEN).json({
            msg: "Rejected applicants can't apply"
        })
    }
    const application = {volunteer: volunteerProfile._id, program: programId};
    const checkApplication = await Application.find(application);
    if(checkApplication.length > 0){
        return res.status(StatusCodes.NOT_ACCEPTABLE).json({
            msg: "Already applied for this program"
        })
    }
    const newApplication = await Application.create(application);
    res.status(StatusCodes.CREATED).json({
        msg: "Successfully applied",
        newApplication
    });
}

const getMyApplications = async(req, res) => {
    const volunteerProfile = await Volunteer.findOne({user: req.user.userID});
    if(!volunteerProfile){
        return res.status(StatusCodes.BAD_REQUEST).json({
            msg: "No volunteer profile found"
        })
    }
    const applications = await Application.find({volunteer: volunteerProfile._id}).populate('program', 'title description location category');
    if(applications.length === 0){
        return res.status(StatusCodes.BAD_REQUEST).json({
            msg: `There are no applications`
        });
    }
    res.status(StatusCodes.OK).json({
        applications
    });
}

const getApplications = async(req, res) => {
    const applications = await Application.find().populate({
        path: 'program',
        select: 'title description location category',
        populate: {
            path: 'createdBy',
            select: 'name email role'
        }
    }).populate({
        path: 'volunteer',
        populate: {
            path: 'user',
            select: 'name email role'
        }
    });
    res.status(StatusCodes.OK).json({
        applications,
        count: applications.length
    });
}

const updateApplication = async(req, res) => {
    const {
        body : {status: newstatus},
        params: { id: applicationId },
    } = req;
    const application = await Application.findById(applicationId);
    if(!application){
        return res.status(StatusCodes.BAD_REQUEST).json({
            msg: `No application with ID ${applicationId}`
        });
    }
    if(newstatus === "rejected"){
            await Application.findByIdAndDelete(applicationId);
            return res.json({
                msg:"Application rejected and removed"
            });
        }
        application.status = newstatus;
        await application.save();
    return res.status(StatusCodes.CREATED).json({
        msg: "Successfully updated",
        application
    })
}

const deleteApplication = async(req, res) => {
    const {id : applicationId} = req.params;
    const application = await Application.findByIdAndDelete(applicationId);
    if(!application){
        return res.status(StatusCodes.BAD_REQUEST).json({
            msg: `No application with given ID ${applicationId}`
        })
    }
    res.status(StatusCodes.OK).send();
}

module.exports = {applyProgram, getMyApplications, getApplications, updateApplication, deleteApplication};

