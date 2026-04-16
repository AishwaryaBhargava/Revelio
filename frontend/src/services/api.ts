import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.request.use((config) => {
  const apiKey = localStorage.getItem('groq_api_key')
  if (apiKey) {
    config.headers['X-Groq-API-Key'] = apiKey
  }
  return config
})

export default api