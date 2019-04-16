import * as React from "react";
import { LocalProps as ListProps } from "../components/list";
import List from "../components/list";

import { connect } from "react-redux";
import { createList } from "../constants/actions";
import { State } from "../stores";
import { getAllListsInstance } from "../stores/lists/selectors";

export interface StateProps {
  lists: ListProps[];
  defaultListName: string;
}

export interface DispatchProps {
  addList: (name: string) => void;
}

export type Props = StateProps & DispatchProps;

export const Lists: React.FC<Props> = ({ lists, defaultListName, addList }) => {
  const onAddList = () => {
    addList(defaultListName);
  };
  return (
    <div className="lists">
      {lists.map(l => {
        return <List id={l.id} key={l.id} />;
      })}
      <a className="button" onClick={onAddList}>
        New List
      </a>
    </div>
  );
};

const makeMapState = () => {
  const getAllLists = getAllListsInstance();
  return (state: State): StateProps => {
    return {
      defaultListName: "list",
      lists: getAllLists(state).all()
    };
  };
};

let nextListID = 0;
const mapDispatchToProps: DispatchProps = {
  addList: (name: string) => createList({ id: (nextListID++).toString(), name })
};

export default connect(
  makeMapState,
  mapDispatchToProps
)(Lists);
