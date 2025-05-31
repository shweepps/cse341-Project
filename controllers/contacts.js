const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();
const { getDb } = require('../db/connection');



const getAll = async (req, res) => {
  try {
    const db = getDb();
    const contacts = await db.collection('contacts').find().toArray();
    res.json(contacts);
  } catch (error) {
    console.error('Failed to fetch contacts:', error);
    res.status(500).json({ error: 'An error occurred while fetching contacts.' });
  }
};

const getSingle = ('/:id', async (req, res) => {
  const db = getDb();
  try {
    const contact = await db.collection('contacts').findOne({ _id: new ObjectId(req.params.id) });
    if (!contact) return res.status(404).send('Contact not found');
    res.json(contact);
  } catch {
    res.status(400).send('Invalid ID format');
  }
});

// POST a new contact
const createContact = async (req, res) => {
  try {
    const db = getDb();
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
      return res.status(400).json({
        error: 'firstName, lastName, email, favoriteColor, and birthday are required.',
      });
    }

    // Optional: Validate email format and date string
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(birthday);

    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format.' });
    }

    if (!isValidDate) {
      return res.status(400).json({ error: 'Birthday must be in YYYY-MM-DD format.' });
    }

    const newContact = { firstName, lastName, email, favoriteColor, birthday };

    const result = await db.collection('contacts').insertOne(newContact);

    res.status(201).json({
      _id: result.insertedId,
      ...newContact,
    });
  } catch (err) {
    console.error('Failed to create contact:', err);
    res.status(500).json({ error: 'An error occurred while creating the contact.' });
  }
};

// PUT (update) a contact

const updateContact = async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const updatedContact = {};
    if (firstName !== undefined) updatedContact.firstName = firstName;
    if (lastName !== undefined) updatedContact.lastName = lastName;
    if (email !== undefined) updatedContact.email = email;
    if (favoriteColor !== undefined) updatedContact.favoriteColor = favoriteColor;
    if (birthday !== undefined) updatedContact.birthday = birthday;

    if (Object.keys(updatedContact).length === 0) {
      return res.status(400).json({ error: 'No valid fields provided for update.' });
    }

    const result = await db.collection('contacts').updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedContact }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json({ message: 'Contact updated successfully' });
  } catch (err) {
    console.error('Failed to update contact:', err);
    res.status(500).json({ error: 'An error occurred while updating the contact.' });
  }
};


// DELETE a contact
const deleteContact = async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const result = await db.collection('contacts').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json({ message: 'Contact deleted successfully' });
  } catch (err) {
    console.error('Failed to delete contact:', err);
    res.status(500).json({ error: 'An error occurred while deleting the contact.' });
  }
};

module.exports = {
  getAll,
  getSingle,
  createContact,
  updateContact,
  deleteContact
};