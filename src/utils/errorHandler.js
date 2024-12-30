export const handleApiError = (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          localStorage.clear();
          window.location.href = '/login';
          break;
        case 403:
          return 'Permission denied.';
        case 404:
          return 'No records found.';
        case 422:
          return error.response.data.message;
        default:
          return 'Something went wrong. Please try again.';
      }
    }
    return 'Network error. Please check your connection.';
  };
  