const express = require("express");
const { authorize } = require("../middlewares/auth");
const router = express.Router();

const { createArticle, deleteArticle } = require("../controllers/articles");
const { getSavedArticles } = require("../controllers/savedArticle");

router.get("/", authorize, getSavedArticles);
router.post("/", authorize, createArticle);
router.delete("/:articleId", authorize, deleteArticle);

module.exports = router;
