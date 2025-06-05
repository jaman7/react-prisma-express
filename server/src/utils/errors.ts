import AppError from './appError';

export class ErrorHandler {
  static notFound(resource: string, id: string): AppError {
    return new AppError(404, `${resource} with id ${id} not found`);
  }

  static invalidData(message: string): AppError {
    return new AppError(400, message);
  }

  static prismaError(error: any): AppError {
    if (error.code === 'P2002') {
      return new AppError(409, `Duplicate value for unique field`);
    }
    if (error.code === 'P2025') {
      return new AppError(404, `Resource not found`);
    }
    return new AppError(500, `Internal server error`);
  }
}
