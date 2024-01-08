const bookHelper = require("./helpers/bookHelper");
const dynamoDB = require("./services/dynamoDB");
class BookController {
  async publishBook(req, res) {
    try {
      const { title, author, genre, description, language, username } = req.body;
      const bookAttrs = { title, author, genre, description, language, username };

      await dynamoDB.publishBook(bookAttrs);
      await res.status(201).json({ message: "Book published successfully" });
    }
    catch (error) {
      await res.status(error.status || 500).json({ error });
    }
  }

  async searchBooks(req, res) {
    //todo: validate
    try {
      const result = await dynamoDB.searchBooks(req.query.title);
      await res.status(200).json({ items: result.Items });
    }
    catch (error) {
      await res.status(error.status || 500).json({ error });
    }
  }

  async unpublishBook(req, res) {
    try {
      await dynamoDB.unpublishBook(req.params.bookId);
      await res.status(204).json({ message: "Book un-published successfully" });
    }
    catch (error) {
      await res.status(error.status || 500).json({ error });
    }
  }

  async getUserBooks(req, res) {
    try {
      const result = await dynamoDB.getUserBooks(req.body.username);
      await res.json({ items: result.Items });
    }
    catch (error) {
      await res.status(error.status || 500).json({ error });
    }
  }

  async getAllPublishedBooks(req, res) {
    const { page_size, last_evaluated_key } = req.query;
    try {
      const result = await dynamoDB.getAllPublishedBooks(page_size, last_evaluated_key);
      await res.status(200).json({ items: result.Items, lastEvaluatedKey: result?.LastEvaluatedKey?.book_id });
    }
    catch (error) {
      await res.status(error.status || 500).json({ error });
    }
  }
}

module.exports = new BookController();
