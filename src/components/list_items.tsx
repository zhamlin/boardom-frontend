import * as React from "react";
import { Draggable } from "react-beautiful-dnd";
import { MemoizedPropsState } from "./types";

import { connect } from "react-redux";
import { State } from "stores";
import { getCardNameInstance } from "stores/lists/selectors";

export interface LocalProps {
  id: string;
  position: number;
}

export interface StateProps {
  name: string;
}

export interface DispatchProps {
  onClick: () => void;
}

export type Props = LocalProps & StateProps & DispatchProps;

export const ListItem: React.FC<Props> = ({ id, name, position }) => {
  const handleOnClick = (event: React.MouseEvent<HTMLLIElement>) => {
    window.alert(id);
  };
  return (
    <Draggable
      key={id}
      draggableId={`list-item-${id}`}
      index={position}
      type="list-item"
    >
      {provided => (
        <li
          className={"list-item"}
          onClick={handleOnClick}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {name}
        </li>
      )}
    </Draggable>
  );
};

const makeMapState: MemoizedPropsState<State, LocalProps, StateProps> = () => {
  const getCardName = getCardNameInstance();
  return (state, props) => {
    return {
      name: getCardName(state, props.id)
    };
  };
};

const mapDispatchToProps: DispatchProps = {
  onClick: () => {}
};

export default connect(
  makeMapState,
  mapDispatchToProps
)(ListItem);
