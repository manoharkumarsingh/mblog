const mongoose = require("mongoose");
const bloglike_schema = mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: "Post is Required Field"
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: "User is Required Field"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Bloglike", bloglike_schema);
