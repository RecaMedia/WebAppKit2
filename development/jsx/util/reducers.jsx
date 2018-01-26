import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';

import global from '../reducers/global';

const reducers = combineReducers({
	global,
  routing: routerReducer
});

export default reducers;