const { Service } = require("feathers-mongoose");
const fs = require("fs");

exports.Courses = class Courses extends Service {
  async find(params) {
    const queryParams = { $populate: "category", $sort: { createdAt: -1 } };
    Object.keys(params.query).forEach((key) => {
      if (key === "search") {
        queryParams["name"] = {
          $regex: params.query[key],
          $options: "ig",
        };
        return;
      }

      queryParams[`$${key}`] = params.query[key];
    });
    return super.find({ query: queryParams });
  }

  async create(data, params) {
    const courseParam = {
      ...data,
      cover: `/uploads/cover/${params.cover.filename}`,
    };
    return super.create(courseParam);
  }

  async patch(id, data, params) {
    const courseParam = {
      ...data,
    };

    if (params.cover) {
      const { oldCover } = data;

      try {
        await fs.unlinkSync(`${process.env.PWD}/public${oldCover}`);
      } catch {}

      delete courseParam.oldCover;
      courseParam.cover = `/uploads/cover/${params.cover.filename}`;
    }

    return super.patch(id, courseParam);
  }
};
