const productsModel = (sequelize, DataTypes) => {
    const Products = sequelize.define(
      "product",
          {
      stock : {
         type : DataTypes.DOUBLE,
         allowNull: true,
      },
      price : {
         type : DataTypes.DOUBLE,
         allowNull: true,
      },
      description : {
         type : DataTypes.TEXT,
         allowNull: true,
      },
      name : {
         type : DataTypes.STRING,
         allowNull: true,
      },
      slug : {
         type : DataTypes.STRING,
         allowNull: true,
      },
      imageUrl : {
         type : DataTypes.STRING,
         allowNull: true,
      },
    },
      {
        paranoid: false,
      }
    );
    return Products;
  };
  
  module.exports = productsModel;
  