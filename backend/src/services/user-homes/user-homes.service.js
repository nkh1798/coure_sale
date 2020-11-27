const createCourseModel = require("../../models/courses.model");
const createCategoryModel = require("../../models/categories.model");
const createLessonModel = require("../../models/lessons.model");
const createReviewModel = require("../../models/reviews.model");
const createRequestModel = require("../../models/requests.model");
const createUserModel = require("../../models/users.model");

module.exports = function (app) {
  app.get("/user-homes", async (req, res) => {
    const { categoryId } = req.query;

    const categories = await createCategoryModel(app)
      .find({})
      .sort({ createdAt: -1 });
    const courses = categories.length
      ? await createCourseModel(app).find({
          category: categoryId ? categoryId : categories[0]._id,
        })
      : [];

    const hotCourses = await createCourseModel(app)
      .find({})
      .sort({ purchaseNumber: -1 })
      .limit(4);

    res.json({ categories, courses, hotCourses });
  });

  app.get("/course-detail", async (req, res) => {
    const { courseId } = req.query;

    const course = await createCourseModel(app).findOne({ _id: courseId });

    const reviews = await createReviewModel(app)
      .find({ course: courseId })
      .populate("user")
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ course, reviews });
  });

  app.get("/search-courses", async (req, res) => {
    const { q } = req.query;

    const courses = await createCourseModel(app).find({
      name: { $regex: q, $options: "ig" },
    });

    res.json({ courses });
  });

  app.post("/checkout", async (req, res) => {
    const { courses, user, note } = req.body;

    for (let i = 0; i < courses.length; i++) {
      await createRequestModel(app).create({
        user,
        course: courses[i],
        note,
      });
    }

    res.json({ status: "success" });
  });

  app.get("/my-courses", async (req, res) => {
    const { userId, categoryId, search } = req.query;

    const categories = await createCategoryModel(app)
      .find({})
      .select(["_id", "name"]);

    const user = await createUserModel(app)
      .findOne({
        _id: userId,
      })
      .populate("courses")
      .select("courses");

    let courseResponse = user.courses;

    if (categoryId) {
      courseResponse = courseResponse.filter(
        (course) => course.category == categoryId
      );
    }

    if (search) {
      courseResponse = courseResponse.filter(
        (course) => course.name.toLowerCase().indexOf(search.toLowerCase()) > -1
      );
    }

    res.json({ courses: courseResponse, categories });
  });

  app.get("/my-course-detail", async (req, res) => {
    const { courseId } = req.query;

    const course = await createCourseModel(app).findOne({ _id: courseId });

    const lessons = await createLessonModel(app).find({ course: courseId });

    res.json({ course, lessons });
  });

  app.patch("/my-course-detail/finish-lesson", async (req, res) => {
    const { lessonId, courseId } = req.body;

    await createLessonModel(app).findOneAndUpdate(
      { _id: lessonId },
      { isFinish: true }
    );

    const course = await createCourseModel(app).findOne({ _id: courseId });

    const lessons = await createLessonModel(app).find({ course: courseId });

    res.json({ course, lessons });
  });

  app.get("/active-account", async (req, res) => {
    const { activationToken } = req.query;

    let user = null;

    try {
      user = await createUserModel(app).findOne({ activationToken });
    } catch {}

    res.json({ user });
  });

  app.service("user-homes");
};
