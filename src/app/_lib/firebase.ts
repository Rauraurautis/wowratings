// Import the functions you need from the SDKs you need
import axios from "axios";
import { initializeApp } from "firebase/app";
import { child, get, getDatabase, ref, set } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDgsX23LZensgHYjr9vKSr0Ac878pPBv2Y",
    authDomain: "wowratings-b865e.firebaseapp.com",
    databaseURL: "https://wowratings-b865e-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "wowratings-b865e",
    storageBucket: "wowratings-b865e.appspot.com",
    messagingSenderId: "304215430902",
    appId: "1:304215430902:web:4a343d2f0a0c295b253ed7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getDatabase(app)

const reference = ref(db, "access_token/")

export const getAccessToken = async () => {
    try {
        const snapshot = await get(child(reference, "access_token/"))
        return snapshot.val()
    } catch (error) {
        console.error(error)
    }
}

// ---------------------- 

const clientId = process.env.CLIENT_ID ?? "7a41db7261474c0bab94bcf92e11fbef"
const clientSecret = process.env.CLIENT_SECRET ?? "RQmxJ565X7R8Tuwl4mY9f294K1G2yUQL"
const authString = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

const url = 'https://oauth.battle.net/token';
const data = 'grant_type=client_credentials';

export const setAccessToken = async () => {
    if (!clientId) return
    const reference = ref(db, "access_token/")
    try {
        const res = await axios.post(url, data, {
            headers: {
                'Authorization': `Basic ${authString}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        const access_token = { token: res.data.access_token, time: new Date().getTime() }
        set(reference, {
            access_token
        })
        return access_token

    } catch (error) {
        console.error(error)
    }



}