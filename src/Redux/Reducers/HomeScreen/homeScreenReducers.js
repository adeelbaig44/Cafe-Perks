export const GET_ORDERS = "GET_ORDERS";
export const TO_COMPLETE = "TO_COMPLETE";

export const BASE_URL = "https://restaurant.a-table.app";

const initialState = {
    getorder: null,
    toComplete: null
}

export default function(state = initialState, action){
    try {
       switch (action.type) {
        case GET_ORDERS:
        return {
          ...state,
          getorder: action.payload,
        };
        case TO_COMPLETE:
        return {
          ...state,
          toComplete: action.payload
        };
            default:
        return state;
       } 
    } catch (error) {
        console.log(`Error in reducers`, error) 
    }
}