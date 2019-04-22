export type MemoizedState<S, SP> = () => (state: S) => SP;
export type MemoizedPropsState<S, P, SP> = () => (state: S, props: P) => SP;
