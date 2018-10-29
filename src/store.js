import { createStore, combineReducers } from "redux";
import undoable from "redux-undo";

const UPDATE_RECTANGLE = "UPDATE_RECTANGLE";

export const updateRectangle = marker => ({
  type: UPDATE_RECTANGLE,
  value: marker,
});

const INITIAL_STATE = [];
const rectangles = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_RECTANGLE:
      return action.value;
    default:
      return state;
  }
};

export default createStore(
  combineReducers({
    rectangles: undoable(rectangles),
  }),
);
