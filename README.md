# overview
a basic trello clone using react, redux, and typescript.

## make
### component
    supply the name for the component

# layout
## src/components
    react components with their redux containers
### LocalProps
    props meant to be passed directly in from jsx
### StateProps
    props meant to be passed in from redux via mapStateToProps
### DispatchProps
    props meant to be passed in from redux via mapDispatchToProps
### Props
    a union of all three of the above.

## src/stores
    redux reducers, selectors, actions, and state defintions go here
    each store should export default the reducer and export its state
    index.ts combines all of the other reducers into the rootReducer.
