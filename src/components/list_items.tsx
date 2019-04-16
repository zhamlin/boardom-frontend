import { connect } from "react-redux";
import { State } from "../stores";

import * as React from "react";

export interface LocalProps {
  id: string;
}

export interface StateProps {
  name: string;
}

export interface ActionProps {
  onClick: () => void;
}

export type Props = LocalProps & StateProps & ActionProps;

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

function mapStateToProps(state: State, props: LocalProps): StateProps {
  return {
    name: state.lists!.cards.get(props.id)!.name
  };
}

const mapDispatchToProps: ActionProps = {
  onClick: () => {}
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListItem);
