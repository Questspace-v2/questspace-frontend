class HttpError extends Error {
    statusCode: number;

    message: string;

    constructor(statusCode: number, message?: string) {
        super(message ?? 'An unspecified HTTP error occurred');
        this.statusCode = statusCode;
        this.message = message ?? 'An unspecified HTTP error occurred';
    }
}

export default HttpError;