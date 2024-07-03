import axios from "axios"
const url = process.env.REACT_APP_BACKEND_API_URL

export default axios.create({
    baseURL: url
})