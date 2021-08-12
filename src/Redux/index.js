import authReducer from "./Reducers/Auth/authReducers";
import addDishReducers from "./Reducers/Dishes/addDishReducers";
import pastordersHistoryReducers from "./Reducers/OrdersHistory/ordersHistoryReducers"
import editProfileReducers from "./Reducers/editProfile/editProfileReducers"
import newTable from "./Reducers/TablesManagment/addTableReducers"
import fetchOrders from "./Reducers/HomeScreen/homeScreenReducers"
import toComplete from "./Reducers/HomeScreen/homeScreenReducers"
import { combineReducers } from "redux";

const reducers = combineReducers({
  auth: authReducer,
  dish: addDishReducers,
  pastOrders: pastordersHistoryReducers,
  editProfile: editProfileReducers,
  registerTable: newTable,
  liveOrders: fetchOrders,
  toCompleteStatus: toComplete
});

export default reducers;
