import Vue from 'vue'
import api from '../../api'

const REQUEST_SUCCESS = 1

export default {
  namespaced: true,
  state: {
    msg: {}
  },
  mutations: {
    setMsg(state, payload) {
      state.msg = payload.msg
    }
  },
  actions: {
    getMsg({ commit, state }) {
      {{#if_eq requestNpm "axios"}}
      return Vue.$http.get(api.home.example).then(res => {
        if (res.data.code === REQUEST_SUCCESS) {
          commit('setMsg', {
            msg: res.data.data
          })
        }
      })
      {{/if_eq}}
      {{#if_eq requestNpm "two"}}
      return Vue.$http.get(api.home.example).then(res => {
        if (res.data.code === REQUEST_SUCCESS) {
          commit('setMsg', {
            msg: res.data.data
          })
        }
      })
      {{/if_eq}}
      {{#if_eq requestNpm "jsonp"}}
      return Vue.$http.jsonp(api.home.example).then(res => {
        if (res.data.code === REQUEST_SUCCESS) {
          commit('setMsg', {
            msg: res.data.data
          })
        }
      })
      {{/if_eq}}
    }
  }
}