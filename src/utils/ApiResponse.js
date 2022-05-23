class ApiResponse  {
    constructor(data, message = 'success', error = false ) {
      this.error = error
      this.message = message;
      this.data = data;
    }
  }
  
export default ApiResponse;
  