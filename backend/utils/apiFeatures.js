class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    ["page", "limit", "sort", "keyword"].forEach((field) => delete queryObj[field]);

    this.query = this.query.find(queryObj);
    return this;
  }

  search(fields = []) {
    const { keyword } = this.queryString;

    if (keyword && fields.length) {
      this.query = this.query.find({
        $or: fields.map((field) => ({
          [field]: { $regex: keyword, $options: "i" },
        })),
      });
    }

    return this;
  }

  sort(defaultSort = "-createdAt") {
    this.query = this.query.sort(this.queryString.sort || defaultSort);
    return this;
  }

  paginate() {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 12;
    const skip = (page - 1) * limit;

    this.page = page;
    this.limit = limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

export default APIFeatures;
