import * as React from "react";
import Lists from "./lists";
import { MemoizedPropsState } from "./types";

import { connect } from "react-redux";
import { State } from "stores";
import { updateBoard } from "stores/lists/actions";
import { getBoardNameInstance } from "stores/lists/selectors";

export interface LocalProps {
  id: string;
}

export interface StateProps {
  name: string;
}

export interface DispatchProps {
  updateBoardAction: (name: string, id: string) => void;
}

export type Props = LocalProps & StateProps & DispatchProps;

const isDoneKey = (key: string) => key === "Enter" || key === "Escape";

export const Board: React.FC<Props> = ({ id, name, updateBoardAction }) => {
  const [editingName, setEditingHidden] = React.useState<boolean>(false);
  const [newName, setNewName] = React.useState<string>(name);

  const handleClick = () => setEditingHidden(!editingName);
  const handleFocus = (i: React.FocusEvent<HTMLInputElement>) => {
    i.currentTarget.select();
  };

  const updateName = (value: string) => {
    if (value !== "" && value !== name) {
      updateBoardAction(value, id);
      setNewName(value);
    }
    if (value === "") {
      setNewName(name);
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setEditingHidden(false);
    updateName(event.currentTarget.value);
  };

  const handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
    setNewName(event.currentTarget.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    if (isDoneKey(event.key)) {
      setEditingHidden(false);
      updateName(value);
    }
  };

  return (
    <>
      <nav className="navbar is-dark">
        {!editingName && (
          <h3 onClick={handleClick} className="title has-text-white">
            {name}
          </h3>
        )}
        {editingName && (
          <input
            autoFocus={true}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleInputChange}
            defaultValue={name}
            className="title"
            size={newName.length}
          />
        )}
      </nav>
      <Lists boardID={id} />
    </>
  );
};

const makeMapState: MemoizedPropsState<State, LocalProps, StateProps> = () => {
  const namer = getBoardNameInstance();
  return (state, props) => {
    return {
      name: namer(state, props.id)
    };
  };
};

const mapDispatchToProps: DispatchProps = {
  updateBoardAction: (name: string, id: string) => updateBoard({ id, name })
};

export default connect(
  makeMapState,
  mapDispatchToProps
)(Board);
