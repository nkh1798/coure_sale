// Initializes the `questions` service on path `/questions`
const { Questions } = require("./questions.class");
const createModel = require("../../models/questions.model");
const hooks = require("./questions.hooks");

module.exports = function (app) {
  const questionModel = createModel(app);

  const options = {
    Model: questionModel,
    paginate: app.get("paginate"),
    whitelist: ["$populate", "$regex", "$options", "$sort"],
  };

  // Initialize our service with any options it requires
  app.use("/questions", new Questions(options, app));

  app.post("/remove_questions", async (req, res) => {
    const { selectedIds } = req.body;

    await questionModel.deleteMany({ _id: { $in: selectedIds } });

    const total = await questionModel.countDocuments({});
    const data = await questionModel.find({}).sort({ createdAt: -1 });

    res.json({ total, data });
  });

  // Get our initialized service so that we can register hooks
  const service = app.service("questions");

  service.hooks(hooks);
};
