import { StatusCodes } from 'http-status-codes';

export class HttpError extends Error {
  constructor(
    public readonly statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR,
    message = 'Internal server error'
  ) {
    super(message);
  }
}
