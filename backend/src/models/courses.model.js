const createExamModel = require("./exams.model");
const createLessonModel = require("./lessons.model");
const createQuestionModel = require("./questions.model");
const createRequestModel = require("./requests.model");
const createReviewModel = require("./reviews.model");

module.exports = function (app) {
  const modelName = "courses";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      name: { type: String, required: true },
      description: { type: String, required: true },
      category: {
        type: Schema.Types.ObjectId,
        ref: "categories",
      },
      price: { type: String },
      purchaseNumber: { type: Number, default: 0 },
      cover: { type: String },
    },
    {
      timestamps: true,
    }
  );

  // cascade delete
  schema.pre("deleteMany", async function (next) {
    const query = this.getQuery()["_id"];
    await createExamModel(app).deleteMany({ course: query });
    await createLessonModel(app).deleteMany({ course: query });
    await createQuestionModel(app).deleteMany({ course: query });
    await createRequestModel(app).deleteMany({ course: query });
    await createReviewModel(app).deleteMany({ course: query });
    next();
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }

  return mongooseClient.model(modelName, schema);
};
