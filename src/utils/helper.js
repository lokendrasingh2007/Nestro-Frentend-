import axios from "axios"

const client = axios.create({
    baseURL: process.env.NEXT_API_BASE_URL,
    timeout: 60000, // 60 seconds — image upload ke liye
    withCredentials: true
});


const generateSlug = (value) => {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")

}


export { client, generateSlug }