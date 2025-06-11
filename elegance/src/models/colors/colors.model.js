const db = require("..");
const httpError = require("http-errors");

const Color = db.colors;

// Créer une nouvelle couleur
const createColor = async (newColor) => {
  const existColor = await Color.findOne({
    where: {
      name: newColor.name,
    },
  });

  if (existColor) {
    throw httpError.Conflict("Color already exists with this name");
  } else {
    const color = await Color.create(newColor);
    return color;
  }
};

// Récupérer toutes les couleurs
const getAllColors = async (skip, limit) => {
  const colorPromise = Color.findAll({
    offset: skip,
    limit: limit,
  });
  const countPromise = Color.count();
  const [colors, count] = await Promise.all([colorPromise, countPromise]);
  return { count, colors };
};

// Récupérer une couleur par ID
const getColorById = async (id) => {
  const color = await Color.findOne({
    where: { id },
  });

  if (!color) {
    throw httpError.NotFound("Color not found");
  } else {
    return color;
  }
};

// Mettre à jour une couleur
const updateColor = async (newColor) => {
  const color = await getColorById(newColor.id);
  if (color) {
    await Color.update(newColor, {
      where: { id: newColor.id },
    });
    return newColor;
  } else {
    throw httpError.NotFound("Color does not exist");
  }
};

// Supprimer une couleur
const deleteColorById = async (id) => {
  const colorExist = await Color.findOne({ where: { id } });
  if (!colorExist) {
    throw httpError.NotFound("Color does not exist");
  } else {
    await Color.destroy({ where: { id } });
  }
};

module.exports = {
  createColor,
  getAllColors,
  getColorById,
  updateColor,
  deleteColorById,
};
