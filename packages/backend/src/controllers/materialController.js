import Material from '../models/Material.js';

export const getAllMaterials = async (req, res) => {
  try {
    const materials = await Material.findAll();
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMaterialById = async (req, res) => {
  try {
    const material = await Material.findByPk(req.params.id);
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }
    res.json(material);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createMaterial = async (req, res) => {
  try {
    const { name, category, quantity, unit, unitPrice, supplier, projectId } = req.body;
    const material = await Material.create({
      name,
      category,
      quantity,
      unit,
      unitPrice,
      supplier,
      projectId,
    });
    res.status(201).json(material);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateMaterial = async (req, res) => {
  try {
    const material = await Material.findByPk(req.params.id);
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }
    await material.update(req.body);
    res.json(material);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findByPk(req.params.id);
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }
    await material.destroy();
    res.json({ message: 'Material deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};