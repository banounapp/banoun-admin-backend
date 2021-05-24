const mongoose = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");

const contentSchema = mongoose.Schema({
  content: [
    {
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
    },
  ],
});

contentSchema.plugin(findOrCreate);

const Content = mongoose.model("content", contentSchema);

module.exports = Content;