import React, {Component} from 'react'

export class ButtonExpand extends Component {
	render(){
		let childCounter = this.props.count ? (
			!this.props.expanded ? <div className='child-count'>{this.props.count}</div> : ''
			) : '';
		let icon = this.props.count ? (
			this.props.expanded ? '|' : '-'
			) : '';
		return (
			<div className='expand-button' onClick={this.props.handleToggleExpand}>
				{childCounter}
				{icon}
			</div>
		)
	}
}

ButtonExpand.propTypes = {
	handleToggleExpand: React.PropTypes.func.isRequired
}