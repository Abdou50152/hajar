const categoriesModel = (sequileze, DataTypes) => {
    const Categories = sequileze.define(
      "categorie",
          {
      name : {
         type : DataTypes.STRING,
         allowNull: true,
      },
      description : {
         type : DataTypes.TEXT,
         allowNull: true,
      },
      image : {
         type : DataTypes.STRING,
         allowNull: true,
      },
      slug : {
         type : DataTypes.STRING,
         allowNull: true,
      },
    },
    // paranoid is responsible for the soft deletes of entities
      {
        paranoid: false,
      }
    );
    return Categories;
  };
  
  module.exports = categoriesModel;
  