// Initializes the `categories` service on path `/categories`
const { Categories } = require("./categories.class");
const createModel = require("../../models/categories.model");
const hooks = require("./categories.hooks");

module.exports = function (app) {
  const categoryModel = createModel(app);

  const options = {
    Model: categoryModel,
    paginate: app.get("paginate"),
    whitelist: ["$regex", "$options", "$sort"],
  };

  // Initialize our service with any options it requires
  app.use("/categories", new Categories(options, app));

  app.post("/remove_categories", async (req, res) => {
    const { selectedIds } = req.body;

    await categoryModel.deleteMany({ _id: { $in: selectedIds } });

    const total = await categoryModel.countDocuments({});
    const data = await categoryModel.find({}).sort({ createdAt: -1 });

    res.json({ total, data });
  });

  // Get our initialized service so that we can register hooks
  const service = app.service("categories");

  service.hooks(hooks);
};
