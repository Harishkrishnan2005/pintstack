export const normalizeTags = (tags) => {
  if (!tags) {
    return [];
  }

  if (Array.isArray(tags)) {
    return tags.map((tag) => String(tag).trim().toLowerCase()).filter(Boolean);
  }

  return String(tags)
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);
};

export const validatePostInput = ({ title, description, category }) => {
  if (!title || !description || !category) {
    return "Title, description, and category are required.";
  }

  return null;
};
