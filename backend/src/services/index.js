const adminHomes = require("./admin_homes/admin_homes.service.js");
const categories = require("./categories/categories.service.js");
const courses = require("./courses/courses.service.js");
const exams = require("./exams/exams.service.js");
const lessons = require("./lessons/lessons.service.js");
const questions = require("./questions/questions.service.js");
const requests = require("./requests/requests.service.js");
const reviews = require("./reviews/reviews.service.js");
const userHomes = require("./user-homes/user-homes.service.js");
const users = require("./users/users.service.js");

// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(adminHomes);
  app.configure(categories);
  app.configure(courses);
  app.configure(exams);
  app.configure(lessons);
  app.configure(questions);
  app.configure(requests);
  app.configure(reviews);
  app.configure(userHomes);
  app.configure(users);
};
