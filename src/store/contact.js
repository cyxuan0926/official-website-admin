import { deepCopy } from "@/common/helper";
import { contactsMutationTypes } from "./mutation-types";
import { getContacts, updateContact } from "@/services/api/contacts";

const state = {
  contacts: []
};

const mutations = {
  [contactsMutationTypes.SET_CONTACTS]: (state, contacts) => {
    state.contacts = contacts;
  }
};

const actions = {
  getContacts: async ({ commit }, query) => {
    try {
      const res = await getContacts(query);
      commit(contactsMutationTypes.SET_CONTACTS, res.data.data);
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  updateContact: async ({ state, commit }, { contact_id, data }) => {
    try {
      await updateContact(contact_id, data);

      const contacts = deepCopy(state.contacts);
      contacts.forEach(contact => {
        if (contact.contact_id === contact_id) {
          contact = Object.assign({}, contact, data);
        }
      });
      commit(contactsMutationTypes.SET_CONTACTS, contacts);

      return contacts;
    } catch (err) {
      throw err;
    }
  }
};

export default { namespaced: true, state, mutations, actions };
