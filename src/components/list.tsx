import { Draggable } from "react-beautiful-dnd";
import { Droppable } from "react-beautiful-dnd";
import { connect } from "react-redux";
import { createCard, updateListName } from "../constants/actions";
import { State } from "../stores";

import * as React from "react";
import {
  getAllListCardsInstance,
  getListNameInstance
} from "../stores/lists/selectors";
import { LocalProps as ListItemProps } from "./list_items";
import ListItem from "./list_items";

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
        <div className="control ">
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
    <Draggable draggableId={`list-${id}`} index={position}>
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
            droppableId={`list-items-droppable-${id}`}
            type="list-item"
          >
            {listProvided => (
              <ul
                className="list-items"
                id={"container"}
                ref={listProvided.innerRef}
                {...listProvided.droppableProps}
              >
                {Object.entries(items).map(([_, i]) => {
                  return <ListItem id={i.id} key={i.id} />;
                })}
                {listProvided.placeholder}
              </ul>
            )}
          </Droppable>
          <a onClick={handleAddCard} className="list-button button is-light">
            Add card
          </a>
        </div>
      )}
    </Draggable>
  );
};

const makeMapState = () => {
  const getListName = getListNameInstance();
  const getAllListCards = getAllListCardsInstance();
  return (state: State, props: LocalProps): StateProps => {
    return {
      items: getAllListCards(state, props.id).all(),
      name: getListName(state, props.id)
    };
  };
};

let nextCardID = 0;
const mapDispatchToProps: DispatchProps = {
  onAddCard: (id: string, name: string) =>
    createCard({ id: (nextCardID++).toString(), name, listID: id }),
  onListNameChange: (id: string, name: string) => updateListName({ id, name })
};

export default connect(
  makeMapState,
  mapDispatchToProps
)(List);
