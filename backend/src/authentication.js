const {
  AuthenticationService,
  JWTStrategy,
} = require("@feathersjs/authentication");
const { LocalStrategy } = require("@feathersjs/authentication-local");
const { expressOauth } = require("@feathersjs/authentication-oauth");

class CustomLocalStrategy extends LocalStrategy {
  async getEntityQuery(query) {
    return {
      ...query,
      activationToken: null,
      $limit: 1,
    };
  }
}

module.exports = (app) => {
  const authentication = new AuthenticationService(app);

  authentication.register("jwt", new JWTStrategy());
  authentication.register("local", new CustomLocalStrategy());

  app.use("/authentication", authentication);
  app.configure(expressOauth());
};
