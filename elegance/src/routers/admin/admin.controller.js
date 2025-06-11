const { validationResult } = require("express-validator");

const {
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdminById,
} = require("../../models/admin/admin.model");

const { getPagination } = require("../../config/query");

// Créer un admin
const httpCreateAdmin = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const admin = req.body;
  try {
    const newAdmin = await createAdmin(admin);
    return res.status(200).json(newAdmin);
  } catch (err) {
    next(err);
  }
};

// Récupérer tous les admins
const httpGetAllAdmins = async (req, res, next) => {
  try {
    const { skip, limit } = getPagination(req.query);
    const list = await getAllAdmins(skip, limit);
    return res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

// Récupérer un admin par ID
const httpGetAdminById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const adminById = await getAdminById(id);
    return res.status(200).json(adminById);
  } catch (err) {
    next(err);
  }
};

// Mettre à jour un admin
const httpUpdateAdmin = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const id = req.params.id;
    const newAdmin = { ...req.body, id };
    const updatedAdmin = await updateAdmin(newAdmin);
    return res.status(200).json(updatedAdmin);
  } catch (err) {
    next(err);
  }
};

// Supprimer un admin
const httpDeleteAdminById = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteAdminById(id);
    return res.status(201).json({ message: "Deleted successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  httpCreateAdmin,
  httpGetAllAdmins,
  httpGetAdminById,
  httpUpdateAdmin,
  httpDeleteAdminById,
};
