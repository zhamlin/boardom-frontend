import * as React from 'react';

export interface Props {
  name: string;
  id: string;
  enthusiasmLevel?: number;
  onIncrement?: () => void;
  onNameChange?: (name: string) => void;
}

const ListName: React.FC<any> = ({ name, onNameChange }: any) => {
    const [editingName, setEditingHidden] = React.useState(false);
    const onClick = () => setEditingHidden(!editingName);
    const onFocus = (event: React.FocusEvent<HTMLInputElement>) => event.target.select();
    const onBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        if (onNameChange != null) {
            onNameChange(event.target.value);
        }
        setEditingHidden(false);
    }

    return (
        <div className="level-left">
            { !editingName &&
            <h3 onDoubleClick={onClick}  className="list-title">{ name }</h3>
            }
            { editingName &&
            <div className="control ">
                <input onBlur={onBlur} autoFocus={true} onFocusCapture={onFocus} className="input is-info list-title-editing" type="text" defaultValue={name}/>
            </div>
            }
        </div>
    );
}

// tslint:disable-next-line:no-console
console.log(ListName.name)

const List: React.FC<any> = ({ name, enthusiasmLevel = 1, onIncrement, onNameChange }: any) => {
    if (enthusiasmLevel <= 0) {
      throw new Error('You could be a little more enthusiastic. :D');
    }


    return (
    <div className="list">
        <div className="list-header level is-mobile">
            <ListName name={name} onNameChange={onNameChange}/>
            <span className="icon level-right">
                <i className="fas fa-bars"/>
            </span>
        </div>
        <ul className="list-items">
            <li>{ getExclamationMarks(enthusiasmLevel) }</li>
        </ul>
        <a onClick={onIncrement} className="list-button button is-light">Add card</a>
    </div>
    );
}
export default List;

// helpers

function getExclamationMarks(numChars: number) {
  return Array(numChars + 1).join('!');
}
