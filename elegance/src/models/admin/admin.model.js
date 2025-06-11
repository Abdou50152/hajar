const db = require("..");
const httpError = require("http-errors");

const Admin = db.admin;

// Créer un nouvel admin

const createAdmin = async (newAdmin) => {
  const existAdmin = await Admin.findOne({
    where: {
        
      email: newAdmin.email,
    },
  });

  if (existAdmin) {
    throw httpError.Conflict("Admin already exists with this email");
  } else {
    const admin = await Admin.create(newAdmin);
    return admin;
  }
};

// Récupérer tous les admins
const getAllAdmins = async (skip, limit) => {
  const adminPromise = Admin.findAll({
    offset: skip,
    limit: limit,
  });
  const countPromise = Admin.count();
  const [admins, count] = await Promise.all([adminPromise, countPromise]);
  return { count, admins };
};

// Récupérer un admin par ID
const getAdminById = async (id) => {
  const admin = await Admin.findOne({
    where: { id },
  });

  if (!admin) {
    throw httpError.NotFound("Admin not found");
  } else {
    return admin;
  }
};

// Mettre à jour un admin
const updateAdmin = async (newAdmin) => {
  const admin = await getAdminById(newAdmin.id);
  if (admin) {
    await Admin.update(newAdmin, {
      where: { id: newAdmin.id },
    });
    return newAdmin;
  } else {
    throw httpError.NotFound("Admin does not exist");
  }
};

// Supprimer un admin
const deleteAdminById = async (id) => {
  const adminExist = await Admin.findOne({ where: { id } });
  if (!adminExist) {
    throw httpError.NotFound("Admin does not exist");
  } else {
    await Admin.destroy({ where: { id } });
  }
};

module.exports = {
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdminById,
};
