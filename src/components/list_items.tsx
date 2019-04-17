import { connect } from "react-redux";
import { State } from "../stores";
import { getCardNameInstance } from "../stores/lists/selectors";

import * as React from "react";
import { Draggable } from "react-beautiful-dnd";

export interface LocalProps {
  id: string;
}

export interface StateProps {
  name: string;
}

export interface DispatchProps {
  onClick: () => void;
}

export type Props = LocalProps & StateProps & DispatchProps;

export const ListItem: React.FC<Props> = ({ id, name }) => {
  const handleOnClick = (event: React.MouseEvent<HTMLLIElement>) => {
    window.alert(id);
  };
  return (
    <Draggable draggableId={`list-item${id}`} index={Number(0)}>
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

type MemorizedState<S, SP> = () => (state: S) => SP;
type MemorizedPropsState<S, P, SP> = () => (state: S, props: P) => SP;

const makeMapState: MemorizedPropsState<State, LocalProps, StateProps> = () => {
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
