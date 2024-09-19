import { configureStore } from "@reduxjs/toolkit";
import adminName from "./AdminName/adminSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persitConfig = {
  key: "adminName",
  storage,
};

const persistedAdminNameReducer = persistReducer(persitConfig, adminName);
const store = configureStore({
  reducer: {
    admin: persistedAdminNameReducer,
  },
});

const persistor = persistStore(store);
export { store, persistor };
