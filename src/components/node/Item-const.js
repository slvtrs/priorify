import React from 'react'

export const Item = (props) => (
	<div className='App-Item'>
		<div className='App-Input'
			contentEditable='true' 
			onKeyPress={props.handleKeyPress} 
			value={props.currentItem}>
			{props.name}
		</div>
	</div>
)

Item.propTypes = {
	currentItem: React.PropTypes.string.isRequired,
	handleKeyPress: React.PropTypes.func.isRequired,
	handleRemove: React.PropTypes.func.isRequired,
	handleEnter: React.PropTypes.func.isRequired
}