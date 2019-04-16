import { connect } from "react-redux";
import { State } from "../stores";
import { getCardNameInstance } from "../stores/lists/selectors";

import * as React from "react";

export interface LocalProps {
  id: string;
}

export interface StateProps {
  name: string;
}

export interface DispatchProps {
  onClick: () => void;
}

export type Props = LocalProps & StateProps & DispatchProps;

export const ListItem: React.FC<Props> = ({ id, name }) => {
  const handleOnClick = (event: React.MouseEvent<HTMLLIElement>) => {
    window.alert(id);
  };
  return (
    <>
      <li onClick={handleOnClick}>{name}</li>
    </>
  );
};

type MemorizedState<S, SP> = () => (state: S) => SP;
type MemorizedPropsState<S, P, SP> = () => (state: S, props: P) => SP;

const makeMapState: MemorizedPropsState<State, LocalProps, StateProps> = () => {
  const getCardName = getCardNameInstance();
  return (state, props) => {
    return {
      name: getCardName(state, props.id)
    };
  };
};

const mapDispatchToProps: DispatchProps = {
  onClick: () => {}
};

export default React.memo(
  connect(
    makeMapState,
    mapDispatchToProps
  )(ListItem)
);
