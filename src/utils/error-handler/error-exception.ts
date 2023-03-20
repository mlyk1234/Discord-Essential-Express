import { ErrorCode } from './error-code';

export class ErrorException extends Error {
    public status: number = null;
    public result: any = [];
    public reason: any = "";
    constructor(
        code: string = ErrorCode.
        UnknownError, reason: any = null
    )
    {
        super(code);
        Object.setPrototypeOf(this, new.target.prototype);
        // this.name = code;
        this.status = 500;
        this.reason = reason;
        this.result = [];
        switch (code) {
        case ErrorCode.Unauthenticated:
            this.status = 401;
            break;
        case ErrorCode.BadRequest:
            this.status = 400;
            break;
        case ErrorCode.AsyncError:
            this.status = 400;
            break;
        case ErrorCode.NotFound:
            this.status = 404;
            break;
        case ErrorCode.NotAcceptable:
            this.status = 406;
            break;
        default:
            this.status = 500;
            break;
        }
    }
}