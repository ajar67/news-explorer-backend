const Article = require("../models/article");

const { BadRequestError } = require("../utils/errors");

const getSavedArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .distinct("articleId")
    .then((articlesIds) => {
      Article.find({ _id: { $in: articlesIds } })
        .then((articles) => {
          console.log(articles);
          res.status(200).send({ data: articles });
        })
        .catch((err) => {
          console.error(err);
          if (err.name === "CastError") {
            next(new BadRequestError("Invalid ID!"));
          }
          if (err.name === "ValidationError") {
            next(new BadRequestError("Invalid ID!"));
          }
          next(err);
        });
    });
};

module.exports = { getSavedArticles };
