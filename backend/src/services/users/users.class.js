const { Service } = require("feathers-mongoose");
const fs = require("fs");

exports.Users = class Users extends (
  Service
) {
  async find(params) {
    if (params.query["$limit"]) {
      return super.find({ query: params.query });
    }

    const queryParams = { $sort: { createdAt: -1 } };

    Object.keys(params.query).forEach((key) => {
      if (key === "search") {
        queryParams["username"] = {
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
    const userParam = {
      ...data,
    };

    if (params.avatar) {
      userParam["avatar"] = `/uploads/avatar/${params.avatar.filename}`;
    }

    return super.create(userParam);
  }

  async patch(id, data, params) {
    const userParam = {
      ...data,
    };

    if (params.avatar) {
      const { oldAvatar } = data;

      try {
        await fs.unlinkSync(`${process.env.PWD}/public${oldAvatar}`);
      } catch {}

      delete userParam.oldAvatar;
      userParam.avatar = `/uploads/avatar/${params.avatar.filename}`;
    }

    return super.patch(id, userParam);
  }
};
