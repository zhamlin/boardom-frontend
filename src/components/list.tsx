import * as React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import {
  getAllListCardsInstance,
  getListNameInstance
} from "stores/lists/selectors";
import { LocalProps as ListItemProps } from "./list_items";
import ListItem from "./list_items";
import { MemoizedPropsState } from "./types";

import { connect } from "react-redux";
import { State } from "stores";
import { createCard, updateList } from "stores/lists/actions";

export interface LocalProps {
  id: string;
  position: number;
}

export interface StateProps {
  name: string;
  items: ListItemProps[];
}

export interface DispatchProps {
  onAddCard: (id: string, name: string) => void;
  onListNameChange: (id: string, name: string) => void;
}

export type Props = StateProps & LocalProps & DispatchProps;

const ListName: React.FC<Pick<Props, "id" | "name" | "onListNameChange">> = ({
  id,
  name,
  onListNameChange
}) => {
  const [editingName, setEditingHidden] = React.useState<boolean>(false);
  const onClick = () => setEditingHidden(!editingName);
  const onFocus = (event: React.FocusEvent<HTMLInputElement>) =>
    event.target.select();
  const onBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    onListNameChange(id, event.target.value);
    setEditingHidden(false);
  };

  return (
    <div className="level-left">
      {!editingName && (
        <h3 onDoubleClick={onClick} className="list-title">
          {name}
        </h3>
      )}
      {editingName && (
        <div className="">
          <input
            onBlur={onBlur}
            autoFocus={true}
            onFocusCapture={onFocus}
            className="input is-info list-title-editing"
            type="text"
            defaultValue={name}
          />
        </div>
      )}
    </div>
  );
};

export const List: React.FC<Props> = ({
  id,
  position,
  items,
  name,
  onAddCard,
  onListNameChange
}) => {
  const handleAddCard = () => {
    onAddCard(id, "card");
  };
  return (
    <Draggable key={id} draggableId={`list-${id}`} index={position} type="list">
      {provided => (
        <div
          className="list"
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <div
            className="list-header level is-mobile"
            {...provided.dragHandleProps}
          >
            <ListName id={id} name={name} onListNameChange={onListNameChange} />
            <span className="icon level-right">
              <i className="fas fa-bars" />
            </span>
          </div>
          <Droppable
            droppableId={`list-${id}`}
            type="list-item"
            direction="vertical"
          >
            {listProvided => (
              <ul
                className="list-items"
                id={"container"}
                ref={listProvided.innerRef}
                {...listProvided.droppableProps}
              >
                {items.map(i => {
                  return (
                    <ListItem id={i.id} key={i.id} position={i.position} />
                  );
                })}
                {listProvided.placeholder}
              </ul>
            )}
          </Droppable>
          <button
            onClick={handleAddCard}
            className="list-button button is-light"
          >
            Add card
          </button>
        </div>
      )}
    </Draggable>
  );
};

const makeMapState: MemoizedPropsState<State, LocalProps, StateProps> = () => {
  const getListName = getListNameInstance();
  const getAllListCards = getAllListCardsInstance();
  return (state, props) => {
    return {
      items: getAllListCards(state.lists, props.id),
      name: getListName(state.lists, props.id)
    };
  };
};

const mapDispatchToProps: DispatchProps = {
  onAddCard: (id: string, name: string) => createCard({ name, listID: id }),
  onListNameChange: (id: string, name: string) => updateList({ id, name })
};

export default connect(
  makeMapState,
  mapDispatchToProps
)(List);
