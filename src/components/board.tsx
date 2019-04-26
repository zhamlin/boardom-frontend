import * as React from "react";
import Lists from "./lists";
import { MemoizedPropsState } from "./types";

import { connect } from "react-redux";
import { State } from "../stores";
import { updateBoardName } from "../stores/lists/actions";
import { getBoardNameInstance } from "../stores/lists/selectors";

export interface LocalProps {
  id: string;
}

export interface StateProps {
  name: string;
}

export interface DispatchProps {
  updateBoardName: (name: string, id: string) => void;
}

export type Props = LocalProps & StateProps & DispatchProps;

export const Board: React.FC<Props> = ({ id, name, updateBoardName }) => {
  const [editingName, setEditingHidden] = React.useState<boolean>(false);
  const handleClick = () => setEditingHidden(!editingName);
  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) =>
    event.target.select();
  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    updateBoardName(event.target.value, id);
    setEditingHidden(false);
  };

  const [newName, setNewName] = React.useState<string>(name);
  function handleInputChange(event: React.FormEvent<HTMLInputElement>) {
    setNewName(event.currentTarget.value);
  }
  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key == "Enter") {
      updateBoardName(event.currentTarget.value, id);
      setEditingHidden(false);
    }
  }
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
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleInputChange}
            value={newName}
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
  const getBoardName = getBoardNameInstance();
  return (state, props) => {
    return {
      name: getBoardName(state, props.id)
    };
  };
};

const mapDispatchToProps: DispatchProps = {
  updateBoardName: (name: string, id: string) => updateBoardName({ id, name })
};

export default connect(
  makeMapState,
  mapDispatchToProps
)(Board);
