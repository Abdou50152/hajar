const db = require("..");
const httpError = require("http-errors");

const Orders = db.orders;

// Créer une nouvelle commande
const createOrder = async (newOrder) => {
  const existingOrder = await Orders.findOne({
    where: { reference: newOrder.reference },
  });

  if (existingOrder) {
    throw httpError.Conflict("Order with this reference already exists");
  }

  const order = await Orders.create(newOrder);
  return order;
};

// Récupérer toutes les commandes
const getAllOrders = async (skip, limit) => {
  const ordersPromise = Orders.findAll({
    offset: skip,
    limit: limit,
    include: [
      {
        model: db.users,
        attributes: ["id", "fullName", "email"], // Specify user attributes needed
      },
      {
        model: db.orderProducts,
        attributes: ["id", "quantity", "price"], // Price here is the price at the time of order
        include: [ // Array to include multiple associated models for orderProducts
          {
            model: db.products,
            attributes: ["id", "name", "mainImage"], // Add other product fields if needed, e.g., mainImage
          },
          {
            model: db.colors,
            attributes: ["id", "name"], // Get color name
          },
          {
            model: db.size, // Ensure db.size is the correct model name for sizes
            attributes: ["id", "name"], // Get size name
          }
        ],
      },
    ],

  });

  const countPromise = Orders.count();

  const [orders, count] = await Promise.all([ordersPromise, countPromise]);
  return { count, orders };
};

// Récupérer une commande par ID
const getOrderById = async (id) => {
  const order = await Orders.findOne({
    where: { id },
  });

  if (!order) {
    throw httpError.NotFound("Order not found");
  }

  return order;
};

// Mettre à jour une commande
const updateOrder = async (newOrder) => {
  const existingOrder = await getOrderById(newOrder.id);
  if (!existingOrder) {
    throw httpError.NotFound("Order does not exist");
  }

  await Orders.update(newOrder, {
    where: { id: newOrder.id },
  });

  return newOrder;
};

// Supprimer une commande
const deleteOrderById = async (id) => {
  const order = await Orders.findOne({ where: { id } });
  if (!order) {
    throw httpError.NotFound("Order does not exist");
  }

  await Orders.destroy({ where: { id } });
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrderById,
};
