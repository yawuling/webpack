import { REQUEST_HOST } from '../config'

const api = {
  home: {
    example: '/home/example'
  }
}

let setHost = (item) => {
  Object.keys(item).forEach(i => {
    if (typeof item[i] === 'object') {
      setHost(item[i])
    } else {
      item[i] = REQUEST_HOST + item[i]
    }
  })
}

setHost(api)

export default api