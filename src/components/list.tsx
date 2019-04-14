import * as React from "react";

export interface Props {
  name: string;
  id: string;
}

export interface Actions {
  onListNameChange: (id: string, name: string) => void;
}

const ListName: React.FC<Props & Actions> = ({
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

// tslint:disable-next-line:no-console
console.log(ListName.name);

export const List: React.FC<Props & Actions> = ({
  id,
  name,
  onListNameChange
}) => {
  return (
    <div className="list">
      <div className="list-header level is-mobile">
        <ListName id={id} name={name} onListNameChange={onListNameChange} />
        <span className="icon level-right">
          <i className="fas fa-bars" />
        </span>
      </div>
      <ul className="list-items">
        <li>Test</li>
      </ul>
      <a className="list-button button is-light">Add card</a>
    </div>
  );
};
