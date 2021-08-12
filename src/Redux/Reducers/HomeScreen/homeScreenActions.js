import { GET_ORDERS } from "./homeScreenReducers";
import { BASE_URL } from "./homeScreenReducers";

import axios from "axios";

export const getOrders = (userid, token, authCallback) => async dispatch => {
    try  {
        // console.log(`im here in actions in getOrders`, userid, token)
        
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
        .get(`${BASE_URL}/orders/` + userid, config)
        .then(res => {
           dispatch({
            type: GET_ORDERS,
            payload: res.data
          });
          authCallback();
        })
        .catch(err => {
          console.log('Errors in catch', err);
        });
    }
    catch (e) {
  console.log(`API ERROR`, e)
    }
  };
  export const toCompleteOrder = (userid, token, order_status, authCallback) => async dispatch => {
    try  {
        // console.log(`im here in actions in getOrders`, userid, token)
        
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
        .get(`${BASE_URL}/orders/Update/` + userid, order_status, config)
        .then(res => {
           dispatch({
            type: TO_COMPLETE,
            payload: res.data
          });
          authCallback(res.data);
        })
        .catch(err => {
          console.log('Errors in catch', err);
        });
    }
    catch (e) {
  console.log(`API ERROR`, e)
    }
  };