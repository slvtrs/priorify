import React, {Component} from 'react'

export class ButtonStatus extends Component {
	render(){
		return (
			<div className={'status-button ' + this.props.status}
				onClick={this.props.handleCycleStatus}>
			</div>
		)
	}
}

ButtonStatus.propTypes = {
	status: React.PropTypes.string.isRequired,
	handleCycleStatus: React.PropTypes.func.isRequired
}