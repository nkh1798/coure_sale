const createCourseModel = require("../../models/courses.model");
const createUserModel = require("../../models/users.model");
const createReviewModel = require("../../models/reviews.model");
const createRequestModel = require("../../models/requests.model");
const createCategoryModel = require("../../models/categories.model");

module.exports = function (app) {
  app.get("/admin-homes", async (_, res) => {
    const totalCourse = await createCourseModel(app).countDocuments({});
    const totalUser = await createUserModel(app).countDocuments({});
    const totalReview = await createReviewModel(app).countDocuments({});
    const totalRequest = await createRequestModel(app).countDocuments({});
    const totalCategory = await createCategoryModel(app).countDocuments({});

    res.json({
      totalCategory,
      totalCourse,
      totalRequest,
      totalReview,
      totalUser,
    });
  });

  app.service("admin-homes");
};
