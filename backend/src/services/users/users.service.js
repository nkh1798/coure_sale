const multer = require("multer");
const fs = require("fs");

// Initializes the `users` service on path `/users`
const { Users } = require("./users.class");
const createModel = require("../../models/users.model");
const hooks = require("./users.hooks");

if (!fs.existsSync(process.env.PWD + "/public/uploads/avatar")) {
  fs.mkdirSync(process.env.PWD + "/public/uploads/avatar");
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) =>
    cb(null, process.env.PWD + "/public/uploads/avatar"), // where the files are being stored
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`), // getting the file name
});

const upload = multer({
  storage,
});

module.exports = function (app) {
  const userModel = createModel(app);

  const options = {
    Model: userModel,
    paginate: app.get("paginate"),
    whitelist: ["$regex", "$options", "$sort"],
  };

  // Initialize our service with any options it requires
  app.use(
    "/users",
    upload.single("avatar"),
    (req, _, next) => {
      req.feathers.avatar = req.file;
      next();
    },
    new Users(options, app)
  );

  app.post("/remove_users", async (req, res) => {
    const { selectedIds } = req.body;

    const deleteCourses = await userModel.find(
      {
        _id: { $in: selectedIds },
      },
      "avatar"
    );

    for (let i = 0; i < deleteCourses.length; i++) {
      try {
        await fs.unlinkSync(
          `${process.env.PWD}/public${deleteCourses[i].avatar}`
        );
      } catch {}
    }

    await userModel.deleteMany({ _id: { $in: selectedIds } });

    const total = await userModel.countDocuments({});
    const data = await userModel
      .find({})
      .sort({ createdAt: -1 })
      .populate("category");

    res.json({ total, data });
  });

  // Get our initialized service so that we can register hooks
  const service = app.service("users");

  service.hooks(hooks);
};
