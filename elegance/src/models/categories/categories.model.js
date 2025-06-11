const db = require("..");
  const httpError = require("http-errors");
  
  const Categories = db.categories;
  
  //Create Categories
  const createCategories = async (newCategories) => {
   const existCategories = await Categories.findOne({
      where: {
        name : newCategories.name,
      },
    });
    if (existCategories) {
      throw httpError.Conflict("Categorie Already exist");
    } else {
      const categories = await Categories.create(newCategories);
      return categories;
    }
  };
  
  //Get All Categories
  const getAllCategories = async (skip, limit) => {
    const categoriesPromise = Categories.findAll({
      offset: skip,
      limit: limit,
    });
    const countPromise = Categories.count();
    const [categories, count] = await Promise.all([categoriesPromise, countPromise]);
    return { count, categories };
  };

  
  //Get Categories by ID
  const getCategoriesById = async (id) => {
    const categories = await Categories.findOne({
      where: {
        id,
      },
    });
    if (!categories) {
      throw httpError.NotFound("Categorie Not found");
    } else {
      return categories;
    }
  };
  
  //Update Categories
  const updateCategories = async (newCategorie) => {
    const categorie = await getCategoriesById(newCategorie.id);
    if (categorie) {
      if (categorie != newCategorie)
        await Categories.update(newCategorie, {
          where: { id: newCategorie.id },
        });
      return newCategorie;
    } else {
      throw httpError.NotFound("Categorie does not exist");
    }
  };
  
  //Delete Categories by id
  const deleteCategoriesById = async (id) => {
    const categoriesExist = await Categories.findOne({ where: { id } });
    if (!categoriesExist) {
      throw httpError.NotFound("Categorie does not exist");
    } else {
      await Categories.destroy({ where: { id } });
    }
  };
  
  module.exports = {
    createCategories,
    getAllCategories,
    getCategoriesById,
    updateCategories,
    deleteCategoriesById,
  };
  