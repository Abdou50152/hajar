const orderModel = (sequelize, DataTypes) => {
  const order = sequelize.define(
    "orders",
    {
      reference: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: true, // Or false if you want to make it mandatory
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true, // Or false
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true, // Or false
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true, // Or false
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      total: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { // Optional: formally define foreign key constraint
          model: 'users', // Name of the target table
          key: 'id'
        }
      },
      status: {
        type: DataTypes.ENUM(
          "new",
          "confirmed",
          "pending",
          "shipped",
          "refunded"
        ),
        defaultValue: "new",
      },
    },
    {
      paranoid: true,
    }
  );

  return order;
};

module.exports = orderModel;
