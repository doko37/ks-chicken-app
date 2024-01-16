import { configureStore } from '@reduxjs/toolkit'
import appReducer from './features/app/appSlice'
import orderReducer from './features/order/orderSlice'

export default configureStore({
  reducer: {
    app: appReducer,
    order: orderReducer
  },
})