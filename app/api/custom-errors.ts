// eslint-disable-next-line max-classes-per-file
class HttpError extends Error {
    statusCode: number;

    message: string;

    constructor(statusCode: number, message?: string) {
        super(message ?? 'An unspecified HTTP error occurred');
        this.statusCode = statusCode;
        this.message = message ?? 'An unspecified HTTP error occurred';
    }
}

class BadRequestError extends HttpError {
    constructor(message?: string) {
        super(400, message ?? 'Bad Request');
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = 'BadRequestError';
    }
}

class NotFoundError extends HttpError {
    constructor(message?: string) {
        super(404, message ?? 'Not Found');
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = 'NotFoundError';
    }
}

class TooManyRequestsError extends HttpError {
    constructor(message?: string) {
        super(429, message ?? 'Too Many Requests');
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = 'TooManyRequestsError';
    }
}

export { HttpError, BadRequestError, NotFoundError, TooManyRequestsError };