import { ADD_TABLE } from "./addTableReducers";
import { BASE_URL } from "./addTableReducers";

import axios from "axios";

export const addnewTable = (params, authCallback) => async dispatch => {
    try  {
      console.log(`im here in actions in addTable`)
      const config = {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        Authorization:{
          "Bearer " :
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZjNhNzIyN2EyMGNiZDcwMWRkZjAwM2IiLCJpYXQiOjE1OTg1NTc3NTAsImV4cCI6MTU5OTE2MjU1MH0.sRXkENX7XZMsSZfarIiGng6VHR3Glc21gFeEP9673YY",}
      };
       axios
        .post(`${BASE_URL}/tables/register`, params, config)
        .then(res => {
           dispatch({
            type: ADD_TABLE,
            payload: res.data
          });
          authCallback(res.data);
        })
        .catch(err => {
          console.log('error in actions',err);
  
          dispatch(
            returnErrors(
              err.response.data.message,
              err.response.data.success,
              "addtable"
            )
          );
          setTimeout(() => dispatch(clearErrors()), 4000);
          dispatch({
            type: TABLE_FAIL
          });
        });
    }
    catch (e) {
  console.log(`API ERROR`, e)
    }
  };