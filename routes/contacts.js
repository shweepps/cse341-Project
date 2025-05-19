const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();
const { getDb } = require('../db/connection');

router.get('/', async (req, res) => {
  const db = getDb();
  const contacts = await db.collection('contacts').find().toArray();
  res.json(contacts);
});

router.get('/:id', async (req, res) => {
  const db = getDb();
  try {
    const contact = await db.collection('contacts').findOne({ _id: new ObjectId(req.params.id) });
    if (!contact) return res.status(404).send('Contact not found');
    res.json(contact);
  } catch {
    res.status(400).send('Invalid ID format');
  }
});

module.exports = router;
