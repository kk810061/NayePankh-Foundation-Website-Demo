const Volunteer = require('../models/Volunteer');
const Application = require('../models/Application');
const User = require('../models/User');
const Program = require('../models/Program');
const { StatusCodes } = require('http-status-codes');

const getDashboardStats = async(req, res) => {
    const totalVolunteers = await Volunteer.countDocuments();
    const pendingVolunteers = await Volunteer.countDocuments({status:"pending"});
    const approvedVolunteers = await Volunteer.countDocuments({status:"approved"});
    const totalPrograms = await Program.countDocuments();
    const programStats = await Program.aggregate([{$group: {
            _id: '$category',     
            count: { $sum: 1 }    
        }}, 
        {$sort: { 
            count: -1 
    }}]);
    const totalApplications = await Application.countDocuments();
    const pendingApplications = await Application.countDocuments({status:"pending"});
    const approvedApplications = await Application.countDocuments({status:"approved"});
    res.status(StatusCodes.OK).json({
        volunteers:{
            totalVolunteers,
            pendingVolunteers,
            approvedVolunteers
        },
        programs:{
            totalPrograms,
            programStats
        },
        applications:{
            totalApplications,
            pendingApplications,
            approvedApplications
        },
    });
}

module.exports = getDashboardStats;