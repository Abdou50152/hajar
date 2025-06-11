const { validationResult } = require("express-validator");

const {
  createOrderProducts,
  getAllOrderProducts,
  getOrderProductsById,
  updateOrderProducts,
  deleteOrderProductsById,
} = require("../../models/orderProducts/orderProducts.model");

const { getPagination } = require("../../config/query");

// Créer une liaison commande-produit
const httpCreateOrderProducts = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const data = req.body;

  try {
    const newEntry = await createOrderProducts(data);
    return res.status(200).json(newEntry);
  } catch (err) {
    next(err);
  }
};

// Récupérer toutes les liaisons commande-produit
const httpGetAllOrderProducts = async (req, res, next) => {
  try {
    const { skip, limit } = getPagination(req.query);
    const list = await getAllOrderProducts(skip, limit);
    return res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

// Récupérer une liaison commande-produit par ID
const httpGetOrderProductsById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const entry = await getOrderProductsById(id);
    return res.status(200).json(entry);
  } catch (err) {
    next(err);
  }
};

// Mettre à jour une liaison commande-produit
const httpUpdateOrderProducts = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const id = req.params.id;
    const updated = { ...req.body, id };
    const updatedEntry = await updateOrderProducts(updated);
    return res.status(200).json(updatedEntry);
  } catch (err) {
    next(err);
  }
};

// Supprimer une liaison commande-produit
const httpDeleteOrderProductsById = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteOrderProductsById(id);
    return res.status(201).json({ message: "Deleted successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  httpCreateOrderProducts,
  httpGetAllOrderProducts,
  httpGetOrderProductsById,
  httpUpdateOrderProducts,
  httpDeleteOrderProductsById,
};
