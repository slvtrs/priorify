import React from 'react'
import {Link} from '../router'

export const Button = (props) => (
	<div className='App-Button'>
		<Link to={props.to}>{props.name}</Link>
	</div>
)

Button.propTypes = {
	to: React.PropTypes.string.isRequired,
	name: React.PropTypes.string.isRequired
	// handleInputChange: React.PropTypes.func.isRequired,
	// handleSubmit: React.PropTypes.func.isRequired
}