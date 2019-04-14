import { connect } from "react-redux";
import { Actions, Lists, Props } from "../components/lists";
import { updateListName } from "../constants/actions";
import { State } from "../reducers";

function mapStateToProps(state: State): Props {
  return {
    lists: state.lists!.data
  };
}

const mapDispatchToProps: Actions = {
  onListNameChange: updateListName
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Lists);
