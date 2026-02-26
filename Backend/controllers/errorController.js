module.exports = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        res.status(statusCode).json({
            status: status,
            message: err.message,
            stack: err.stack,
            error: err
        });
    } else {
        // Production: Don't leak stack traces
        if (err.isOperational) {
            res.status(statusCode).json({
                status: status,
                message: err.message
            });
        } else {
            console.error('ERROR 💥', err);
            res.status(500).json({
                status: 'error',
                message: 'Something went very wrong!'
            });
        }
    }
};
