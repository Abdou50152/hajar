const db = require("..");
const httpError = require("http-errors");

const Size = db.size;

// Créer une nouvelle taille
const createSize = async (newSize) => {
  const existSize = await Size.findOne({
    where: {
      name: newSize.name,
    },
  });

  if (existSize) {
    throw httpError.Conflict("Size already exists with this name");
  } else {
    const size = await Size.create(newSize);
    return size;
  }
};

// Récupérer toutes les tailles
const getAllSizes = async (skip, limit) => {
  const sizePromise = Size.findAll({
    offset: skip,
    limit: limit,
  });
  const countPromise = Size.count();
  const [sizes, count] = await Promise.all([sizePromise, countPromise]);
  return { count, sizes };
};

// Récupérer une taille par ID
const getSizeById = async (id) => {
  const size = await Size.findOne({
    where: { id },
  });

  if (!size) {
    throw httpError.NotFound("Size not found");
  } else {
    return size;
  }
};

// Mettre à jour une taille
const updateSize = async (newSize) => {
  const size = await getSizeById(newSize.id);
  if (size) {
    await Size.update(newSize, {
      where: { id: newSize.id },
    });
    return newSize;
  } else {
    throw httpError.NotFound("Size does not exist");
  }
};

// Supprimer une taille
const deleteSizeById = async (id) => {
  const sizeExist = await Size.findOne({ where: { id } });
  if (!sizeExist) {
    throw httpError.NotFound("Size does not exist");
  } else {
    await Size.destroy({ where: { id } });
  }
};

module.exports = {
  createSize,
  getAllSizes,
  getSizeById,
  updateSize,
  deleteSizeById,
};
