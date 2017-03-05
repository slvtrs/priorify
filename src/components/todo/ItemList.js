import React, {Component} from 'react'
import {Item} from './Item'
// import {getItems, addTodo, generateId, updateTodo, removeTodo} from '../../lib/todoHelpers'
import {addTodo, generateId, removeTodo} from '../../lib/todoHelpers'
// import {loadChildren, createTodo, saveTodo, destroyTodo} from '../../lib/todoService'
import {loadChildren, createTodo, destroyTodo} from '../../lib/todoService'

// export const ItemList = (props) => {
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

	handleUpArrow = (index) => {
		// if (this.state.isExpanded && this.children.length)
	    var item = this.refs['item-'+ (index-1) ];
	    if (!item){
	    	// var parent = this.refs['item-'+ this.props.parent];
	    	// item.refs.input.focus();
	    }
	    else
	    	item.refs.input.focus();
	}

	handleDownArrow = (index) => {
	    var item = this.refs['item-'+ (index+1) ];
	    if (!item) return;
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
	  createTodo(newItem)
	    // .then(() => this.handleNewItem(newItem));
	}

	handleRemove = (evt, id) => {
	  evt.preventDefault()
	  const updatedTodos = removeTodo(this.state.children, id)
	  this.setState({children: updatedTodos})
	  destroyTodo(id)
	    // .then(() => this.showTempMessage('Todo Removed'))
	}

	handleToggle = (id) => {
	  /*const getToggledTodo = pipe(findById, toggleTodo)
	  const updated = getToggledTodo(id, this.state.todos)
	  const getUpdatedTodos = partial(updateTodo, this.state.todos)
	  // const getUpdatedTodos = pipe(findById, toggleTodo, partial(updateTodo, this.state.todos))
	  // pipe 3 functions together
	  // update todo wnats (todos, toggledTodo), so we need to partialls pass in a dif value
	  // const updatedTodos = getUpdatedTodos(id, this.state.todos)
	  const updatedTodos = getUpdatedTodos(updated)
	  this.setState({todos: updatedTodos})
	  saveTodo(updated)
	    .then(() => this.showTempMessage('Todo Updated'))*/
	}

	handleIndent = (evt) => {
	  evt.preventDefault()
	  alert('indent')
	}

	handleUnindent = (evt) => {
	  evt.preventDefault()
	  alert('unindent')
	}

	handleKeyDown = (evt, id, index) => {
		return;
		if(this.props.mods.length)
			switch(evt.key) {
				case 'Enter':
				  this.handleEnter(evt, id)
				break;
				case 'ArrowUp':
					this.handleUpArrow(index);
				break;
				case 'ArrowDown':
					this.handleDownArrow(index);
					// this.handleFocus(index+1);
				break;
				case 'Backspace':
				console.log(this.refs);
					var item = this.refs['item-'+index];
					console.log(item)
					var contents= item.refs.input.innerHTML
					if(contents.length === 0) {
						// evt.preventDefault();
						this.props.handleRemove(evt, id);
						this.handleFocus(index-1);
					}
				break;
				default:
					// update this name
					console.log(evt.key)
				break;
			}
		else
			switch(evt.key) {
				case 'Enter':
				  this.handleEnter(evt, id)
				break;
				case 'ArrowUp':
					this.handleUpArrow(index);
				break;
				case 'ArrowDown':
					this.handleFocus(index+1);
				break;
				case 'Backspace':
					item = this.refs['item-'+index];
					console.log(item)
					contents = item.refs.input.innerHTML
					if(contents.length === 0) {
						evt.preventDefault();
						this.props.handleRemove(evt, id);
						this.handleFocus(index-1);
					}
				break;
				default:
					// update this name
					console.log(evt.key)
				break;
			}
	}

	handleNavigation = (evt, id, index) => {
		// evt.stopPropagation();
		switch(evt.key) {
			case 'Enter':
			  this.handleEnter(evt, id)
			break;
			case 'ArrowUp':
				this.handleUpArrow(index);
			break;
			case 'ArrowDown':
				this.handleFocus(index+1);
			break;
			case 'Backspace':
				// debugger;
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
				    	position={i}
				    	ref={'item-' + i}
				    	mods={this.props.mods}
				    	handleNavigation={(e,id,i) => this.handleNavigation(e,id,i)}
				    	handleInput={this.handleInput}
				    	handleFocus={this.handleFocus}
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
	// children: React.PropTypes.array.isRequired,
	// handleKeyDown: React.PropTypes.func.isRequired
}