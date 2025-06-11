const { validationResult } = require("express-validator");

const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrderById,
} = require("../../models/orders/orders.model");

const { getPagination } = require("../../config/query");
const { createOrderProducts } = require("../../models/orderProducts/orderProducts.model");
const httpError = require("http-errors"); // For error handling

// Créer une commande
const httpCreateOrder = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const order = req.body;
  try {
    const newOrder = await createOrder(order);
    return res.status(200).json(newOrder);
  } catch (err) {
    next(err);
  }
};

// Récupérer toutes les commandes
const httpGetAllOrders = async (req, res, next) => {
  try {
    const { skip, limit } = getPagination(req.query);
    console.log(`[GET /orders] Processing request with skip=${skip}, limit=${limit}`);
    
    const list = await getAllOrders(skip, limit);
    
    // Clean up the response to handle potential null values
    const cleanedOrders = list.orders.map(order => {
      // Convert order to plain object to allow modification
      const plainOrder = order.get({ plain: true });
      
      // Format client information (now directly from orders table)
      plainOrder.client = {
        name: plainOrder.fullName || 'Unknown',
        phone: plainOrder.phone || 'N/A',
        address: plainOrder.address || 'N/A'
      };
      
      // Check for null values in the nested objects
      if (plainOrder.orderproducts) {
        plainOrder.orderproducts = plainOrder.orderproducts.filter(op => op !== null);
        
        // Clean up each orderproduct
        plainOrder.orderproducts = plainOrder.orderproducts.map(op => {
          if (!op) return null;
          
          // Handle potential null product or missing fields
          if (!op.product) op.product = { name: 'Unknown', id: null };
          if (!op.product.category) op.product.category = { name: 'Unknown' };
          if (!op.color) op.color = { name: 'N/A' };
          if (!op.size) op.size = { name: 'N/A' };
          
          return op;
        }).filter(op => op !== null);
      } else {
        plainOrder.orderproducts = [];
      }
      
      return plainOrder;
    });
    
    console.log(`Successfully processed ${cleanedOrders.length} orders`);
    
    return res.status(200).json({
      count: list.count,
      orders: cleanedOrders
    });
  } catch (err) {
    console.error('[GET /orders] Error:', err);
    res.status(500).json({
      message: 'Failed to retrieve orders',
      error: err.message || 'Unknown error occurred'
    });
  }
};

// Récupérer une commande par ID
const httpGetOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const orderById = await getOrderById(id);
    return res.status(200).json(orderById);
  } catch (err) {
    next(err);
  }
};

// Mettre à jour une commande
const httpUpdateOrder = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const id = req.params.id;
    const updated = { ...req.body, id };
    const updatedOrder = await updateOrder(updated);
    return res.status(200).json(updatedOrder);
  } catch (err) {
    next(err);
  }
};

// Supprimer une commande
const httpDeleteOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteOrderById(id);
    return res.status(201).json({ message: "Deleted successfully" });
  } catch (err) {
    next(err);
  }
};

// Controller function to add products to an existing order
const httpAddProductsToOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const products = req.body.products; // Expecting an array of products

    if (!orderId) {
      return next(httpError.BadRequest("Order ID is required."));
    }
    if (!Array.isArray(products) || products.length === 0) {
      return next(httpError.BadRequest("Products array is required and cannot be empty."));
    }

    const addedProducts = [];
    for (const product of products) {
      // Map client field names to backend model expected names
      const newOrderProductData = {
        orderId: parseInt(orderId, 10),
        productId: product.product_id, // Client sends product_id
        quantity: product.quantity,
        price: product.price,
        colorName: product.color,    // Client sends color (name)
        sizeName: product.size       // Client sends size (name)
      };
      const createdProductEntry = await createOrderProducts(newOrderProductData);
      addedProducts.push(createdProductEntry);
    }

    return res.status(201).json({ 
      message: "Products added to order successfully", 
      count: addedProducts.length,
      data: addedProducts 
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  httpCreateOrder,
  httpGetAllOrders,
  httpGetOrderById,
  httpUpdateOrder,
  httpDeleteOrderById,
  httpAddProductsToOrder,
};
