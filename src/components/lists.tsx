import * as React from "react";
import {
  DragDropContext,
  Droppable,
  DropResult,
  ResponderProvided
} from "react-beautiful-dnd";
import { LocalProps as ListProps } from "../components/list";
import List from "../components/list";

import { connect } from "react-redux";
import { createList, moveList } from "../constants/actions";
import { State } from "../stores";
import { getAllListsInstance } from "../stores/lists/selectors";

export interface StateProps {
  lists: ListProps[];
  defaultListName: string;
}

export interface DispatchProps {
  addList: (name: string) => void;
  listMove: (currentPosition: number, newPosition: number) => void;
}

export type Props = StateProps & DispatchProps;

export const Lists: React.FC<Props> = ({
  lists,
  defaultListName,
  addList,
  listMove
}) => {
  const onAddList = () => {
    addList(defaultListName);
  };
  const handleListDrag = (result: DropResult, provided: ResponderProvided) => {
    if (result.destination === undefined) {
      return;
    }
    listMove(result.source.index, result.destination!.index);
  };
  return (
    <DragDropContext onDragEnd={handleListDrag}>
      <Droppable droppableId="lists" type="lists" direction="horizontal">
        {provided => (
          <div
            className="lists"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {lists.map(l => {
              return <List position={l.position} id={l.id} key={l.id} />;
            })}
            {provided.placeholder}
            <a className="button" onClick={onAddList}>
              New List
            </a>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

const makeMapState = () => {
  const getAllLists = getAllListsInstance();
  return (state: State): StateProps => {
    return {
      defaultListName: "list",
      lists: getAllLists(state)
    };
  };
};

let nextListID = 0;
const mapDispatchToProps: DispatchProps = {
  addList: (name: string) =>
    createList({ id: (nextListID++).toString(), name }),
  listMove: (currentPosition: number, newPosition: number) =>
    moveList({ currentPosition, newPosition })
};

export default connect(
  makeMapState,
  mapDispatchToProps
)(Lists);
