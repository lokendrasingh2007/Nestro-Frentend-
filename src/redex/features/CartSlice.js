import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    items: [],
    original_total: 0,
    final_total: 0
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, { payload }) => {
            const existingItem = state.items.find(item => item.id == payload.id);
            const salePrice = Number(payload.salePrice) || 0;
            const originalPrice = Number(payload.originalPrice) || 0;
            
            console.log("Adding to cart:", { payload, salePrice, originalPrice });
            
            if (existingItem) {
                existingItem.qty += 1;
                state.final_total += salePrice;
                state.original_total += originalPrice;
            } else {
                // Spread all payload but ensure prices are numbers
                const newItem = {
                    ...payload,
                    qty: 1,
                    salePrice,
                    originalPrice
                };
                state.items.push(newItem);
                state.final_total += salePrice;
                state.original_total += originalPrice;
            }
            localStorage.setItem("cart", JSON.stringify(state));
        },

        removeFromCart: (state, { payload }) => {
            const removeItem = state.items.find(item => item.id == payload.id);
            if (removeItem) {
                state.original_total -= Number(removeItem.originalPrice) * removeItem.qty;
                state.final_total -= Number(removeItem.salePrice) * removeItem.qty;
            }
            state.items = state.items.filter(item => item.id !== payload.id);
            localStorage.setItem("cart", JSON.stringify(state));
        },

        emptyCart: (state) => {
            state.items = [];
            state.final_total = 0;
            state.original_total = 0;
            localStorage.removeItem("cart");
        },

        increaseQuantity: (state, { payload }) => {
            const cartItem = state.items.find(item => item.id == payload.id);
            if (!cartItem) return;
            cartItem.qty += 1;
            state.original_total += Number(cartItem.originalPrice) || 0;
            state.final_total += Number(cartItem.salePrice) || 0;
            localStorage.setItem("cart", JSON.stringify(state));
        },

        decreaseQuantity: (state, { payload }) => {
            const cartItem = state.items.find(item => item.id == payload.id);
            if (!cartItem) return;

            if (cartItem.qty > 1) {
                cartItem.qty -= 1;
                state.original_total -= Number(cartItem.originalPrice) || 0;
                state.final_total -= Number(cartItem.salePrice) || 0;
            } else {
                state.original_total -= Number(cartItem.originalPrice) || 0;
                state.final_total -= Number(cartItem.salePrice) || 0;
                state.items = state.items.filter(item => item.id !== payload.id);
            }
            localStorage.setItem("cart", JSON.stringify(state));
        },

        lsToCart: (state) => {
            try {
                const cart = JSON.parse(localStorage.getItem("cart"));
                console.log("Loading cart from localStorage:", cart);
                if (cart && cart.items && Array.isArray(cart.items) && cart.items.length > 0) {
                    state.items = cart.items.map((item, idx) => ({
                        ...item,
                        id: item.id || `item-${idx}-${Date.now()}`,
                        salePrice: Number(item.salePrice) || 0,
                        originalPrice: Number(item.originalPrice) || 0,
                        qty: Number(item.qty) || 1
                    }));
                    // Recalculate totals based on items
                    state.final_total = state.items.reduce(
                        (sum, item) => sum + ((Number(item.salePrice) || 0) * (Number(item.qty) || 1)),
                        0
                    );
                    state.original_total = state.items.reduce(
                        (sum, item) => sum + ((Number(item.originalPrice) || 0) * (Number(item.qty) || 1)),
                        0
                    );
                    console.log("Cart loaded successfully:", { items: state.items, final_total: state.final_total });
                }
            } catch (error) {
                console.error("Error loading cart from localStorage:", error);
            }
        },

        cartTotal: (state) => {
            state.final_total = state.items.reduce(
                (sum, item) => sum + (Number(item.salePrice) || 0) * (item.qty || 0),
                0
            );
            state.original_total = state.items.reduce(
                (sum, item) => sum + (Number(item.originalPrice) || 0) * (item.qty || 0),
                0
            );
        }
    },
})

export const { addToCart, removeFromCart, emptyCart, increaseQuantity, decreaseQuantity, lsToCart, cartTotal } = cartSlice.actions

export default cartSlice.reducer
