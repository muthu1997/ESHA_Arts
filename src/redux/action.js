import { UPDATE_WORKOUT_PLAN, UPDATE_WORKOUT_DATA, UPDATE_WORKOUT_LIST } from './type';

export function updateWorkoutPlan(data) {
    return {
        type: UPDATE_WORKOUT_PLAN,
        payload: data
    }
}

export function updateWorkoutData(data) {
    return {
        type: UPDATE_WORKOUT_DATA,
        payload: data
    }
}