import * as React from "react";
import {
  DragDropContext,
  Droppable,
  DropResult,
  ResponderProvided
} from "react-beautiful-dnd";
import { LocalProps as ListProps } from "../components/list";
import List from "../components/list";
import { MemoizedPropsState } from "./types";

import { connect } from "react-redux";
import { State } from "../stores";
import { createList, moveCard, moveList } from "../stores/lists/actions";
import { selectBoardLists } from "../stores/lists/selectors";

export interface LocalProps {
  boardID: string;
}

export interface StateProps {
  lists: ListProps[];
  defaultListName: string;
}

export interface DispatchProps {
  addList: (name: string, boardID: string) => void;
  listMove: (currentPosition: number, newPosition: number) => void;
  moveCardAction: (
    id: string,
    source: { listID: string; index: number },
    destination: { listID: string; index: number }
  ) => void;
}

export type Props = LocalProps & StateProps & DispatchProps;

export const Lists: React.FC<Props> = ({
  lists,
  defaultListName,
  addList,
  moveCardAction,
  listMove,
  boardID
}) => {
  const onAddList = () => {
    addList(defaultListName, boardID);
  };
  const handleListDrag = (result: DropResult, provided: ResponderProvided) => {
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

        moveCardAction(
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

const makeMapState: MemoizedPropsState<State, LocalProps, StateProps> = () => {
  return (state, props) => {
    return {
      defaultListName: "list",
      lists: selectBoardLists(state, props.boardID)
    };
  };
};

const mapDispatchToProps: DispatchProps = {
  addList: (name: string, boardID: string) => createList({ boardID, name }),
  listMove: (currentPosition: number, newPosition: number) =>
    moveList({ currentPosition, newPosition }),
  moveCardAction: (
    id: string,
    source: { listID: string; index: number },
    destination: { listID: string; index: number }
  ) => moveCard({ id, source, destination })
};

export default connect(
  makeMapState,
  mapDispatchToProps
)(Lists);
