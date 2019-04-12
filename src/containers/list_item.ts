import { connect } from 'react-redux';
import * as actions from '../actions/';
import List from '../components/list_item';
import { StoreState } from '../store';

export function mapStateToProps({ enthusiasmLevel, languageName }: StoreState) {
  return {
    enthusiasmLevel,
    name: languageName,
  }
}

export const mapDispatchToProps = {
    onIncrement: () => actions.incrementEnthusiasm(),
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
