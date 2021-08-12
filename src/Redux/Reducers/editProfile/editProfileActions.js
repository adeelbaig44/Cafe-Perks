import { EDIT_PROFILE } from "./editProfileReducers";
import { BASE_URL } from "./editProfileReducers";

import axios from "axios";

export const editprofile = (formdata, authCallback) => async dispatch => {
    try  {
      console.log(`im here in actions in editprofile`, formdata)
      const config = {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
      };
       axios
        .post(`${BASE_URL}/resturants/` + `610232397458a81d4d5ac611` , formdata, config)
        .then(res => {
           dispatch({
            type: EDIT_PROFILE,
            payload: res.data
          });
          authCallback(res.data);
        })
        .catch(err => {
          console.log('errrrr',err.response);
  
          dispatch(
            returnErrors(
              err.response.data.message,
              err.response.data.success,
              "edit profile"
            )
          );
          setTimeout(() => dispatch(clearErrors()), 4000);
          dispatch({
            type: EDIT_FAIL
          });
        });
    }
    catch (e) {
  console.log(`API ERROR`, e)
    }
  };