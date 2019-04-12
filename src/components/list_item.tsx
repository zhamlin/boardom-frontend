import * as React from 'react';

export interface Props {
  name: string;
  enthusiasmLevel?: number;
  onIncrement?: () => void;
}

function List({ name, enthusiasmLevel = 1, onIncrement}: Props) {
    if (enthusiasmLevel <= 0) {
      throw new Error('You could be a little more enthusiastic. :D');
    }

    return (
    <div className="list">
        <h3 className="list-title">{ name }</h3>
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
