import { ADD_DISH } from "./addDishReducers";
import { BASE_URL } from "./addDishReducers";
import axios  from "axios";

export const dishRegister = (formdata, authCallback) => async dispatch => {
    try  {
      console.log(`im here in actions in add dish`)
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
        .post(`${BASE_URL}/dishs/register`, formdata, config)
        .then(res => {
           dispatch({
            type: ADD_DISH,
            payload: res.data
          });
          authCallback(res.data);
        })
        .catch(err => {
          console.log(err.response);
  
          dispatch(
            returnErrors(
              err.response.data.message,
              err.response.data.success,
              "dishRegister"
            )
          );
          setTimeout(() => dispatch(clearErrors()), 4000);
          dispatch({
            type: LOGIN_FAIL
          });
        });
    }
    catch (e) {
  console.log(`API ERROR`, e)
    }
  };