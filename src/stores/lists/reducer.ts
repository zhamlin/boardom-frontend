import { filterActions, UnreachableCaseError } from "../../util";
import { actionList, ActionsType, MOVE_CARD, MOVE_LIST } from "./actions";

import {
  database,
  State,
  boardModelReducer,
  listItemReducer,
  listModelReducer
} from "./models";

function updatePosition<T extends { position: number }>(
  items: T[],
  sourcePos: number,
  destPos: number
) {
  items.sort((a, b) => a.position - b.position);
  const [removed] = items.splice(sourcePos, 1);
  items.splice(destPos, 0, removed);
  return order(items);
}

function order<T extends { position: number }>(items: T[]) {
  return items.map((value, index) => {
    value.position = index;
    return value;
  });
}

function reducer(state: Readonly<State>, action: ActionsType): State {
  state = boardModelReducer(state, action);
  state = listItemReducer(state, action);
  state = listModelReducer(state, action);
  const sess = database.session(state.db);
  switch (action.type) {
    case MOVE_CARD: {
      const { source, destination, id } = action.payload;
      if (source.listID === destination.listID) {
        const items = updatePosition(
          sess.ListItem.all(),
          source.index,
          destination.index
        );
        sess.ListItem.updateAll(...items);
        return {
          ...state,
          db: database.commit(sess)
        };
      }

      const sourceListCards = sess.ListItem.all()
        .filter(c => c.listID === source.listID)
        .sort((a, b) => a.position - b.position);
      sourceListCards.splice(source.index, 1);

      const card = sess.ListItem.get(id)!;
      const destListCards = sess.ListItem.all()
        .filter(c => c.listID === destination.listID)
        .sort((a, b) => a.position - b.position);
      destListCards.splice(destination.index, 0, card);
      card.listID = destination.listID;

      sess.ListItem.updateAll(
        ...order(sourceListCards),
        ...order(destListCards)
      );
      return {
        ...state,
        db: database.commit(sess)
      };
    }
    case MOVE_LIST: {
      const { currentPosition, newPosition } = action.payload;
      sess.List.updateAll(
        ...updatePosition(sess.List.all(), currentPosition, newPosition)
      );
      return {
        ...state,
        db: database.commit(sess)
      };
    }
    // default:
    // throw new UnreachableCaseError(action);
  }
  return { ...state };
}

// filter reducers down to actions we care about. Allows the switch
// to be checked that it handles all possible actions.
export default filterActions(reducer, actionList.isActionType);
