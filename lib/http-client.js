const axios = require('axios')

const httpClient = axios.create({
    baseURL: 'https://greengarden2023.azurewebsites.net'
})

httpClient.interceptors.response.use((res) => {
    return res.data
})

module.exports = httpClient