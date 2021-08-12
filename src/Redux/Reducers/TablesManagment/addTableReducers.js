export const ADD_TABLE = "ADD_TABLE";

export const BASE_URL = "https://restaurant.a-table.app";

const initialState = {
    addTable: null,
}

export default function(state = initialState, action){
    try {
       switch (action.type) {
        case ADD_TABLE:
        return {
          ...state,
          addTable: action.payload,
        };
            default:
        return state;
       } 
    } catch (error) {
        console.log(`Error in reducers`, error) 
    }
}