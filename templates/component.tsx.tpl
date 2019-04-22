import * as React from "react";
import { MemoizedPropsState } from "./types";

import { connect } from "react-redux";
import { State } from "../stores";

export interface LocalProps {}

export interface StateProps {}

export interface DispatchProps {}

export type Props = LocalProps & StateProps & DispatchProps;

export const COMPONENT: React.FC<Props> = () => {
  return (
    <>
      <p>placeholder</p>
    </>
  );
};

const makeMapState: MemoizedPropsState<State, LocalProps, StateProps>  = () => {
  return (state, props) => {
    return {};
  };
};

const mapDispatchToProps: DispatchProps = {};

export default connect(
  makeMapState,
  mapDispatchToProps
)(COMPONENT);
