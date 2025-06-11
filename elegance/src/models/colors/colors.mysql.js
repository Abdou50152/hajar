const colorModel = (sequelize, DataTypes) => {
  const color = sequelize.define(
    "colors",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      paranoid: true // active les suppressions logiques (soft delete)
    }
  );

  return color;
};

module.exports = colorModel;
