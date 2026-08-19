// SERVER ONLY — do not import in client components
import { client } from "./helper";
import { cookies } from "next/headers";

export const getProfile = async () => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("jwt")?.value;
        const response = await client.get(`user/profile`, {
            headers: {
                Authorization: token
            }
        });
        return {
            success: response.data.success,
            data: response.data.user,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            data: null,
            message: "Internal Server Error"
        };
    }
};
