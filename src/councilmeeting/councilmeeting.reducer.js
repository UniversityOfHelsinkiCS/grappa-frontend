/*
* The reducer to define the changes to the state in accordance to the actions passed to it
* in regard to adding or getting councilmeetings.
*/
import { fromJS } from "immutable";
import {
  COUNCILMEETING_GET_ALL_SUCCESS,
  COUNCILMEETING_GET_ALL_FAILURE,
  COUNCILMEETING_SAVE_ONE_SUCCESS,
  COUNCILMEETING_SAVE_ONE_FAILURE,
} from "./councilmeeting.actions";

/*
*Defines what the intial state is when no changes have yet been done to the state.
*/
const INITIAL_STATE = fromJS({
  councilmeetinglist: [],
});

/*
* The function that handles the different state changes depending on which case
* has been passed to it from councilmeeting.actions.
* @param state The state, which is INITIAL_STATE by default, but is modified in accordance
* to all the changes thus far.
* @param action One of the previously defined actions from councilmeeting.actions that defines
* which case is relevant.
* @return The new state created by the modification of the previous one.
*/
export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case COUNCILMEETING_SAVE_ONE_SUCCESS:
      return state.updateIn(["councilmeetinglist"], list => list.push(fromJS(action.payload)));
    case COUNCILMEETING_SAVE_ONE_FAILURE:
      return state;
    case COUNCILMEETING_GET_ALL_SUCCESS:
      return state.mergeIn(["councilmeetinglist"], fromJS(action.payload));
    case COUNCILMEETING_GET_ALL_FAILURE:
      return state;
    default:
      return state;
  }
}
