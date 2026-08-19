import { client } from "./helper";
// Fetch all rooms
export const fetchRooms = async (queryObject = {}) => {
    try {
        const query = new URLSearchParams()
        if (queryObject.status) {
            query.append("status", queryObject.status)
        }
        if (queryObject.limit) {
            query.append("limit", queryObject.limit)
        }

        const response = await client.get(`room-type?${query.toString()}`);
        return {
            success: response.data.success,
            data: response.data.rooms,
            message: response.data.message
        }

    } catch (error) {
        return {
            success: false,
            data: [],
            message: "Internal Server Error"
        }

    }
}

// Fetch room by ID
export const fetchRoomsById = async (id) => {
    try {
        const response = await client.get(`room-type/${id}`);

        return {
            success: response.data.success,
            data: response.data.rooms,
            message: response.data.message
        }

    } catch (error) {
        return {
            success: false,
            data: [],
            message: "Internal Server Error"
        }
    }
}

// Fetch all categories
export const fetchCategory = async (queryObject = {}) => {
    try {
        const query = new URLSearchParams();
        if (queryObject.status) {
            query.append("status", queryObject.status);
        }
        if (queryObject.limit) {
            query.append("limit", queryObject.limit);
        }
        const response = await client.get(`category?${query.toString()}`);
        return {
            success: response.data.success,
            data: response.data.categories,
            message: response.data.message
        }

    } catch (error) {
        return {
            success: false,
            data: [],
            message: "Internal Server Error"
        }
    }
}
// Fetch category by ID
export const fetchCategoryById = async (id) => {
    try {
        const response = await client.get(`category/${id}`);

        return {
            success: response.data.success,
            data: response.data.category,
            message: response.data.message
        }

    } catch (error) {
        return {
            success: false,
            data: [],
            message: "Internal Server Error"
        }
    }
}
// Fetch all colors
export const fetchColors = async (queryObject = {}) => {
    try {
        const query = new URLSearchParams();
        if (queryObject.status !== undefined) query.append("status", queryObject.status);
        if (queryObject.limit) query.append("limit", queryObject.limit);
        const response = await client.get(`color?${query.toString()}`);
        return {
            success: response.data.success,
            data: response.data.colors,
            message: response.data.message
        }
    } catch (error) {
        return { success: false, data: [], message: "Internal Server Error" }
    }
}
// Fetch all products
export const fetchProduct = async (queryObject = {}) => {
    try {
        const query = new URLSearchParams();

        if (queryObject.status) query.append("status", queryObject.status);
        if (queryObject.limit) query.append("limit", queryObject.limit);
        if (queryObject.featured) query.append("featured", queryObject.featured);
        if (queryObject.newArrival) query.append("newArrival", queryObject.newArrival);
        if (queryObject.bestSeller) query.append("bestSeller", queryObject.bestSeller);
        if (queryObject.stock !== undefined && queryObject.stock !== "")
            query.append("stock", queryObject.stock);

        if (queryObject.rooms) {
            query.append("rooms", queryObject.rooms);
        }
        if (queryObject.category) {
            query.append("category", queryObject.category);
        }
        if (queryObject.min && queryObject.max) {
            query.append("min", queryObject.min);
            query.append("max", queryObject.max);
        }
        if (queryObject.sort) {
            query.append("sort", queryObject.sort);
        }
        if (queryObject.color !== undefined && queryObject.color !== "") {
            query.append("color", queryObject.color);
        }
        if (queryObject.skip !== undefined) {
            query.append("skip", queryObject.skip);
        }
        if (queryObject.search) {
            query.append("search", queryObject.search);
        }

        const response = await client.get(`product?${query.toString()}`);

        return {
            success: response.data.success,
            data: response.data.products,
            meta: response.data.meta,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            data: [],
            message: "Internal Server Error"
        };
    }
};
// Fetch product by ID
export const fetchProductById = async (id) => {
    try {
        const response = await client.get(`product/${id}`);

        return {
            success: response.data.success,
            data: response.data.product,
            message: response.data.message
        }

    } catch (error) {
        return {
            success: false,
            data: [],
            message: "Internal Server Error"
        }
    }
}
// getProfile
export const getProfile = async () => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("jwt")?.value;
        const response = await client.get(`user/profile`, {
            headers: {
                Authorization: token
            }
        })
        return {
            success: response.data.success,
            data: response.data.user,
            message: response.data.message
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            data: [],
            message: "Internal Server Error"
        }
    }
}