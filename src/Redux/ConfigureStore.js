import { createStore, combineReducers, applyMiddleware } from "redux";
import reducers from "./index";
import thunk from "redux-thunk";
import { persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-community/async-storage";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  // whitelist: ["auth"]
};

const persistedReducer = persistReducer(persistConfig, reducers);

export default function configureStore() {
  return createStore(persistedReducer, applyMiddleware(thunk));
}
