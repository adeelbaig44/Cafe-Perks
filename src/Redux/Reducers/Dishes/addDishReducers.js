export const ADD_DISH = "ADD_DISH";

export const BASE_URL = "https://restaurant.a-table.app";

const initialState = {
    dishSuccess: null,
}

export default function(state = initialState, action){
    try {
       switch (action.type) {
        case ADD_DISH:
        return {
          ...state,
        dishSuccess: action.payload,
        };
            default:
        return state;
       } 
    } catch (error) {
        console.log(`Error in reducers`, error) 
    }
}