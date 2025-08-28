class CustomError<T extends string> extends Error {
  statusCode: number;
  code?: T;
  constructor({
    message,
    statusCode,
    code,
  }: {
    message: string;
    statusCode: number;
    code?: T;
  }) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

export default CustomError;
