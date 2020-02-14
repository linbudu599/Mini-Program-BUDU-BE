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

export class NotFound extends HttpException {
  constructor(message: string, errorCode: number = 0) {
    super(message, errorCode);
    this.message = message || '资源未找到...';
    this.status = 404;
    this.errorCode = errorCode || 10000;
  }
}

export class AuthorizationFailure extends HttpException {
  constructor(message: string, errorCode: number = 0) {
    super(message, errorCode);
    this.message = message || '信息错误，请检查用户名/密码';
    this.status = 401;
    this.errorCode = errorCode || 10004;
  }
}

export class Forbidden extends HttpException {
  constructor(message: string, errorCode: number = 0) {
    super(message, errorCode);
    this.message = message || '禁止访问';
    this.status = 403;
    this.errorCode = errorCode || 10003;
  }
}

export class LikeError extends HttpException {
  constructor(message: string, errorCode: number) {
    super(message, errorCode);
    this.status = 400;
    this.message = '已经点过赞啦';
    this.errorCode = 60001;
  }
}
export class DislikeError extends HttpException {
  constructor(message: string, errorCode: number) {
    super(message, errorCode);
    this.status = 400;
    this.message = '已经取消过赞啦';
    this.errorCode = 60002;
  }
}
