import React from 'react';
import ReactDOM from 'react-dom';

const OutsideApp = document.getElementById("OutsideApp");

class Lightbox extends React.Component {

	constructor(props) {
		super(props);
		this.closeForm = this.closeForm.bind(this);
	}

	closeForm() {
		ReactDOM.unmountComponentAtNode(OutsideApp);
	}

	render() {
		return (
			<div className="lightbox">
				<div className="lightbox-bg-btn" onClick={() => this.closeForm()}></div>
				<div id="lightbox" className="lightbox-content">
					Content here.
				</div>
			</div>
		)
	}
}

export default {
  toggle: function() {
		if (document.getElementById("lightbox") != null) {
    	ReactDOM.unmountComponentAtNode(OutsideApp);
		} else {
    	ReactDOM.render(<Lightbox/>, OutsideApp);
		}
  }
}