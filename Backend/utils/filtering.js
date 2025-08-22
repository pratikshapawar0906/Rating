exports.buildUserFilter = (req) => {
  const { search, role } = req.query;
  const filter = {};
  if (role) filter.role = role;
  if (search) {
    const r = new RegExp(search, "i");
    filter.$or = [{ name: r }, { email: r }, { address: r }];
  }
  return filter;
};

exports.buildStoreFilter = (req) => {
  const { search } = req.query;
  const filter = {};
  if (search) {
    const r = new RegExp(search, "i");
    filter.$or = [{ name: r }, { address: r }, { email: r }];
  }
  return filter;
};
