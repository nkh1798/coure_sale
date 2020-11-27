// Initializes the `reviews` service on path `/reviews`
const { Reviews } = require("./reviews.class");
const createModel = require("../../models/reviews.model");
const hooks = require("./reviews.hooks");

module.exports = function (app) {
  const reviewModel = createModel(app);

  const options = {
    Model: reviewModel,
    paginate: app.get("paginate"),
    whitelist: ["$populate", "$regex", "$options", "$sort"],
  };

  // Initialize our service with any options it requires
  app.use("/reviews", new Reviews(options, app));

  app.post("/remove_reviews", async (req, res) => {
    const { selectedIds } = req.body;

    await reviewModel.deleteMany({ _id: { $in: selectedIds } });

    const total = await reviewModel.countDocuments({});
    const data = await reviewModel
      .find({})
      .sort({ createdAt: -1 })
      .populate(["user", "course"]);

    res.json({ total, data });
  });

  // Get our initialized service so that we can register hooks
  const service = app.service("reviews");

  service.hooks(hooks);
};
