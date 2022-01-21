import Vuex from "vuex";
import Vue from "vue";

Vue.use(Vuex);
Vue.config.devtools = true;

export default new Vuex.Store({
  state: {
    media: {},
    accountInfo: {},
    permissions: [],
    mediaDirectory: [],
  },

  getters: {},

  mutations: {
    STORE_MEDIA: (state, item) => {
      state.media = item;
    },

    accountInfo: (state, item) => {
      state.accountInfo = item;
    },

    permissions: (state, item) => {
      state.permissions = item;
    },

    STORE_MEDIA_DIRECTORY: (state, item) => {
      state.mediaDirectory = item;
    },

    UPDATE_EMAIL: (state, item) => {
      state.accountInfo.email = item;
    },

    UPDATE_FIRST_NAME: (state, item) => {
      state.accountInfo.firstName = item;
    },

    UPDATE_LAST_NAME: (state, item) => {
      state.accountInfo.lastName = item;
    },
  },

  actions: {
    mediaSelected({ commit }, item) {
      commit("STORE_MEDIA", item);
    },

    storeAccountInfo({ commit }, item) {
      commit("accountInfo", item);
    },

    storePermission({ commit }, item) {
      commit("permissions", item);
    },

    storeMediaDirectory({ commit }, item) {
      commit("STORE_MEDIA_DIRECTORY", item);
    },

    updateEmail({commit}, item){
      commit("UPDATE_EMAIL", item)
    },

    updateFirstName({commit}, item){
      commit("UPDATE_FIRST_NAME", item)
    },

    updateLastName({commit}, item){
      console.log(item);
      commit("UPDATE_LAST_NAME", item)
    },
  },
});
