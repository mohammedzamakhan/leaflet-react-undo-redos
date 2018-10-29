import React from "react";
import { connect } from "react-redux";
import { ActionCreators } from "redux-undo";

const UndoRedo = ({ dispatch, onRedo, onUndo, isUndoable, isRedoable }) => {
  return (
    <div
      style={{
        position: "absolute",
        zIndex: 1000,
        bottom: 0,
      }}
    >
    {console.log(isUndoable, isRedoable)}
      <button disabled={!isUndoable} onClick={onUndo}>
        Undo
      </button>
      <button disabled={!isRedoable} onClick={onRedo}>
        Redo
      </button>
    </div>
  );
};

export default connect()(UndoRedo);
