const { Service } = require("feathers-mongoose");

exports.Exams = class Exams extends Service {
  async find(params) {
    const queryParams = {
      $populate: ["course", "questions"],
      $sort: { createdAt: -1 },
    };

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

  async get(id, params) {
    const queryParams = {
      $populate: "questions",
    };

    return super.get(id, {
      ...params,
      query: { ...queryParams, ...params.query },
    });
  }
};
