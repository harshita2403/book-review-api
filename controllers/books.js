const { Op } = require('sequelize');
const { Book, Review, User } = require('../models');

// @desc      Get all books
// @route     GET /books
// @access    Public
exports.getBooks = async (req, res, next) => {
  try {
    const { author, genre, page = 1, limit = 10, sort = 'createdAt', order = 'DESC' } = req.query;
    
    // Build query
    const whereClause = {};
    if (author) whereClause.author = { [Op.like]: '%${author}%' };
    if (genre) whereClause.genre = genre;
    
    // Calculate pagination
    const offset = (page - 1) * limit;
    
    // Get books
    const { count, rows: books } = await Book.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sort, order]],
      include: [{
        model: Review,
        as: 'reviews'
      }]
    });
    
    // Pagination result
    const totalPages = Math.ceil(count / limit);
    const pagination = {
      total: count,
      limit: parseInt(limit),
      page: parseInt(page),
      pages: totalPages,
      hasMore: page < totalPages
    };

    res.status(200).json({
      success: true,
      count: books.length,
      pagination,
      data: books
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc      Get single book
// @route     GET /books/:id
// @access    Public
exports.getBook = async (req, res, next) => {
  try {
    const book = await Book.findByPk(req.params.id, {
      include: [{
        model: Review,
        as: 'reviews',
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'name']
        }]
      }]
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Book not found with id of ${req.params.id}'
      });
    }

    res.status(200).json({
      success: true,
      data: book
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc      Create new book
// @route     POST /books
// @access    Private
exports.createBook = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.userId = req.user.id;

    const book = await Book.create(req.body);

    res.status(201).json({
      success: true,
      data: book
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc      Search books
// @route     GET /books/search
// @access    Public
exports.searchBooks = async (req, res, next) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a search query'
      });
    }

    const books = await Book.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: '%${query}% '} },
          { author: { [Op.like]: '%${query}% '} }
        ]
      }
    });

    res.status(200).json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};