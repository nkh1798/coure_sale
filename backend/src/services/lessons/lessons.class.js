const { Service } = require("feathers-mongoose");
const fs = require("fs");

exports.Lessons = class Lessons extends Service {
  async find(params) {
    const queryParams = { $populate: "course", $sort: { createdAt: -1 } };

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
    const lessonParam = {
      ...data,
      video: `/uploads/video/${params.video.filename}`,
    };
    return super.create(lessonParam);
  }

  async patch(id, data, params) {
    const lessonParam = {
      ...data,
    };

    if (params.video) {
      const { oldVideo } = data;

      try {
        await fs.unlinkSync(`${process.env.PWD}/public${oldVideo}`);
      } catch {}

      delete lessonParam.oldVideo;
      lessonParam.video = `/uploads/video/${params.video.filename}`;
    }

    return super.patch(id, lessonParam);
  }
};
