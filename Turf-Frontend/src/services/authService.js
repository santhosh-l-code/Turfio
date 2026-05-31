import axios from "axios"
import api from "./api"

const BASE_URL = "https://turfnation-backend-latest.onrender.com/api/auth"

export const loginUser = async (data) => {
    const res = await api.post(`${BASE_URL}/login`, data)
    return res.data  
}

export const registerUser = async (data) => {
    const res = await api.post(`${BASE_URL}/register`, data)
    return res.data
}