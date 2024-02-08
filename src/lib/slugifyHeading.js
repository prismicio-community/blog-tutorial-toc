export const slugifyHeading = ({ text }) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/(^-|-$)/g, "");
};
