// Custom exception hierarchy so callers can distinguish failure modes
// instead of catching a generic Error. Each carries an HTTP status for
// route handlers that need to surface one.

export class AppError extends Error {
  constructor(message, { status = 500, code = 'INTERNAL_ERROR' } = {}) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.code = code;
  }
}

export class ValidationError extends AppError {
  constructor(message, fieldErrors = {}) {
    super(message, { status: 422, code: 'VALIDATION_ERROR' });
    this.name = 'ValidationError';
    this.fieldErrors = fieldErrors;
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, { status: 404, code: 'NOT_FOUND' });
    this.name = 'NotFoundError';
  }
}

export class RatingError extends AppError {
  constructor(message) {
    super(message, { status: 409, code: 'RATING_CONFLICT' });
    this.name = 'RatingError';
  }
}

export class StorageError extends AppError {
  constructor(message, cause) {
    super(message, { status: 502, code: 'STORAGE_ERROR' });
    this.name = 'StorageError';
    if (cause) this.cause = cause;
  }
}

export class DatabaseError extends AppError {
  constructor(message, cause) {
    super(message, { status: 500, code: 'DATABASE_ERROR' });
    this.name = 'DatabaseError';
    if (cause) this.cause = cause;
  }
}
