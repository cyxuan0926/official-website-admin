import { get, post, put, _delete } from "../request";

export function getContacts(query) {
  const defaultParams = {
    page_num: 1,
    page_size: 10
  };

  return get("/contacts", Object.assign({}, defaultParams, query));
}

export function createContact(contact) {
  return post("/contacts", contact);
}

export function updateContact(contact_id, contact) {
  return put(`/contacts/${contact_id}`, contact);
}

export function deleteContact(contact_id) {
  return _delete(`/contacts/${contact_id}`);
}
