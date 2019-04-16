import { connect } from "react-redux";
import { createCard, updateListName } from "../constants/actions";
import { State } from "../stores";

import * as React from "react";
import { LocalProps as ListItemProps } from "./list_items";
import ListItem from "./list_items";

export interface LocalProps {
  id: string;
}

export interface StateProps {
  name: string;
  items: ListItemProps[];
}

export interface ActionProps {
  onAddCard: (id: string, name: string) => void;
  onListNameChange: (id: string, name: string) => void;
}

export type Props = StateProps & LocalProps & ActionProps;

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
  items,
  name,
  onAddCard,
  onListNameChange
}) => {
  const handleAddCard = () => {
    onAddCard(id, "card");
  };
  return (
    <div className="list">
      <div className="list-header level is-mobile">
        <ListName id={id} name={name} onListNameChange={onListNameChange} />
        <span className="icon level-right">
          <i className="fas fa-bars" />
        </span>
      </div>
      <ul className="list-items">
        {Object.entries(items).map(([_, i]) => {
          return <ListItem id={i.id} key={i.id} />;
        })}
      </ul>
      <a onClick={handleAddCard} className="list-button button is-light">
        Add card
      </a>
    </div>
  );
};

function mapStateToProps(state: State, props: LocalProps): StateProps {
  const items = state.lists!.cards.items().filter(i => i.listID === props.id);
  return {
    items,
    name: state.lists!.items.data[props.id].name
  };
}

let nextCardID = 0;
const mapDispatchToProps: ActionProps = {
  onAddCard: (id: string, name: string) =>
    createCard({ id: (nextCardID++).toString(), name, listID: id }),
  onListNameChange: (id: string, name: string) => updateListName({ id, name })
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(List);
