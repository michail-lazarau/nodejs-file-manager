export class OperationError extends Error {
    constructor(message) {
      super(message);
      this.name = 'OperationError';
    }
  }
  
  export class InvalidInputError extends Error {
    constructor(message = 'Invalid input') {
      super(message);
      this.name = 'InvalidInputError';
    }
  }