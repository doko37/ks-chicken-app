import { createSlice } from "@reduxjs/toolkit"

export const appSlice = createSlice({
    name: 'app',
    initialState: {
        token: null,
        homeScreen: "current"
    },
    reducers: {
        setToken: (state, { payload }) => {
            state.token = payload.token
        },
        setHomeScreen: (state, { payload }) => {
            state.homeScreen = payload.homeScreen
        }
    }
})

export const { setToken, setHomeScreen } = appSlice.actions
export default appSlice.reducer