import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import Lists from "./lists";
import { MemoizedPropsState } from "./types";

import { connect } from "react-redux";
import { State } from "../stores";

export interface LocalProps {
  id: string;
}

export interface StateProps {
  name: string;
}

export interface DispatchProps {}

export type Props = LocalProps & StateProps & DispatchProps;

export const Board: React.FC<Props & RouteComponentProps<LocalProps>> = ({
  id,
  name,
  match
}) => {
  return (
    <>
      <nav className="navbar board">{name}</nav>
      <Lists boardID={match.params.id} />
    </>
  );
};

const makeMapState: MemoizedPropsState<State, LocalProps, StateProps> = () => {
  return (state, props) => {
    return {
      name: "test"
    };
  };
};

const mapDispatchToProps: DispatchProps = {};

export default connect(
  makeMapState,
  mapDispatchToProps
)(Board);
