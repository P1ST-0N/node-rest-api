import { randomUUID } from "crypto";
import { fileURLToPath } from "url";
import { readFile, writeFile } from "fs/promises";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contactsPath = path.resolve(__dirname, "../db/contacts.json");

async function listContacts() {
  try {
    const data = await readFile(contactsPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

async function getContactById(contactId) {
  const contacts = await listContacts();
  return contacts.find((contact) => contact.id === contactId) || null;
}

async function removeContact(contactId) {
  const contacts = await listContacts(); // Додайте await тут
  const updatedContacts = contacts.filter(
    (contact) => contact.id !== contactId
  );
  await writeFile(contactsPath, JSON.stringify(updatedContacts, null, 2));
  const removedContact =
    contacts.find((contact) => contact.id === contactId) || null;
  return removedContact; // Виправлено removeContact на removedContact
}

async function addContact(name, email, phone) {
  const newContact = { id: randomUUID(), name, email, phone };
  const contacts = await listContacts();
  contacts.push(newContact);
  await writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
}

async function updateContacts(contactId, updatedFields) {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);

  if (index === -1) {
    return null; // Контакт не знайдено
  }

  const updatedContact = { ...contacts[index], ...updatedFields };
  contacts[index] = updatedContact;

  await writeFile(contactsPath, JSON.stringify(contacts, null, 2));

  return updatedContact;
}

export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContacts,
};
