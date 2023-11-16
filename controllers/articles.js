const Article = require('../models/article');

const getSavedArticles = (req, res, next) => {
  Article.find({});
};

const createArticle = (req, res, next) => {
  const {keyword, title, text, date, source, link, image} = req.body;
};

const deleteArticle = (req, res, next) => {
  const {_id} = req.params;
};