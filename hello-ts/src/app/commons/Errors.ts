export abstract class DomainError extends Error {
  data: any = {};
  status: number = 500;
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, DomainError.prototype);
    
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  get code(): number {
    return this.status;
  }
}

export class NotFoundError extends DomainError {
  constructor(resource: string, query: any) {
    super(`Recurso ${resource} não foi encontrado.`);
    this.data = { resource, query };
    this.status = 404;
  }
}

export class InternalError extends DomainError {
  constructor(error: Error) {
    super(error.message);
    this.data = { error };
  }
}

export class AccessDeniedError extends DomainError {
  constructor(message: string) {
    super(message);
    this.status = 403;
  }
}

export class RequiredError extends DomainError {
  constructor(resource: string, params: Array<string>) {
    super(`Recurso ${resource} exige os seguintes parametros [${params.toString()}].`);
    this.data = { params };
  }
}
