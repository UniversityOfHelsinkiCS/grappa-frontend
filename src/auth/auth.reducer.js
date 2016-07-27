import { fromJS } from "immutable";
import {
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAILURE,
} from "./auth.actions";

import {
  USER_UPDATE_ONE_SUCCESS,
} from "../user/user.actions";

const INITIAL_STATE = fromJS({
  user: {},
  token: "",
});

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case LOGIN_USER_SUCCESS:
      return state.merge({
        user: action.payload.user,
        token: action.payload.token,
      });
    case LOGIN_USER_FAILURE:
      return state;
    case USER_UPDATE_ONE_SUCCESS:
      return state.updateIn(["user"], user => {
        if (user.get("id") === action.sent.id) {
          return fromJS(action.sent);
        }
        return user;
      });
    default:
      return state;
  }
}
