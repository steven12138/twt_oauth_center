import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)

  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})


const validateJWT = (token, online = false) => {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      throw new Error('Invalid token format')
    }

    const payload = JSON.parse(atob(parts[1]))

    // Check if the token is expired
    if (payload.exp) {
      const currentTime = Math.floor(Date.now() / 1000)
      if (currentTime >= payload.exp) {
        return false
      }
    }

    if (online) {
      // Perform additional online checks if required
      // For example, you might want to verify the token against a database or an external service
    }

    return true
  } catch (err) {
    return false
  }
}


export const useTokenManager = defineStore('tokenManager', () => {
  const token = ref(null)
  const setToken = (newToken) => {
    token.value = newToken
    localStorage.setItem('token', newToken) // Save the token to localStorage
  }
  const getToken = () => {
    if(token.value==null){
      token.value = localStorage.getItem('token')
    }
    if (!validateJWT(token.value)) {
      token.value = null
    }
    return token.value
  }

  const login = (username, password) => {
    console.log(username)
    console.log(password)
  }

  return { token, setToken, getToken, login }
})