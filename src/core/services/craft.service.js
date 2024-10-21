const Recipe = require('../models/recipe.model');

class CraftService {
  getAllRecipes = async () => {
    return await Recipe.find()
      .populate('ingredients.item result.item')
      .sort({ code: 1 });
  };

  craft = async ({ code, userID }) => {
    const recipe = await Recipe.findOne({ code }).populate(
      'ingredients.item result.item'
    );
  };
}

module.exports = new CraftService();
