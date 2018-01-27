import axios from 'axios'
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
      return axios.get(api.home.example).then(res => {
        if (res.data.code === REQUEST_SUCCESS) {
          commit('setMsg', {
            msg: res.data.data
          })
        }
      })
    }
  }
}