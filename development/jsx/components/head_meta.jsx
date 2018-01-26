import React from 'react';
import HeadTag from 'react-head';
import meta from "../includes/globalmeta";

class HeadMeta extends React.Component {

	constructor(props) {
    super(props);
    this.state = {
			render: Object.assign({}, meta, this.props.meta)
		}
	}
	
	componentWillReceiveProps(nextProps) {
    let render = Object.assign({}, meta, nextProps.meta);
		this.setState(render);
  }

	render() {
		return (
			<div>
				<HeadTag tag="title">{this.state.render.title}</HeadTag>
				<HeadTag tag="meta" name="keywords" content={this.state.render.keywords}/>
				<HeadTag tag="meta" name="description" content={this.state.render.description}/>
				<HeadTag tag="meta" name="twitter:card" content="summary_large_image"/>
				<HeadTag tag="meta" name="twitter:description" content={this.state.render.description}/>
				<HeadTag tag="meta" name="twitter:title" content={this.state.render.title}/>
				<HeadTag tag="meta" property="og:locale" content="en_US"/>
				<HeadTag tag="meta" property="og:type" content="website"/>
				<HeadTag tag="meta" property="og:title" content={this.state.render.title}/>
				<HeadTag tag="meta" property="og:description" content={this.state.render.description}/>
				<HeadTag tag="meta" property="og:url" content={this.state.render.url}/>
				<HeadTag tag="meta" property="og:site_name" content={this.state.render.name}/>
				<HeadTag tag="meta" property="og:image" content={this.state.render.image}/>
				<HeadTag tag="link" rel="canonical" href={this.state.render.url}/>
			</div>
    )
	}
}

export default HeadMeta;