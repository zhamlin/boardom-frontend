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
  updateBoardNameAction: (name: string, id: string) => void;
}

export type Props = LocalProps & StateProps & DispatchProps;

export const Board: React.FC<Props> = ({ id, name, updateBoardNameAction }) => {
  const [editingName, setEditingHidden] = React.useState<boolean>(false);
  const [newName, setNewName] = React.useState<string>(name);

  const handleClick = () => setEditingHidden(!editingName);
  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) =>
    event.target.select();

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (event.target.value === "") {
      setNewName(name);
      setEditingHidden(false);
      return;
    }
    updateBoardNameAction(event.target.value, id);
    setEditingHidden(false);
  };

  const handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
    setNewName(event.currentTarget.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.currentTarget.value === "" && event.key === "Enter") {
      setNewName(name);
      setEditingHidden(false);
      return;
    } else if (event.key === "Enter" && event.currentTarget.value !== "") {
      updateBoardNameAction(event.currentTarget.value, id);
      setEditingHidden(false);
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
  updateBoardNameAction: (name: string, id: string) =>
    updateBoardName({ id, name })
};

export default connect(
  makeMapState,
  mapDispatchToProps
)(Board);
