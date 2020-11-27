const multer = require("multer");
const fs = require("fs");

const { Courses } = require("./courses.class");
const hooks = require("./courses.hooks");
const createCourseModel = require("../../models/courses.model");

if (!fs.existsSync(process.env.PWD + "/public/uploads/cover")) {
  fs.mkdirSync(process.env.PWD + "/public/uploads/cover");
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) =>
    cb(null, process.env.PWD + "/public/uploads/cover"), // where the files are being stored
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`), // getting the file name
});

const upload = multer({
  storage,
});

module.exports = function (app) {
  const courseModel = createCourseModel(app);

  const options = {
    Model: courseModel,
    paginate: app.get("paginate"),
    whitelist: ["$populate", "$regex", "$options", "$sort"],
  };

  // Initialize our service with any options it requires
  app.use(
    "/courses",
    upload.single("cover"),
    (req, _, next) => {
      req.feathers.cover = req.file;
      next();
    },
    new Courses(options, app)
  );

  app.post("/remove_courses", async (req, res) => {
    const { selectedIds } = req.body;

    const deleteCourses = await courseModel.find(
      {
        _id: { $in: selectedIds },
      },
      "cover"
    );

    for (let i = 0; i < deleteCourses.length; i++) {
      try {
        await fs.unlinkSync(
          `${process.env.PWD}/public${deleteCourses[i].cover}`
        );
      } catch {}
    }

    await courseModel.deleteMany({ _id: { $in: selectedIds } });

    const total = await courseModel.countDocuments({});
    const data = await courseModel
      .find({})
      .sort({ createdAt: -1 })
      .populate("category");

    res.json({ total, data });
  });

  // Get our initialized service so that we can register hooks
  const service = app.service("courses");

  service.hooks(hooks);
};
