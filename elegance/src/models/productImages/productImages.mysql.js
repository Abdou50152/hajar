const productImagesModel = (sequelize, DataTypes) => {
  const ProductImages = sequelize.define(
    "productImage",
    {
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isPrimary: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      order: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      }
    },
    {
      paranoid: false,
    }
  );
  return ProductImages;
};

module.exports = productImagesModel;
