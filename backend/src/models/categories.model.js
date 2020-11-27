const createCourseModel = require("./courses.model");

module.exports = function (app) {
  const modelName = "categories";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      name: { type: String, required: true },
    },
    {
      timestamps: true,
    }
  );

  // cascade delete
  schema.pre("deleteMany", async function (next) {
    const query = this.getQuery()["_id"];
    await createCourseModel(app).deleteMany({ category: query });
    next();
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);
};
