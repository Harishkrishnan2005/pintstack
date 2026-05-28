export const validateProfileUpdate = ({ username, email, bio }) => {
  if (!username || !email) {
    return "Username and email are required.";
  }

  if (bio && bio.length > 240) {
    return "Bio must be less than 240 characters.";
  }

  return null;
};
