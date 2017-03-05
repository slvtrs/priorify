import React, {Component} from 'react'
import {ItemList} from './ItemList'
// import {addTodo, generateId, findById, toggleTodo, updateTodo, removeTodo, filterTodos} from '../../lib/todoHelpers'
// import {pipe, partial} from '../../lib/utils'
// import {loadChildren, saveTodo, destroyTodo} from '../../lib/todoService'
import {saveTodo} from '../../lib/todoService'

export class Item extends Component {
	state = {
    	name: this.props.name || this.props.content,
    	expanded: false,
  	}

	componentDidMount() {
  		this.refs.input.focus();
	}

	componentWillUnmount() {
		this.props.handleFocus(this.props.position-1);
	}

	handleKeyDown (evt) {
		var myNavigationKeys = ['.'];
		if (myNavigationKeys.indexOf(evt.key) > -1)
			this.handleMyNavigation(evt, this.props.id, this.props.position);

		var navigationKeys = ['ArrowUp','ArrowDown','Enter','Backspace'];
		if (navigationKeys.indexOf(evt.key) > -1)
			this.props.handleNavigation(evt, this.props.id, this.props.position);
	}

	handleMyNavigation = (evt, id, position) => {
		if(this.props.mods.length)
			switch(evt.key) {
				case '.':
				  this.toggleExpand(evt);
				break;
				default:
				break;
			}
	}

  	handleArrowDown = () => {
	    var item = this.refs['item-1'];
	    if (!item) return;
	    item.refs.input.focus();
	}

  	handleInput = (evt, id) => {
  		  var currentItem = {
  		    id: this.props.id,
  		    parent: this.props.parent,
  		    name: this.refs.input.innerHTML
  		  };
  		  // this.setState({currentItem});
  		  this.setState({name: currentItem.name});

  		    // const getToggledTodo = pipe(findById, toggleTodo)
  		    // const updated = getToggledTodo(id, this.state.todos)
  		    // const getUpdatedTodos = partial(updateTodo, this.state.todos)
  		    // const updatedTodos = getUpdatedTodos(updated)
  		    // this.setState({children: updatedTodos})
  		    // saveTodo(updated);

  		    saveTodo( currentItem );
  		      // .then(() => this.showTempMessage('Todo Updated'))
  	}

  	toggleExpand = (evt) => {
  		evt.preventDefault()
  		this.setState({
  			expanded: !this.state.expanded
  		})
  	}

	render(){
		var childList = this.state.expanded ?
			<ItemList className='App-List'
				id={this.props.id}
				mods={this.props.mods}
				// handleKeyDown={this.handleKeyDown}
				// handleInput={this.handleInput}
				// handleRemove={this.handleRemove}
				handleFocusPrevious={this.handleFocusPrevious}
				currentItem={this.state.currentItem}/> 
			: '';
		var expandButton = 
			<div className='expand-button' onClick={this.toggleExpand}>
				{this.state.expanded ? 'v' : '>'}
			</div>;
		var statuses = ['open','disabled','complete','closed']
		var statusButton = 
			<div className={'status-button ' + statuses[this.props.position]} onClick={this.toggleExpand}>
			</div>;
		return (
			<div className='App-Item'>
				{expandButton}
				<div className='App-Input'
					contentEditable='true' 
					suppressContentEditableWarning='true'
					ref='input'
					onKeyDown={(e) => {this.handleKeyDown(e)}} 
					// onInput={(e) => {this.props.handleInput(e)}}
					onInput={this.handleInput} 
					value={this.props.currentItem}>
						{this.props.name} 
				</div>
				{/*statusButton*/}
				{childList}
			</div>
		)
	}
}

Item.propTypes = {
	id: React.PropTypes.number,
	name: React.PropTypes.string,
	currentItem: React.PropTypes.object,
	// handleInput: React.PropTypes.func.isRequired
}