import { connect } from 'react-redux';
import { Storage } from '../../store';
import * as actions from "./actions";
import List from './component';

function mapStateToProps(state: Storage) {
  return {
    // enthusiasmLevel: state.lists[''].name,
    // name: state.lists.name,
  }
}

const mapDispatchToProps = {
    onIncrement: actions.incrementEnthusiasm,
    onNameChange: actions.updateListName,
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
