export const EDIT_PROFILE = "EDIT_PROFILE";

export const BASE_URL = "https://restaurant.a-table.app";

const initialState = {
    editProfile: null,
}

export default function(state = initialState, action){
    try {
       switch (action.type) {
        case EDIT_PROFILE:
        return {
          ...state,
          editProfile: action.payload,
        };
            default:
        return state;
       } 
    } catch (error) {
        console.log(`Error in reducers`, error) 
    }
}