exports.getSort = (req, fallback = "createdAt") => {
  const sortBy = req.query.sortBy || fallback;
  const order = (req.query.order || "desc") === "asc" ? 1 : -1;
  return { [sortBy]: order };
};
