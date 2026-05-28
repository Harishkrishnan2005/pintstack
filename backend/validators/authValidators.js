export const validateRegisterInput = ({ username, email, password }) => {
  if (!username || !email || !password) {
    return "Username, email, and password are required.";
  }

  if (password.length < 6) {
    return "Password must be at least 6 characters long.";
  }

  return null;
};

export const validateLoginInput = ({ email, password }) => {
  if (!email || !password) {
    return "Email and password are required.";
  }

  return null;
};
