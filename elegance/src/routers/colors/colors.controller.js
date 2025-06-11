const { validationResult } = require("express-validator");

const {
  createColor,
  getAllColors,
  getColorById,
  updateColor,
  deleteColorById,
} = require("../../models/colors/colors.model");

const { getPagination } = require("../../config/query");

// Créer une couleur
const httpCreateColor = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const color = req.body;
  try {
    const newColor = await createColor(color);
    return res.status(200).json(newColor);
  } catch (err) {
    next(err);
  }
};

// Récupérer toutes les couleurs
const httpGetAllColors = async (req, res, next) => {
  try {
    const { skip, limit } = getPagination(req.query);
    const list = await getAllColors(skip, limit);
    return res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

// Récupérer une couleur par ID
const httpGetColorById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const colorById = await getColorById(id);
    return res.status(200).json(colorById);
  } catch (err) {
    next(err);
  }
};

// Mettre à jour une couleur
const httpUpdateColor = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const id = req.params.id;
    const newColor = { ...req.body, id };
    const updatedColor = await updateColor(newColor);
    return res.status(200).json(updatedColor);
  } catch (err) {
    next(err);
  }
};

// Supprimer une couleur
const httpDeleteColorById = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteColorById(id);
    return res.status(201).json({ message: "Deleted successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  httpCreateColor,
  httpGetAllColors,
  httpGetColorById,
  httpUpdateColor,
  httpDeleteColorById,
};
