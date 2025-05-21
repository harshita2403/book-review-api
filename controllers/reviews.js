const { Review, Book } = require('../models');

// @desc      Get reviews for a book
// @route     GET /books/:bookId/reviews
// @access    Public
exports.getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.findAll({ 
      where: { bookId: req.params.bookId },
      include: {
        model: 'User',
        as: 'user',
        attributes: ['id', 'name']
      }
    });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc      Add review
// @route     POST /books/:bookId/reviews
// @access    Private
exports.addReview = async (req, res, next) => {
  try {
    req.body.bookId = req.params.bookId;
    req.body.userId = req.user.id;

    // Check if book exists
    const book = await Book.findByPk(req.params.bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'No book with the id of ${req.params.bookId}'
      });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
      where: {
        userId: req.user.id,
        bookId: req.params.bookId
      }
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        error: 'You have already reviewed this book'
      });
    }

    const review = await Review.create(req.body);

    res.status(201).json({
      success: true,
      data: review
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc      Update review
// @route     PUT /reviews/:id
// @access    Private
exports.updateReview = async (req, res, next) => {
  try {
    let review = await Review.findByPk(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'No review with the id of ${req.params.id}'
      });
    }

    // Make sure review belongs to user
    if (review.userId !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this review'
      });
    }

    review = await review.update(req.body);

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc      Delete review
// @route     DELETE /reviews/:id
// @access    Private
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByPk(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'No review with the id of ${req.params.id}'
      });
    }

    // Make sure review belongs to user
    if (review.userId !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this review'
      });
    }

    await review.destroy();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};