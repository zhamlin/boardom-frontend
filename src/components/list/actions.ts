import * as constants from '../../constants';

export interface CreateList {
    type: constants.CREATE_LIST;
    payload: {
        name: string;
        id: string;
    }
}

let nextListID = 0
export function createList(name: string): CreateList {
    nextListID++;
    return {
        payload: {
            id: nextListID.toString(),
            name,
        },
        type: constants.CREATE_LIST,
    }
}

export interface UpdateListName {
    type: constants.UPDATE_LIST_NAME;
    payload: {
        name: string;
    }
}

export function updateListName(name: string): UpdateListName {
    return {
        payload: {
            name
        },
        type: constants.UPDATE_LIST_NAME,
    }
}

export interface IncrementEnthusiasm {
    type: constants.INCREMENT_ENTHUSIASM;
}

export interface DecrementEnthusiasm {
    type: constants.DECREMENT_ENTHUSIASM;
}


export function incrementEnthusiasm(): IncrementEnthusiasm {
    return {
        type: constants.INCREMENT_ENTHUSIASM
    }
}

export function decrementEnthusiasm(): DecrementEnthusiasm {
    return {
        type: constants.DECREMENT_ENTHUSIASM
    }
}

export type Action = CreateList | UpdateListName | IncrementEnthusiasm | DecrementEnthusiasm
