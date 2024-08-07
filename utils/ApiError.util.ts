class ApiError extends Error {
    statusCode: any;

    constructor(statusCode: any, message: string) {
        super(message);

        this.name = 'ApiError';
        this.statusCode = statusCode;

        Error.captureStackTrace(this, this.constructor);
    }
}

export default ApiError;
