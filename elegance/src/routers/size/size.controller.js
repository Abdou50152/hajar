const { validationResult } = require("express-validator");

const {
  createSize,
  getAllSizes,
  getSizeById,
  updateSize,
  deleteSizeById,
} = require("../../models/size/size.model");

const { getPagination } = require("../../config/query");

// Créer une taille
const httpCreateSize = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const size = req.body;
  try {
    const newSize = await createSize(size);
    return res.status(200).json(newSize);
  } catch (err) {
    next(err);
  }
};

// Récupérer toutes les tailles
const httpGetAllSizes = async (req, res, next) => {
  try {
    const { skip, limit } = getPagination(req.query);
    const list = await getAllSizes(skip, limit);
    return res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

// Récupérer une taille par ID
const httpGetSizeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sizeById = await getSizeById(id);
    return res.status(200).json(sizeById);
  } catch (err) {
    next(err);
  }
};

// Mettre à jour une taille
const httpUpdateSize = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const id = req.params.id;
    const newSize = { ...req.body, id };
    const updatedSize = await updateSize(newSize);
    return res.status(200).json(updatedSize);
  } catch (err) {
    next(err);
  }
};

// Supprimer une taille
const httpDeleteSizeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteSizeById(id);
    return res.status(201).json({ message: "Deleted successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  httpCreateSize,
  httpGetAllSizes,
  httpGetSizeById,
  httpUpdateSize,
  httpDeleteSizeById,
};
