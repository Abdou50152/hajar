const dbConfig = require("../config/dbConfig");

  const { Sequelize, DataTypes } = require("sequelize");
  
  const sequileze = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
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
  
  sequileze
    .authenticate()
    .then(() => console.log("connected successfully to the DB ..."))
    .catch((err) => console.log(err));
  
  const db = {};
  db.Sequelize = Sequelize;
  db.sequileze = sequileze;
  
  
  db.categories = require("./categories/categories.mysql")(sequileze, DataTypes);

  db.products = require("./products/products.mysql")(sequileze, DataTypes);
  // 
   db.admin = require("./admin/admin.mysql")(sequileze, DataTypes);
   db.users = require("./users/users.mysql")(sequileze, DataTypes);
   db.orders = require("./orders/orders.mysql")(sequileze, DataTypes);
   db.orderProducts = require("./orderProducts/orderProducts.mysql")(sequileze, DataTypes);
   db.colors = require("./colors/colors.mysql")(sequileze, DataTypes);
   db.size = require("./size/size.mysql")(sequileze, DataTypes);
   db.productImages = require("./productImages/productImages.mysql")(sequileze, DataTypes);

  

  
  /**One To Many Relationship between categories and products*/  
  db.categories.hasMany(db.products);
  db.products.belongsTo(db.categories);

  db.users.hasMany(db.orders);
  db.orders.belongsTo(db.users);

  db.orders.hasMany(db.orderProducts);
  db.orderProducts.belongsTo(db.orders);

  db.products.hasMany(db.orderProducts);
  db.orderProducts.belongsTo(db.products);

  db.products.belongsToMany(db.colors, { through: "product_colors" });
  db.colors.belongsToMany(db.products, { through: "product_colors" });
  
  db.colors.hasMany(db.orderProducts);
  db.orderProducts.belongsTo(db.colors);

  db.products.belongsToMany(db.size, { through: "product_size" });
  db.size.belongsToMany(db.products, { through: "product_size" });

  db.size.hasMany(db.orderProducts);
  db.orderProducts.belongsTo(db.size);

  // Product Images relationship
  db.products.hasMany(db.productImages);
  db.productImages.belongsTo(db.products);

  
  db.sequileze
    .sync({ alter: true }) // Use alter:true to update existing tables with new columns
    .then(() => console.log("sequelize is running and schema updated!"))
    .catch((err) => console.log(err));
  
  module.exports = db;
  