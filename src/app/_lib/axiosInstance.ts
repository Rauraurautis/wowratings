
import axios from "axios";
import { getAccessToken, setAccessToken } from "./firebase";

const instance = axios.create()

let token = { token: null, time: 0 }

instance.interceptors.request.use(async (req) => {
    if (req.method === "POST" || req.method === "post") {
        if (token.token === null) {
            token = await getAccessToken()
        } else {
            const { time } = await getAccessToken()
            const timeNow = new Date().getTime()
            const timeDifference = timeNow - time
            if (timeDifference >= 86400000) {
                const accessToken = await setAccessToken()
                if (accessToken) token = accessToken
            }
        }

    }

    return req
})



export default instance