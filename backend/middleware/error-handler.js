const errorHandler = (err, req, res, next)=>{

    let statusCode = err.statusCode || 500;
    let message = err.message || "Something went wrong";


    if(err.name === "ValidationError"){

        statusCode = 400;

        message = Object.values(err.errors)
            .map(error => error.message)
            .join(", ");

    }


    res.status(statusCode).json({
        msg: message
    });

};

module.exports = errorHandler;
