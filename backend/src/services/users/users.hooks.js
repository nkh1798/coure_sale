const { authenticate } = require("@feathersjs/authentication").hooks;

const {
  hashPassword,
  protect,
} = require("@feathersjs/authentication-local").hooks;

const nodemailer = require("nodemailer");
const crypto = require("crypto");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "",
    pass: "",
  },
});

module.exports = {
  before: {
    all: [],
    find: [authenticate("jwt")],
    get: [authenticate("jwt")],
    create: [
      hashPassword("password"),
      async (context) => {
        const activationToken = crypto.randomBytes(12).toString("hex");

        const mailOptions = {
          from: "no-reply@nkh.com",
          to: context.data.email,
          subject: "Please verify email",
          html: `<div align="center">
						<h1>Welcome to NKH</h1>

						<p>Please click to the link below to active your account !</p>

						<p>
							<a href="http://localhost:3000/active-account?token=${activationToken}">Active account</a>
						</p>
					</div>`,
        };

        try {
          const response = await transporter.sendMail(mailOptions);
        } catch {}

        context.data.activationToken = activationToken;

        return context;
      },
    ],
    update: [hashPassword("password"), authenticate("jwt")],
    patch: [hashPassword("password"), authenticate("jwt")],
    remove: [authenticate("jwt")],
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect("password"),
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
