import Equipment from '../models/Equipment.js';

export const getAllEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findAll();
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEquipmentById = async (req, res) => {
  try {
    const eq = await Equipment.findByPk(req.params.id);
    if (!eq) {
      return res.status(404).json({ message: 'Equipment not found' });
    }
    res.json(eq);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createEquipment = async (req, res) => {
  try {
    const { name, type, serialNumber, location, projectId } = req.body;
    const equipment = await Equipment.create({
      name,
      type,
      serialNumber,
      location,
      projectId,
    });
    res.status(201).json(equipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEquipment = async (req, res) => {
  try {
    const eq = await Equipment.findByPk(req.params.id);
    if (!eq) {
      return res.status(404).json({ message: 'Equipment not found' });
    }
    await eq.update(req.body);
    res.json(eq);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteEquipment = async (req, res) => {
  try {
    const eq = await Equipment.findByPk(req.params.id);
    if (!eq) {
      return res.status(404).json({ message: 'Equipment not found' });
    }
    await eq.destroy();
    res.json({ message: 'Equipment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};