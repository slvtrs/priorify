import React, {Component} from 'react'
import {Item} from './Item'
import {addTodo, generateId, removeTodo} from '../../lib/todoHelpers'
import {loadChildren, createTodo, destroyTodo} from '../../lib/todoService'

export class ItemList extends Component {
	state = {
	  children: [],
	  currentItem: {}
	}

	componentDidMount() {
		loadChildren(this.props.id)
			.then(children => this.setState({children}))
  	}

	handleFocus = (index) => {
	    var item = this.refs['item-'+index];
	    if (!item) return;
	    item.refs.input.focus();
	}

	handleUpArrow = (evt, index) => {
	    var item = this.refs['item-'+ (index-1) ];
	    if (!item)
	    	this.props.handleFocusParent(evt);
	    else
	    	item.refs.input.focus();
	}

	handleDownArrow = (evt, index) => {
	    var item = this.refs['item-'+ (index+1) ];
	    if (!item)
	    	this.props.handleFocusParent(evt);
	    else
	    	item.refs.input.focus();
	}

	handleEnter = (evt, id) => {
	  evt.preventDefault();
	  const newId = generateId();
	  const newItem = {name:'', isCompleted:false, id: newId, parent: this.props.id};
	  const updatedTodos = addTodo(this.state.children, newItem, id);
	  this.setState({
	    children: updatedTodos,
	    currentItem: {},
	    errorMessage: ''
	  });
	  createTodo(newItem);
	}

	handleRemove = (evt, id) => {
	  evt.preventDefault()
	  const updatedTodos = removeTodo(this.state.children, id)
	  this.setState({children: updatedTodos})
	  destroyTodo(id);
	}

	handleIndent = (evt) => {
	  evt.preventDefault()
	  alert('indent')
	}

	handleUnindent = (evt) => {
	  evt.preventDefault()
	  alert('unindent')
	}
	
	handleNavigation = (evt, id, index) => {
		// evt.stopPropagation();
		switch(evt.key) {
			case 'Enter':
			  this.handleEnter(evt, id)
			break;
			case 'ArrowUp':
				this.handleUpArrow(evt, index);
			break;
			case 'ArrowDown':
				this.handleDownArrow(evt, index);
			break;
			case 'Backspace':
				var item = this.refs['item-'+index];
				var contents= item.refs.input.innerHTML
				if(contents.length === 0) {
					evt.preventDefault();
					this.handleRemove(evt, id);
					this.handleFocus(index-1);
				}
			break;
			default:
				// update this name
					// actually, items handle this themselves
				// console.log(evt.key)
			break;
		}
	}

	render() {
		return (
			<div className='App-List' onKeyDown={this.handleKeyDown}>
			  <ul>
			    {this.state.children.map((item, i) => 
			    	<Item key={item.id} 
				    	name={this.props.name}
				    	parent={this.props.id}
				    	parentPos={this.props.position}
				    	position={i}
				    	ref={'item-' + i}
				    	mods={this.props.mods}
				    	handleNavigation={(e,id,i) => this.handleNavigation(e,id,i)}
				    	handleInput={this.handleInput}
				    	handleFocus={this.handleFocus}
				    	handleFocusParent={this.props.handleFocusParent}
				    	// currentItem={this.props.currentItem}
				    	caretPos={0}
			    	{...item}/>
			    )}
			  </ul>
			</div>
		)
	}
}

ItemList.propTypes = {
	id: React.PropTypes.number.isRequired,
	mods: React.PropTypes.array.isRequired,
}