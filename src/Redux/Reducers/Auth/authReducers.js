export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const BASE_URL = "https://restaurant.a-table.app";

const initialState = {
    BASE_URL: BASE_URL,
    userProfile: null,
}

export default function(state = initialState, action){
    try {
       switch (action.type) {
        case LOGIN_SUCCESS:
            return {
              ...state,
            userProfile: action.payload,
            }; 
            default:
        return state;
       } 
    } catch (error) {
        console.log(`Error in reducers`, error) 
    }
}