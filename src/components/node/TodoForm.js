import React from 'react'

export const TodoForm = (props) => (
	<form onSubmit={props.handleSubmit}>
		<div className='inputBox'
			contentEditable='true' 
			onInput={props.handleInputChange} 
			value={props.currentTodo} >
		</div>
	</form>
)

TodoForm.propTypes = {
	currentTodo: React.PropTypes.string.isRequired,
	handleInputChange: React.PropTypes.func.isRequired,
	handleSubmit: React.PropTypes.func.isRequired
}