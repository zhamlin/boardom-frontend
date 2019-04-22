import * as React from "react";
import { Link, Route, RouteComponentProps } from "react-router-dom";
import { Board, LocalProps as BoardProps } from "./board";
import { MemoizedPropsState } from "./types";

import { connect } from "react-redux";
import { State } from "../stores";
import { selectBoards } from "../stores/lists/selectors";

export interface LocalProps {}

export interface StateProps {
  boards: BoardProps[];
}

export interface DispatchProps {}

export type Props = LocalProps & StateProps & DispatchProps;

export const Boards: React.FC<Props & RouteComponentProps> = ({
  boards,
  match
}) => {
  return (
    <>
      <h2 className="is-size-6 has-text-white">Select or create a board</h2>
      <br />
      <div className="tile is-ancestor">
        <div className="tile">
          {boards.map(b => {
            return (
              <article key={b.id} className="tile is-child notification is-2">
                <Link to={`${match.path}/${b.id}`} className="title">
                  {b.id}
                </Link>
              </article>
            );
          })}
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

const mapDispatchToProps: DispatchProps = {};

export default connect(
  makeMapState,
  mapDispatchToProps
)(Boards);
