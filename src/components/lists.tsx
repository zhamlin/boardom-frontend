import * as React from "react";
import {
  Actions as ListActions,
  List,
  Props as ListProps
} from "../components/list";

export interface Props {
  lists: Record<string, ListProps>;
}

export interface Actions extends ListActions {}

export const Lists: React.FC<Props & Actions> = ({
  lists,
  onListNameChange
}) => {
  return (
    <div className="lists">
      {Object.keys(lists).map((key: string) => {
        lists.test = { name: "", id: "" };
        const list = lists[key];
        return (
          <List
            onListNameChange={onListNameChange}
            id={list.id}
            name={list.name}
            key={list.id}
          />
        );
      })}
    </div>
  );
};
