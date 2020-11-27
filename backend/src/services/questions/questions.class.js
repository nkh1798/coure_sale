const { Service } = require("feathers-mongoose");

exports.Questions = class Questions extends Service {
  async find(params) {
    const queryParams = { $populate: "course", $sort: { createdAt: -1 } };
    Object.keys(params.query).forEach((key) => {
      if (key === "search") {
        queryParams["title"] = {
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
