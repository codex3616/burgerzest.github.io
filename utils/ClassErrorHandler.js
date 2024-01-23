class ErrorHandler extends Error {
  constructor(message, satusCode) {
    super(message);
    this.satusCode = satusCode;
  }
}

export default ErrorHandler;
