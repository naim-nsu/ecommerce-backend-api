import CustomError from "./CustomError";

class EntityNotFoundError extends CustomError<ErrorCode> {
  constructor({
    message = "Entity not found!",
    statusCode = 404,
    code = "ERR_NF",
  }: {
    message?: string;
    statusCode?: number;
    code?: ErrorCode;
  } = {}) {
    super({ message, statusCode, code });
  }
}
export default EntityNotFoundError;
