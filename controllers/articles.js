const Article = require("../models/article");
const {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} = require("../utils/errors");

const createArticle = (req, res, next) => {
  //POST
  const { keyword, title, text, date, source, link, image, owner } = req.body;
  Article.create({
    keyword: keyword,
    title: title,
    text: text,
    date: date,
    source: source,
    link: link,
    image: image,
    owner: owner,
  })
    .then((item) => {
      console.log(item);
      res.status(200).send({ date: item });
    })
    .catch((err) => {
      console.error(err, err.name, err.message);
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid ID!"));
      }
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid ID!"));
      }
      next(err);
    });
};

const deleteArticle = (req, res, next) => {
  //DELETE
  const { articleId } = req.params;
  Article.findById(articleId)
    .orFail(() => {
      throw new Error("Item id is not found.");
    })
    .then((item) => {
      console.log(item);
      if (!item.owner.equals(req.user._id)) {
        throw new Error("Access to this resource is forbidden.");
      }
      return item.deleteOne().then(() => {
        res.status(200).send({ message: "item was deleted" });
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid ID!"));
      }
      if (err.message === "Item id is not found.") {
        next(new NotFoundError("Id is not found in the database!"));
      }
      if (err.message === "Access to this resource is forbidden.") {
        next(new ForbiddenError("Access to this resource is forbidden."));
      }

      next(err);
    });
};

module.exports = { createArticle, deleteArticle };
