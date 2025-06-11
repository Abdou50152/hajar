const db = require("..");
const httpError = require("http-errors");

const Users = db.users;

// Créer un utilisateur
const createUser = async (newUser) => {
  const existUser = await Users.findOne({
    where: {
      email: newUser.email,
    },
  });

  if (existUser) {
    throw httpError.Conflict("User already exists with this email");
  } else {
    const user = await Users.create(newUser);
    return user;
  }
};

// Obtenir tous les utilisateurs
const getAllUsers = async (skip, limit) => {
  const usersPromise = Users.findAll({
    offset: skip,
    limit: limit,
  });
  const countPromise = Users.count();
  const [users, count] = await Promise.all([usersPromise, countPromise]);
  return { count, users };
};

// Obtenir un utilisateur par ID
const getUserById = async (id) => {
  const user = await Users.findOne({
    where: { id },
  });

  if (!user) {
    throw httpError.NotFound("User not found");
  } else {
    return user;
  }
};

// Mettre à jour un utilisateur
const updateUser = async (newUser) => {
  const user = await getUserById(newUser.id);
  if (user) {
    await Users.update(newUser, {
      where: { id: newUser.id },
    });
    return newUser;
  } else {
    throw httpError.NotFound("User does not exist");
  }
};

// Supprimer un utilisateur
const deleteUserById = async (id) => {
  const userExist = await Users.findOne({ where: { id } });
  if (!userExist) {
    throw httpError.NotFound("User does not exist");
  } else {
    await Users.destroy({ where: { id } });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUserById,
};
