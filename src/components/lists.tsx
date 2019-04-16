import * as React from "react";
import {
  ActionProps as ListActions,
  LocalProps as ListProps
} from "../components/list";
import List from "../components/list";

import { connect } from "react-redux";
import { createList } from "../constants/actions";
import { State } from "../stores";

export interface StateProps {
  lists: ListProps[];
  defaultListName: string;
}

export interface ActionProps {
  addList: (name: string) => void;
}

export type Props = StateProps & ActionProps;

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

function mapStateToProps(state: State): StateProps {
  return {
    defaultListName: "list",
    lists: state.lists!.items.items()
  };
}

let nextListID = 0;
const mapDispatchToProps: ActionProps = {
  addList: (name: string) => createList({ id: (nextListID++).toString(), name })
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Lists);
