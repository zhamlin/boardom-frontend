import * as React from "react";
import { Link } from "react-router-dom";
import { Props as BoardProps } from "./board";
import { MemoizedPropsState } from "./types";

import { connect } from "react-redux";
import { State } from "../stores";
import { createBoard } from "../stores/lists/actions";
import { selectBoards } from "../stores/lists/selectors";

export interface LocalProps {
  path: string;
}

export interface StateProps {
  boards: BoardProps[];
}

export interface DispatchProps {
  createBoard: (name: string) => void;
}

export type Props = LocalProps & StateProps & DispatchProps;

export const Boards: React.FC<Props> = ({ boards, path, createBoard }) => {
  function handleNewBoard() {
    createBoard("default");
  }
  return (
    <>
      <h2 className="is-size-6 has-text-white">Select or create a board</h2>
      <br />
      <div className="tile is-ancestor">
        <div className="tile">
          {boards.map(b => {
            return (
              <article key={b.id} className="tile is-child notification is-2">
                <Link to={`${path}/${b.id}`} className="title">
                  {b.name}
                </Link>
              </article>
            );
          })}
          <a onClick={handleNewBoard} className="button">
            New Board
          </a>
        </div>
      </div>
    </>
  );
};

const makeMapState: MemoizedPropsState<State, LocalProps, StateProps> = () => {
  return (state, props) => {
    return {
      boards: selectBoards(state).all()
    };
  };
};

const mapDispatchToProps: DispatchProps = {
  createBoard: (name: string) => createBoard({ name })
};

export default connect(
  makeMapState,
  mapDispatchToProps
)(Boards);
