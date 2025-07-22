// Firebase Authentication Error Messages Mapping
// Maps Firebase error codes to user-friendly Spanish messages

export const authErrorMessages = {
  // Authentication errors
  'auth/invalid-credential': 'El correo electrónico o la contraseña son incorrectos.',
  'auth/invalid-email': 'El formato del correo electrónico no es válido.',
  'auth/user-disabled': 'Esta cuenta ha sido deshabilitada. Por favor, contacta al soporte.',
  'auth/user-not-found': 'No existe una cuenta con este correo electrónico.',
  'auth/wrong-password': 'La contraseña es incorrecta.',
  'auth/email-already-in-use': 'Este correo electrónico ya está registrado.',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
  'auth/operation-not-allowed': 'Esta operación no está permitida.',
  'auth/too-many-requests': 'Demasiados intentos fallidos. Por favor, intenta más tarde.',
  'auth/network-request-failed': 'Error de conexión. Por favor, verifica tu conexión a internet.',
  'auth/requires-recent-login': 'Por favor, vuelve a iniciar sesión para realizar esta acción.',
  
  // Custom errors
  'User not found in Firestore': 'Error al cargar los datos de usuario. Por favor, contacta al soporte.',
  'Invalid CAPTCHA': 'Por favor, completa la verificación CAPTCHA.',
  
  // Rate limiting
  'rate-limit': 'Demasiados intentos. Por favor, espera un momento antes de intentar nuevamente.',
  
  // Default error
  'default': 'Ha ocurrido un error. Por favor, intenta nuevamente.'
};

// Function to get user-friendly error message
export const getAuthErrorMessage = (errorCode) => {
  // If it's a Firebase error, extract the error code
  if (errorCode && errorCode.includes('auth/')) {
    const code = errorCode.match(/auth\/[\w-]+/)?.[0];
    if (code && authErrorMessages[code]) {
      return authErrorMessages[code];
    }
  }
  
  // Check if it's a custom error message
  if (authErrorMessages[errorCode]) {
    return authErrorMessages[errorCode];
  }
  
  // Return default error message
  return authErrorMessages.default;
};