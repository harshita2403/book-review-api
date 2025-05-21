const User = require('./User');
const Book = require('./Book');
const Review = require('./Review');

// Define relationships
User.hasMany(Book, {
  foreignKey: 'userId',
  as: 'books'
});

Book.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

User.hasMany(Review, {
  foreignKey: 'userId',
  as: 'reviews'
});

Review.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

Book.hasMany(Review, {
  foreignKey: 'bookId',
  as: 'reviews'
});

Review.belongsTo(Book, {
  foreignKey: 'bookId',
  as: 'book'
});

// Method to update book's average rating
Review.afterSave(async (review) => {
  const bookId = review.bookId;
  const reviews = await Review.findAll({
    where: { bookId }
  });
  
  if (reviews.length > 0) {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    
    await Book.update(
      { averageRating },
      { where: { id: bookId } }
    );
  }
});

Review.afterDestroy(async (review) => {
  const bookId = review.bookId;
  const reviews = await Review.findAll({
    where: { bookId }
  });
  
  if (reviews.length > 0) {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    
    await Book.update(
      { averageRating },
      { where: { id: bookId } }
    );
  } else {
    await Book.update(
      { averageRating: 0 },
      { where: { id: bookId } }
    );
  }
});

module.exports = {
  User,
  Book,
  Review
};