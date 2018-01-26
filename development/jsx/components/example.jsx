import React from 'react';
import Lightbox from '../modules/lightbox_signup';

// Example React Component
class Example extends React.Component {

	constructor(props) {
		super(props);
	}

	openLightbox() {
		Lightbox.toggle();
	}

	render() {

		return (
			<div>
				<button onClick={() => this.openLightbox()}>Lightbox</button>
			</div>
		)
	}
}

export default Example;