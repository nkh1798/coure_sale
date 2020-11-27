const { Service } = require("feathers-mongoose");

exports.Reviews = class Reviews extends Service {
  async find(params) {
    const queryParams = {
      $populate: ["user", "course"],
      $sort: { createdAt: -1 },
    };

    Object.keys(params.query).forEach((key) => {
      if (key === "search") {
        queryParams["content"] = {
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
