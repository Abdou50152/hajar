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
  try {
    // Use specific aliases and improve the query structure
    const ordersPromise = Orders.findAll({
      offset: skip,
      limit: limit,
      // Explicitly select certain attributes from orders table
      attributes: {
        include: [
          "id", "reference", "date", "total", "status",
          "fullName", "phone", "city", "address", // Ces champs existent directement dans la table orders
          "createdAt", "updatedAt"
        ]
      },
      include: [
        // Nous n'avons plus besoin d'inclure les utilisateurs car les informations client sont directement dans la table orders
        // La table orderproducts est essentielle pour les produits de la commande
        {
          model: db.orderproducts,
          attributes: ["id", "quantity", "price"],
          required: false, // Make it a LEFT JOIN to handle orders without products
          include: [
            {
              model: db.products,
              attributes: ["id", "name", "mainImage"],
              required: false, // LEFT JOIN
              include: [{
                model: db.categories,
                attributes: ["id", "name"],
                required: false // LEFT JOIN
              }]
            },
            {
              model: db.colors,
              attributes: ["id", "name"],
              required: false // LEFT JOIN
            },
            {
              model: db.size,
              attributes: ["id", "name"],
              required: false // LEFT JOIN
            }
          ],
        },
      ],
    });

    const countPromise = Orders.count();

    const [orders, count] = await Promise.all([ordersPromise, countPromise]);
    return { count, orders };
  } catch (error) {
    console.error("Error in getAllOrders:", error);
    throw error; // Re-throw to let the controller handle it
  }
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
