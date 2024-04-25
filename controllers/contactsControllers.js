import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
} from "../services/contactsServices.js";

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getOneContact = (req, res) => {
  //   try {
  //     const oneContact = getContactById(id);
  //   } catch (error) {}
};

export const deleteContact = (req, res) => {};

export const createContact = (req, res) => {};

export const updateContact = (req, res) => {};
