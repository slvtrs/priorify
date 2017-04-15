import React from 'react'
import {partial} from '../../lib/utils'

export const TodoItem = (props) => {
	const handleToggle = partial(props.handleToggle, props.id)
	// const handleToggle = props.handleToggle.bind(null, props.id)
	const handleRemove = partial(props.handleRemove, props.id)
	// "PRELOADING props.handleRemove with props.id"
	return (
		<li>
			<span className='delete-item'><a href='#' onClick={handleRemove}>X</a></span>
			<input type='checkbox' checked={props.isCompleted} onChange={handleToggle} /> {props.name}
		</li>
	)
}

TodoItem.propTypes = {
	id: React.PropTypes.number.isRequired,
	name: React.PropTypes.string.isRequired,
	isComplete: React.PropTypes.bool,
	handleToggle: React.PropTypes.func
}