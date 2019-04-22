import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import Lists from "./lists";
import { MemoizedPropsState } from "./types";

import { connect } from "react-redux";
import { State } from "../stores";
import { getBoardNameInstance } from "../stores/lists/selectors";

export interface LocalProps {
  id: string;
}

export interface StateProps {
  name: string;
}

export interface DispatchProps {}

export type Props = LocalProps & StateProps & DispatchProps;

export const Board: React.FC<Props> = ({ id, name }) => {
  return (
    <>
      <nav className="navbar board">{name}</nav>
      <Lists boardID={id} />
    </>
  );
};

const makeMapState: MemoizedPropsState<State, LocalProps, StateProps> = () => {
  const getBoardName = getBoardNameInstance();
  return (state, props) => {
    return {
      name: getBoardName(state, props.id)
    };
  };
};

const mapDispatchToProps: DispatchProps = {};

export default connect(
  makeMapState,
  mapDispatchToProps
)(Board);
