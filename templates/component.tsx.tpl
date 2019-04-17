import { connect } from "react-redux";
import { State } from "../stores";

import * as React from "react";

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

const makeMapState = () => {
  return (state: State, props: LocalProps): StateProps => {
    return {};
  };
};

const mapDispatchToProps: DispatchProps = {};

export default connect(
  makeMapState,
  mapDispatchToProps
)(COMPONENT);
