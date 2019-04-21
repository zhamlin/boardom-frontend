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
import { createList, moveCard, moveList } from "../constants/actions";
import { State } from "../stores";
import { getAllListsInstance } from "../stores/lists/selectors";

export interface StateProps {
  lists: ListProps[];
  defaultListName: string;
}

export interface DispatchProps {
  addList: (name: string) => void;
  listMove: (currentPosition: number, newPosition: number) => void;
  moveCard: (
    id: string,
    source: { listID: string; index: number },
    destination: { listID: string; index: number }
  ) => void;
}

export type Props = StateProps & DispatchProps;

export const Lists: React.FC<Props> = ({
  lists,
  defaultListName,
  addList,
  moveCard,
  listMove
}) => {
  const onAddList = () => {
    addList(defaultListName);
  };
  const handleListDrag = (result: DropResult, provided: ResponderProvided) => {
    console.log(result);
    if (result.destination === undefined || result.destination === null) {
      return;
    }

    switch (result.type) {
      case "lists":
        listMove(result.source.index, result.destination.index);
        break;
      case "list-item":
        const sourceListID = result.source.droppableId.replace(/[^0-9]/g, "");
        const destListID = result.destination.droppableId.replace(
          /[^0-9]/g,
          ""
        );

        moveCard(
          result.draggableId.replace(/[^0-9]/g, ""),
          { listID: sourceListID, index: result.source.index },
          { listID: destListID, index: result.destination.index }
        );
        break;

      default:
        break;
    }
  };
  return (
    <DragDropContext onDragEnd={handleListDrag}>
      <Droppable
        droppableId="lists-droppable"
        type="lists"
        direction="horizontal"
      >
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

function call<TS extends any[], R>(fn: (...args: TS) => R, ...args: TS): R {
  return fn(...args);
}

const mapDispatchToProps: DispatchProps = {
  addList: (name: string) => createList({ id: "", name }),
  listMove: (currentPosition: number, newPosition: number) =>
    moveList({ currentPosition, newPosition }),
  moveCard: (
    id: string,
    source: { listID: string; index: number },
    destination: { listID: string; index: number }
  ) => moveCard({ id, source, destination })
};

export default connect(
  makeMapState,
  mapDispatchToProps
)(Lists);
