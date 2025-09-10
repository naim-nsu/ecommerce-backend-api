import CustomError from "./CustomError";

class InternalServerError extends CustomError<ErrorCode> {
  constructor({
    message = "Internal server error!",
    statusCode = 500,
    code = "ERR_VALID",
    error,
  }: {
    message?: string;
    statusCode?: number;
    code?: ErrorCode;
    error?: unknown;
  } = {}) {
    super({ message, statusCode, code });
  }
}
export default InternalServerError;
