const sizeModel = (sequelize, DataTypes) => {
  const size = sequelize.define(
    "size",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      paranoid: true // active les suppressions logiques (soft delete)
    }
  );

  return size;
};

module.exports = sizeModel;
