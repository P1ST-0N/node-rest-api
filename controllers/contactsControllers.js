import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContactById,
} from "../services/contactsServices.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
import validateBody from "../helpers/validateBody.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  const { id } = req.params;

  try {
    const contact = await getContactById(id);
    if (contact) {
      res.status(200).json(contact);
    } else {
      throw HttpError(404, "Not found");
    }
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedContact = await removeContact(id);
    if (deletedContact) {
      res.status(200).json(deletedContact);
    } else {
      throw HttpError(404, "Not found");
    }
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    validateBody(createContactSchema)(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      const { name, email, phone } = req.body;
      const newContact = await addContact(name, email, phone);
      res.status(201).json(newContact);
    });
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;

  try {
    const unknownFields = Object.keys(req.body).filter(
      (key) => !Object.keys(updateContactSchema.describe().keys).includes(key)
    );
    if (unknownFields.length > 0) {
      return res
        .status(400)
        .json({ message: `Unknown field(s): ${unknownFields.join(", ")}` });
    }

    const { error } = updateContactSchema.validate({ name, email, phone });
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const updatedContact = await updateContactById(id, { name, email, phone });
    if (updatedContact) {
      return res.status(200).json(updatedContact);
    } else {
      throw HttpError(404, "Not found");
    }
  } catch (error) {
    next(error);
  }
};
