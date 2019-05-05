import * as React from "react";
import { Link } from "react-router-dom";
import {
  LocalProps as LocalBoardProps,
  StateProps as StateBoardProps
} from "./board";
import { MemoizedPropsState } from "./types";

import { connect } from "react-redux";
import { State } from "stores";
import { createBoard } from "stores/lists/actions";
import { selectBoards } from "stores/lists/selectors";

export interface LocalProps {
  path: string;
}

type BoardProps = LocalBoardProps & StateBoardProps;

export interface StateProps {
  boards: BoardProps[];
}

export interface DispatchProps {
  createBoardAction: (name: string) => void;
}

export type Props = LocalProps & StateProps & DispatchProps;

export const Boards: React.FC<Props> = ({
  boards,
  path,
  createBoardAction
}) => {
  function handleNewBoard() {
    createBoardAction("default");
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
          <button onClick={handleNewBoard} className="button">
            New Board
          </button>
        </div>
      </div>
    </>
  );
};

const makeMapState: MemoizedPropsState<State, LocalProps, StateProps> = () => {
  return (state, props) => {
    return {
      boards: selectBoards(state.lists).all()
    };
  };
};

const mapDispatchToProps: DispatchProps = {
  createBoardAction: (name: string) => createBoard({ name })
};

export default connect(
  makeMapState,
  mapDispatchToProps
)(Boards);
