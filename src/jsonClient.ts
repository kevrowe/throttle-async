import axios from 'axios'

const BASE_URL = 'https://jsonplaceholder.typicode.com'

export const getComment = (id: number) => {
  return axios.get(`${BASE_URL}/comments/${id}`)
}