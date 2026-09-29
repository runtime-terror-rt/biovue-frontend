import { baseApi } from '../features/api/baseApi'
import { projectionApi } from '../features/api/userDashboard/Projection/projectionApi'
import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit'
import { AiApi } from '../features/api/SupplierDashboard/AiApi'
import authReducer, { logout, setCredentials } from '../features/slice/authSlice'

const authListenerMiddleware = createListenerMiddleware();

// Reset all RTK Query API caches whenever user logs out
authListenerMiddleware.startListening({
  actionCreator: logout,
  effect: async (_action, listenerApi) => {
    listenerApi.dispatch(baseApi.util.resetApiState());
    listenerApi.dispatch(projectionApi.util.resetApiState());
    listenerApi.dispatch(AiApi.util.resetApiState());
  },
});

// Reset all RTK Query API caches whenever user logs in or switches credentials
authListenerMiddleware.startListening({
  actionCreator: setCredentials,
  effect: async (_action, listenerApi) => {
    listenerApi.dispatch(baseApi.util.resetApiState());
    listenerApi.dispatch(projectionApi.util.resetApiState());
    listenerApi.dispatch(AiApi.util.resetApiState());
  },
});

export const makeStore = () => {
  return configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      [projectionApi.reducerPath]: projectionApi.reducer,
      [AiApi.reducerPath]: AiApi.reducer,
      auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .prepend(authListenerMiddleware.middleware)
        .concat(baseApi.middleware, projectionApi.middleware, AiApi.middleware),
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']