// Initializes the `requests` service on path `/requests`
const { Requests } = require("./requests.class");
const createRequestModel = require("../../models/requests.model");
const createUserModel = require("../../models/users.model");
const hooks = require("./requests.hooks");

module.exports = function (app) {
  const requestModel = createRequestModel(app);
  // const userModel = createUserModel(app);

  const options = {
    Model: requestModel,
    paginate: app.get("paginate"),
    whitelist: ["$populate", "$regex", "$options", "$sort"],
  };

  // Initialize our service with any options it requires
  app.use("/requests", new Requests(options, app));

  app.post("/remove_requests", async (req, res) => {
    const { selectedIds } = req.body;

    await requestModel.deleteMany({ _id: { $in: selectedIds } });

    const total = await requestModel.countDocuments({});
    const data = await requestModel
      .find({})
      .sort({ createdAt: -1 })
      .populate(["user", "course"]);

    res.json({ total, data });
  });

  app.post("/process_requests", async (req, res) => {
    const { selectedIds, type } = req.body;

    if (type === "approve") {
      const requestList = await requestModel.find({
        _id: { $in: selectedIds },
      });

      for (let i = 0; i < requestList.length; i++) {
        try {
          const user = await createUserModel(app).findOne({
            _id: requestList[i].user,
          });

          const newCourseList = [...user.courses, requestList[i].course];

          await createUserModel(app)
            .findOneAndUpdate(
              { _id: requestList[i].user },
              { courses: newCourseList }
            )
            .exec();
        } catch (err) {
          console.log(err);
        }
      }
    }

    await requestModel.updateMany(
      { _id: { $in: selectedIds } },
      { status: type === "approve" ? "approved" : "rejected" }
    );

    const total = await requestModel.countDocuments({});
    const data = await requestModel
      .find({})
      .sort({ createdAt: -1 })
      .populate(["user", "course"]);

    res.json({ total, data });
  });

  // Get our initialized service so that we can register hooks
  const service = app.service("requests");

  service.hooks(hooks);
};
