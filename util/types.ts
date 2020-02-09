export class HttpException extends Error {
  status: number;
  errorCode: number;
  constructor(message: string = '服务器内部错误', errorCode: number, status?: number) {
    super(message);

    this.status = status || 500;
    this.errorCode = errorCode;

    Object.setPrototypeOf(this, HttpException.prototype);
  }
}

export class ParamException extends HttpException {
  constructor(message: string, errorCode: number = 10000) {
    super(message, errorCode);
    this.message = message;
    this.status = 400;
    this.errorCode = errorCode;
  }
}

export class Success extends HttpException {
  constructor(message: string, errorCode: number = 0) {
    super(message, errorCode);
    this.message = message || 'OK!';
    this.status = 201;
    this.errorCode = 0;
  }
}
