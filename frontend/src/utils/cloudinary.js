export const getOptimizedImage = (imageUrl, width = 800) => {
  if (!imageUrl?.includes("/upload/")) {
    return imageUrl;
  }

  return imageUrl.replace(
    "/upload/",
    `/upload/f_auto,q_auto,c_limit,w_${width}/`
  );
};
