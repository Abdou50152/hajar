const dbConfig = require("../config/dbConfig");

  const { Sequelize, DataTypes } = require("sequelize");
  
  const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle,
    },
  });
  
  sequelize
    .authenticate()
    .then(() => console.log("connected successfully to the DB ..."))
    .catch((err) => console.log(err));
  
  const db = {};
  db.Sequelize = Sequelize;
  db.sequelize = sequelize;
  
  
  db.categories = require("./categories/categories.mysql")(sequelize, DataTypes);

  db.products = require("./products/products.mysql")(sequelize, DataTypes);
  // 
   db.admin = require("./admin/admin.mysql")(sequelize, DataTypes);
   db.users = require("./users/users.mysql")(sequelize, DataTypes);
   db.orders = require("./orders/orders.mysql")(sequelize, DataTypes);
   db.orderproducts = require("./orderProducts/orderProducts.mysql")(sequelize, DataTypes);
   db.colors = require("./colors/colors.mysql")(sequelize, DataTypes);
   db.size = require("./size/size.mysql")(sequelize, DataTypes);
   db.productImages = require("./productImages/productImages.mysql")(sequelize, DataTypes);

  

  
  /**One To Many Relationship between categories and products*/  
  db.categories.hasMany(db.products);
  db.products.belongsTo(db.categories);

  db.users.hasMany(db.orders);
  db.orders.belongsTo(db.users);

  db.orders.hasMany(db.orderproducts);
  db.orderproducts.belongsTo(db.orders);

  db.products.hasMany(db.orderproducts);
  db.orderproducts.belongsTo(db.products);

  db.products.belongsToMany(db.colors, { through: "product_colors" });
  db.colors.belongsToMany(db.products, { through: "product_colors" });
  
  db.colors.hasMany(db.orderproducts);
  db.orderproducts.belongsTo(db.colors);

  db.products.belongsToMany(db.size, { through: "product_size" });
  db.size.belongsToMany(db.products, { through: "product_size" });

  db.size.hasMany(db.orderproducts);
  db.orderproducts.belongsTo(db.size);

  // Product Images relationship
  db.products.hasMany(db.productImages);
  db.productImages.belongsTo(db.products);

  
  db.sequelize
    .sync({ alter: true }) // Use alter:true to update existing tables with new columns
    .then(() => console.log("sequelize is running and schema updated!"))
    .catch((err) => console.log(err));
  
  module.exports = db;
  