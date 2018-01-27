{{#if_eq requestNpm "axios"}}
import axios from 'axios'
{{/if_eq}}
{{#if_eq requestNpm "jsonp"}}
import fetchJsonp from 'fetch-jsonp'
{{/if_eq}}
{{#if_eq requestNpm "two"}}
import axios from 'axios'
{{/if_eq}}
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
      return axios.get(api.home.example).then(res => {
        if (res.data.code === REQUEST_SUCCESS) {
          commit('setMsg', {
            msg: res.data.data
          })
        }
      })
      {{/if_eq}}
      {{#if_eq requestNpm "two"}}
      return axios.get(api.home.example).then(res => {
        if (res.data.code === REQUEST_SUCCESS) {
          commit('setMsg', {
            msg: res.data.data
          })
        }
      })
      {{/if_eq}}
      {{#if_eq requestNpm "jsonp"}}
      return fetchJsonp(api.home.example).then(res => {
        return res.json()
      }).then(res => {
        if (res.code === REQUEST_SUCCESS) {
          commit('setMsg', {
            msg: res.data
          })
        }
      })
      {{/if_eq}}
    }
  }
}