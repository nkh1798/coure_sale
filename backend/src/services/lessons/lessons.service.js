const multer = require("multer");
const fs = require("fs");

const { Lessons } = require("./lessons.class");
const createModel = require("../../models/lessons.model");
const hooks = require("./lessons.hooks");

if (!fs.existsSync(process.env.PWD + "/public/uploads/video")) {
  fs.mkdirSync(process.env.PWD + "/public/uploads/video");
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) =>
    cb(null, process.env.PWD + "/public/uploads/video"), // where the files are being stored
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`), // getting the file name
});

const upload = multer({
  storage,
});

module.exports = function (app) {
  const lessonModel = createModel(app);

  const options = {
    Model: lessonModel,
    paginate: app.get("paginate"),
    whitelist: ["$populate", "$regex", "$options", "$sort"],
  };

  // Initialize our service with any options it requires
  app.use(
    "/lessons",
    upload.single("video"),
    (req, _, next) => {
      req.feathers.video = req.file;
      next();
    },
    new Lessons(options, app)
  );

  app.post("/remove_lessons", async (req, res) => {
    const { selectedIds } = req.body;

    const deleteLessons = await lessonModel.find(
      {
        _id: { $in: selectedIds },
      },
      "video"
    );

    for (let i = 0; i < deleteLessons.length; i++) {
      try {
        await fs.unlinkSync(
          `${process.env.PWD}/public${deleteLessons[i].video}`
        );
      } catch {}
    }

    await lessonModel.deleteMany({ _id: { $in: selectedIds } });

    const total = await lessonModel.countDocuments({});
    const data = await lessonModel.find({}).sort({ createdAt: -1 });

    res.json({ total, data });
  });

  // Get our initialized service so that we can register hooks
  const service = app.service("lessons");

  service.hooks(hooks);
};
