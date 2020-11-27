const { Service } = require("feathers-mongoose");

exports.Requests = class Requests extends Service {
  async find(params) {
    const queryParams = {
      $populate: ["user", "course"],
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
};
