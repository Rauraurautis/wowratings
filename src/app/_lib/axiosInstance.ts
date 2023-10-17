"use server"
import axios from "axios";

axios.interceptors.request.use(async (req) => {
    return req
})



export default axios