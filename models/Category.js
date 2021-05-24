const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');

const categorySchema = mongoose.Schema({
  category: {
    name: { type: String, required: true },
    sub_category: {
      name: { type: String, required: true },

      articles: [
        {
          title: {
            type: String,
            required: true,
          },
          description: {
            type: String,
            required: true,
          },
          image: {
            required: true,
          },
        },
      ],

      books: [
        {
          title: {
            type: String,
            required: true,
          },
          description: {
            type: String,
            required: true,
          },
          image: {
            required: true,
          },
          link: {
            type: String,
            required: true,
          },
        },
      ],
    },
  },
});

categorySchema.plugin(findOrCreate);

const Category  = mongoose.model('category', categorySchema);

module.exports = Category;
