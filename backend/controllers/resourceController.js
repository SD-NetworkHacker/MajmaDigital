
const asyncHandler = require('express-async-handler');
const LibraryResource = require('../models/LibraryResource');

const getResources = asyncHandler(async (req, res) => {
  const resources = await LibraryResource.find({}).sort({ title: 1 });
  res.json({ data: resources });
});

const createResource = asyncHandler(async (req, res) => {
  const resource = await LibraryResource.create(req.body);
  res.status(201).json(resource);
});

const deleteResource = asyncHandler(async (req, res) => {
  const resource = await LibraryResource.findById(req.params.id);
  if (resource) {
    await resource.deleteOne();
    res.json({ message: 'Ressource supprimée' });
  } else {
    res.status(404);
    throw new Error('Ressource non trouvée');
  }
});

module.exports = { getResources, createResource, deleteResource };
