export const ORDER_HISTORY = "ORDER_HISTORY";
export const BASE_URL = "https://restaurant.a-table.app";

const initialState = {
    BASE_URL: BASE_URL,
    pastOrders: null,
}

export default function(state = initialState, action){
    try {
       switch (action.type) {
        case ORDER_HISTORY:
            return {
              ...state,
              pastOrders: action.payload,
            }; 
            default:
        return state;
       } 
    } catch (error) {
        console.log(`Error in reducers`, error) 
    }
}