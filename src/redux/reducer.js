import { UPDATE_WORKOUT_PLAN, UPDATE_WORKOUT_DATA, UPDATE_WORKOUT_LIST } from './type';

const initialState = {
    workout_plan: "",
    workout_data: []
};
const workoutReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_WORKOUT_PLAN:
            return {
                ...state,
                workout_plan: action.payload
            };
        case UPDATE_WORKOUT_DATA:
            return {
                ...state,
                workout_data: action.payload
            };
        default:
            return state;
    }
}
export default workoutReducer;