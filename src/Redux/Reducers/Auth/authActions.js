import { LOGIN_SUCCESS } from "./authReducers";
import { BASE_URL } from "./authReducers";
import axios  from "axios";

export const resturantLogin = (user, authCallback) => async dispatch => {
    try  {
        console.log(`im here in actions`)
      const config = {
        method: "POST",
        headers: {
          "content-type": "application/json"
        }
      };
       axios
        .post(`${BASE_URL}/resturants/authenticate`, user, config)
        .then(res => {
           dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
          });
          authCallback(res.data);
        })
        .catch(err => {
          console.log('error in API',err.response);
  
          dispatch(
            returnErrors(
              err.response.data.message,
              err.response.data.success,
              "LOGIN_FAIL"
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