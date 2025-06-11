const orderProductsModel = (sequelize, DataTypes) => {
  const orderProducts = sequelize.define(
    "orderproducts",
    {
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      colorId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        
      },
        orderId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        
      },
        productId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        
      },
      sizeId: {
  type: DataTypes.INTEGER,
  allowNull: false,
}
    },
    {
      paranoid: true, // pour les suppressions logiques
    }
  );

  return orderProducts;
};

module.exports = orderProductsModel;
