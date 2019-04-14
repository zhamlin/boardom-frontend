import { combineReducers } from 'redux'
import list from './components/list/reducers'

export default combineReducers({
    lists: list,
})
