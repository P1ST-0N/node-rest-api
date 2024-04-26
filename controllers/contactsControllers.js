import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContacts,
} from "../services/contactsServices.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
import validateBody from "../helpers/validateBody.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getOneContact = async (req, res) => {
  const { id } = req.params;

  try {
    const contact = await getContactById(id);
    if (contact) {
      res.status(200).json(contact);
    } else {
      // res.status(404).json({ message: "Not found" });
      throw HttpError(404, "Not found");
    }
  } catch (error) {
    // console.error(error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedContact = await removeContact(id);
    if (deletedContact) {
      res.status(200).json(deletedContact);
    } else {
      // res.status(404).json({ message: "Not found" });
      throw HttpError(404, "Not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

export const createContact = async (req, res) => {
  const { name, email, phone } = req.body;

  try {
    // Валідація вхідних даних
    validateBody(createContactSchema)(req, res, async () => {
      const { name, email, phone } = req.body;
    });
    // const { error } = createContactSchema.validate({ name, email, phone });
    // if (error) {
    //   return res.status(400).json({ message: error.message });
    // }

    // Додавання контакту
    const newContact = await addContact(name, email, phone);
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateContact = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;

  try {
    // Перевірка, чи передано хоча б одне поле для оновлення
    // if (!name && !email && !phone) {
    //   return res
    //     .status(400)
    //     .json({ message: "Body must have at least one field" });
    // }

    // Валідація вхідних даних
    validateBody(updateContactSchema)(req, res, async () => {
      if (!name && !email && !phone) {
        throw HttpError(400, "Body must have at least one field");
      }
    });
    // const { error } = updateContactSchema.validate({ name, email, phone });
    // if (error) {
    //   return res.status(400).json({ message: error.message });
    // }

    // Оновлення контакту
    const updatedContact = await updateContacts(id, { name, email, phone });
    if (updatedContact) {
      return res.status(200).json(updatedContact);
    } else {
      // return res.status(400).json({ message: "Not found" });
      throw HttpError(404, "Not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};
