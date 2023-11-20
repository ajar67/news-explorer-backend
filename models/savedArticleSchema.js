const mongoose = require("mongoose");

const savedArticleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  articleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "article",
    required: true,
  },
});

module.exports = mongoose.model("savedArticle", savedArticleSchema);
