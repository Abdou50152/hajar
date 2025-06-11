const db = require("..");
const httpError = require("http-errors");

const orderProductsTable = db.orderProducts;

// Créer une entrée dans orders_products
const createOrderProducts = async (newOrderProductData) => { // Renamed for clarity
  try {
    // Input: newOrderProductData is expected to have orderId, productId, quantity, price, colorName, sizeName
    const { orderId, productId, quantity, price, colorName, sizeName } = newOrderProductData;

    let colorId = null;
    if (colorName) {
      const color = await db.colors.findOne({ where: { name: colorName } });
      if (!color) {
        throw httpError.NotFound(`Color not found: ${colorName}`);
      }
      colorId = color.id;
    }

    let sizeId = null;
    if (sizeName) {
      const size = await db.size.findOne({ where: { name: sizeName } });
      if (!size) {
        throw httpError.NotFound(`Size not found: ${sizeName}`);
      }
      sizeId = size.id;
    }

    const orderDataToSave = {
      order_id: orderId,
      product_id: productId,
      quantity: quantity,
      price: price,
      colorId: colorId, // Use the looked-up colorId
      sizeId: sizeId     // Use the looked-up sizeId
    };

    // Vérifier si le produit existe déjà dans la commande
    const existingEntry = await orderProductsTable.findOne({
      where: {
        order_id: orderDataToSave.order_id,
        product_id: orderDataToSave.product_id,
        // Consider if colorId and sizeId should also be part of the uniqueness check
        // For now, assuming a product can only be in an order once, regardless of color/size variant in this table
      },
    });

    if (existingEntry) {
      throw httpError.Conflict("This product is already in the order");
    }

    // Créer l'entrée dans la base de données
    const createdProduct = await orderProductsTable.create(orderDataToSave);
    return createdProduct;
  } catch (error) {
    console.error('Erreur dans createOrderProducts:', error);
    throw error;
  }
};

// Récupérer tous les order_products (avec pagination)
const getAllOrderProducts = async (skip = 0, limit = 10) => {
  const listPromise = orderProductsTable.findAll({
    offset: skip,
    limit: limit,
  });

  const countPromise = orderProductsTable.count();

  const [products, count] = await Promise.all([listPromise, countPromise]);
  return { count, products };
};

// Récupérer un order_product spécifique
const getOrderProductsById = async (id) => {
  const entry = await orderProductsTable.findOne({
    where: { id },
  });

  if (!entry) {
    throw httpError.NotFound("Order product entry not found");
  }

  return entry;
};

// Mettre à jour une entrée order_product
const updateOrderProducts = async (newData) => {
  const existing = await getOrderProductsById(newData.id);
  if (!existing) {
    throw httpError.NotFound("Order product entry does not exist");
  }

  await orderProductsTable.update(newData, {
    where: { id: newData.id },
  });

  return newData;
};

// Supprimer une entrée order_product
const deleteOrderProductsById = async (id) => {
  const existing = await orderProductsTable.findOne({ where: { id } });
  if (!existing) {
    throw httpError.NotFound("Order product entry does not exist");
  }

  await orderProductsTable.destroy({ where: { id } });
};

module.exports = {
  createOrderProducts,
  getAllOrderProducts,
  getOrderProductsById,
  updateOrderProducts,
  deleteOrderProductsById,
};
