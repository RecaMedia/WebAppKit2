import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import {Provider} from 'react-redux';
import store, {history} from './store';

import App from './util/connectDispatch';

import Home from './templates/home';

//ReactGA.initialize('');

function logPageView() {
	// ReactGA.set({
	// 	page:window.location.pathname
	// });
	// ReactGA.pageview(window.location.pathname);
}

const Routing = (
	<Provider store={store}>
		<Router history={history} onUpdate={logPageView}>
			<Route path="/" component={App}>
				<IndexRoute component={Home}></IndexRoute>
				<Route path="/test" component={Home}></Route>
				<Route path="/test/:itemtest" component={Home}></Route>
			</Route>
		</Router>
	</Provider>
)

// Renders
ReactDOM.render(Routing, document.getElementById("App"));