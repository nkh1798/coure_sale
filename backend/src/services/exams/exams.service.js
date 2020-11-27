// Initializes the `exams` service on path `/exams`
const { Exams } = require("./exams.class");
const createModel = require("../../models/exams.model");
const hooks = require("./exams.hooks");

module.exports = function (app) {
  const examVideo = createModel(app);

  const options = {
    Model: examVideo,
    paginate: app.get("paginate"),
    whitelist: ["$populate", "$regex", "$options", "$sort"],
  };

  // Initialize our service with any options it requires
  app.use("/exams", new Exams(options, app));

  app.post("/remove_exams", async (req, res) => {
    const { selectedIds } = req.body;

    await examVideo.deleteMany({ _id: { $in: selectedIds } });

    const total = await examVideo.countDocuments({});
    const data = await examVideo.find({}).sort({ createdAt: -1 });

    res.json({ total, data });
  });

  // Get our initialized service so that we can register hooks
  const service = app.service("exams");

  service.hooks(hooks);
};
