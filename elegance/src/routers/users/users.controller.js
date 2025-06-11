const { validationResult } = require("express-validator");

const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUserById,
} = require("../../models/users/users.model");

const { getPagination } = require("../../config/query");

// Créer un utilisateur
const httpCreateUsers = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const user = req.body;
  try {
    const newUser = await createUser(user);
    return res.status(200).json(newUser);
  } catch (err) {
    next(err);
  }
};

// Récupérer tous les utilisateurs
const httpGetAllUsers = async (req, res, next) => {
  try {
    const { skip, limit } = getPagination(req.query);
    const list = await getAllUsers(skip, limit);
    return res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

// Récupérer un utilisateur par ID
const httpGetUsersById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userById = await getUserById(id);
    return res.status(200).json(userById);
  } catch (err) {
    next(err);
  }
};

// Mettre à jour un utilisateur
const httpUpdateUsers = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const id = req.params.id;
    const newUser = { ...req.body, id };
    const updatedUser = await updateUser(newUser);
    return res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
};

// Supprimer un utilisateur
const httpDeleteUsersById = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteUserById(id);
    return res.status(201).json({ message: "Deleted successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  httpCreateUsers,
  httpGetAllUsers,
  httpUpdateUsers,
  httpGetUsersById,
  httpDeleteUsersById,
};
