const global = function(state = {}, action) {
	// Add last action
	state = Object.assign({}, state, {
		lastAction: action.type
	})

	switch (action.type) {
		// Action types
		case "ALERT" : {
			console.log(action.text);
			break;
		}
	}
	return state;
}

export default global;