import { ORDER_HISTORY } from "./ordersHistoryReducers";
import { BASE_URL } from "./ordersHistoryReducers";
import axios  from "axios";

export const getPastOrders = (userid, token, authCallback) => async dispatch => {
    try  {
        console.log(`im here in actions`)
      const config = {
        method: "GET",
        headers: {
          "content-type": "application/json"
        },
        Authorization:{
            "Bearer " :
            token
            }
      };
       axios
        .get(`${BASE_URL}/orders/getPastOrders/` + userid,  config)
        .then(res => {
           dispatch({
            type: ORDER_HISTORY,
            payload: res.data
          });
          authCallback(res.data);
        })
        .catch(err => {
          console.log('error in API',err);
  
          dispatch(
            returnErrors(
              err.response.data.message,
              err.response.data.success,
              "ORDER_HISTORY_FAIL"
            )
          );
          setTimeout(() => dispatch(clearErrors()), 4000);
          dispatch({
            type: ORDER_HISTORY
          });
        });
    }
    catch (e) {
  console.log(`API ERROR`, e)
    }
  };