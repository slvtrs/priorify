import React, {Component} from 'react'
import {Item} from './Item'
import {addTodo, generateId, removeTodo, findById} from '../../lib/todoHelpers'
import {loadChildren, createTodo, saveTodo, destroyTodo} from '../../lib/todoService'

export class ItemList extends Component {
	state = {
	  items: [],
	  currentItem: {}
	}

	componentDidMount() {
		loadChildren(this.props.id)
			.then(items => this.setState({items}));
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
		// I'm navigating the DOM as if this were jquery, and that feels dirty
		// gotta be bad for performance...
		// instead, I should be manipulating the data
		// and letting each component reredner itself with lifecycle funcs

		var node = this.refs['item-'+index];
		if(node.state.expanded){
			node.refs.list.refs['item-0'].refs.input.focus();
		}
		else {
	    	var item = this.refs['item-'+ (index+1) ];
	    	if (item)
	    		item.refs.input.focus();
	    	else {
	    		this.props.handleFocusOverflow(evt);
	    	}
	    }
	}

	focusNextSibling = (evt, index) => {
		console.log(index);
		var item = this.refs['item-'+ (index+1) ];
		console.log(item);
		if (item)
			item.refs.input.focus();
	}

	handleEnter = (evt, id) => {
	  evt.preventDefault();
	  const newId = generateId();
	  const newItem = {name:'', id: newId, parent: this.props.id, created: Date.now(), updated_at: Date.now()};
	  const updatedTodos = addTodo(this.state.items, newItem, id);
	  this.setState({
	    items: updatedTodos,
	    currentItem: {},
	    errorMessage: ''
	  });
	  createTodo(newItem);
	}

	handleRemove = (evt, id) => {
	  evt.preventDefault()
	  const updatedTodos = removeTodo(this.state.items, id)
	  this.setState({items: updatedTodos})
	  destroyTodo(id);
	}

	handleIndent = (evt, id, index) => {
		evt.preventDefault();
		const item = findById(id, this.state.items);
		item.parent = this.state.items[index-1].id;
		saveTodo(item);
		if(!this.refs['item-'+(index-1)].state.expanded)
			this.refs['item-'+(index-1)].toggleExpand(evt);
	}

	handleUnindent = (evt, id, index) => {
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
			case 'Tab':
				if(this.props.mods.length)
					this.handleUnindent(evt, id, index);
				else
					this.handleIndent(evt, id, index);
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
			  {/*<ul>*/}
			    {this.state.items.map((item, i) => 
			    	<Item key={item.id} 
				    	name={this.props.name}
				    	parent={this.props.id}
				    	parentPos={this.props.position}
				    	position={i}
				    	ref={'item-' + i}
				    	mods={this.props.mods}
				    	expanded={false}
				    	handleNavigation={(e,id,i) => this.handleNavigation(e,id,i)}
				    	handleInput={this.handleInput}
				    	handleFocus={this.handleFocus}
				    	handleFocusParent={this.props.handleFocusParent}
				    	handleFocusNextUncle={this.focusNextSibling}
				    	// currentItem={this.props.currentItem}
				    	caretPos={0}
			    	{...item}/>
			    )}
			  {/*</ul>*/}
			</div>
		)
	}
}

ItemList.propTypes = {
	id: React.PropTypes.number.isRequired,
	mods: React.PropTypes.array.isRequired,
}