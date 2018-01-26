import React from 'react';
import HeadMeta from '../components/head_meta';
import Example from '../components/example';

class Home extends React.Component {

	constructor(props) {
		super(props);

		this.meta = {
			title: "Home Page"
		};
	}

	render() {

		return (
			<div>
				<HeadMeta meta={this.meta}/>
				<Example/>
			</div>
		)
	}
}

export default Home;