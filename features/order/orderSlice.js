import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import request from '../../api/request'

export const getCurrentOrders = createAsyncThunk('order/getCurrentOrders', async (_, thunkAPI) => {
    const state = thunkAPI.getState()
    try {
        const { orders } = await request.get('/order/today', {
            headers: { token: `Bearer ${state.token}` }
        })
        return orders
    } catch (err) { console.error(err) }
})

export const getPastOrders = createAsyncThunk('order/getPastOrders', async (_, thunkAPI) => {
    const state = thunkAPI.getState()
    try {
        const { orders } = await request.get('/order', {
            headers: { token: `Bearer ${state.token}` }
        })
        return orders
    } catch (err) { console.error(err) }
})

export const orderSlice = createSlice({
    name: 'order',
    initialState: {
        currentOrders: [],
        pastOrders: [],
        isLoading: false
    },
    reducers: {
        setCurrentOrders: (state, { payload }) => {
            console.log(payload.orders.length)
            state.currentOrders = payload.orders
            state.isLoading = payload.loading
        },
        setPastOrders: (state, { payload }) => {
            state.pastOrders = payload.orders
            state.isLoading = payload.loading
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(getCurrentOrders.pending, (state) => {
            state.isLoading = true
        })
        .addCase(getCurrentOrders.fulfilled, (state, action) => {
            state.currentOrders = action.payload
            state.isLoading = false
        })
        .addCase(getCurrentOrders.rejected, (state) => {
            state.isLoading = false
        })
        .addCase(getPastOrders.pending, (state) => {
            state.isLoading = true
        })
        .addCase(getPastOrders.fulfilled, (state, action) => {
            state.pastOrders = action.payload
            state.isLoading = false
        })
        .addCase(getPastOrders.rejected, (state) => {
            state.isLoading = false
        })
    }
})

export const { setCurrentOrders, setPastOrders } = orderSlice.actions
export default orderSlice.reducer