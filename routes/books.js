const express = require('express');
const { 
  getBooks,
  getBook,
  createBook,
  searchBooks
} = require('../controllers/books');

const reviewRouter = require('./reviews');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Re-route into other resource routers
router.use('/:bookId/reviews', reviewRouter);

router.route('/search').get(searchBooks);

router
  .route('/')
  .get(getBooks)
  .post(protect, createBook);

router
  .route('/:id')
  .get(getBook);

module.exports = router;