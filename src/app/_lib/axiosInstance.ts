"use server"
import axios from "axios";

axios.interceptors.request.use(async (req) => {
    console.log("hi")
    process.env.TEST = "dasdsadasdasd"
    return req
})



export default axios