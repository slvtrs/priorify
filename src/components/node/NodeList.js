import React, {Component} from 'react'
import {Node} from './Node'
import {addTodo, updateNode, generateId, removeTodo, findById, filterByStatus} from '../../lib/todoHelpers'
import {loadChildren, loadStatus, createTodo, saveTodo, saveChildNodes, destroyTodo} from '../../lib/todoService'

export class NodeList extends Component {
	state = {
		nodes: [],
		// filter: this.context.route.slice(1),
	}

	static contextTypes = {
		route: React.PropTypes.string,
		mods: React.PropTypes.array,
		linkHandler: React.PropTypes.func
	}

	componentDidMount(){
		let filter = this.context.route.slice(1);
		if(this.props.id === 0 && filter)
			loadStatus(filter)
				.then(nodes => this.setState({nodes}, function(){
					console.log(filter, this.state.nodes);
				}));
		else
			loadChildren(this.props.id, filter)
				.then(nodes => this.setState({nodes}));
  	}

  	shouldComponentUpdate(){
  	// componentWillUpdate(){
  		// console.log('lifecycle test', this.state.nodes);
  		return true;
  	}

	handleFocus = (evt, index, caret) => {
		if (evt) evt.preventDefault();
	    var node = this.refs['node-'+index];
	    if (!node) return;

	    var caretPos = caret || window.getSelection().anchorOffset;

	    node.refs.input.focus();

	    console.log('focous caret:' + caretPos);

    	var el = node.refs.input;
    	if(el.childNodes.length){
	    	var range = document.createRange();
	    	var sel = window.getSelection();
	    	caretPos = caretPos > el.childNodes[0].length ? el.childNodes[0].length : caretPos;
	    	range.setStart(el.childNodes[0], caretPos);
	    	range.collapse(true);
	    	sel.removeAllRanges();
	    	sel.addRange(range);
	    }
	}

	handleUpArrow = (evt, index) => {
	    var node = this.refs['node-'+ (index-1) ];
	    if (!node)
	    	this.props.handleFocusParent(evt);
	    else if(node.state.expanded && Object.keys(node.refs.list.refs).length){
	    	console.log(node)
	    	var nephewList = node.refs.list.refs;
	    	var lastIndex = Object.keys(nephewList).length - 1;
	    	node.refs.list.refs['node-'+lastIndex].refs.input.focus();
	    	// use this.handleFocus() instead
	    }
	    else
	    	this.handleFocus(evt, index-1);
	}

	handleDownArrow = (evt, index) => {
		// I'm navigating the DOM as if this were jquery, and that feels dirty
		// gotta be bad for performance...
		// instead, I should be manipulating the data
		// and letting each component reredner itself with lifecycle funcs

		var node = this.refs['node-'+index];
		if(node.state.expanded && Object.keys(node.refs.list.refs).length){
			node.refs.list.refs['node-0'].refs.input.focus();
			// use this.handleFocus() instead
		}
		else {
	    	node = this.refs['node-'+ (index+1) ];
	    	if (node)
	    		this.handleFocus(evt, index+1);
	    	else {
	    		this.props.handleFocusOverflow(evt);
	    	}
	    }
	}

	focusNextSibling = (evt, index) => {
		var node = this.refs['node-'+ (index+1) ];
		if (node)
			this.handleFocus(evt, index+1);
	}

	focusPreviousSibling = (evt, index) => {
		var node = this.refs['node-'+ (index-1) ];
		if (node)
			this.handleFocus(evt, index-1);
	}

	handleEnter = (evt, id, index) => {
		evt.preventDefault();
		const newId = generateId();
		let caretPos = window.getSelection().anchorOffset;

		if(caretPos == 0){
			const newNode = {name:'', id: newId, parent: this.props.id, created: Date.now(), updated: Date.now()};
			const updatedTodos = addTodo(this.state.nodes, newNode, id-1, index-1);
			this.setState({nodes: updatedTodos});
			for(let u of updatedTodos)
				saveTodo(u);
			// saveChildNodes(updatedTodos);
			createTodo(newNode);
		}
		else {
			const newNode = {name:'', id: newId, parent: this.props.id, created: Date.now(), updated: Date.now()};
			const updatedTodos = addTodo(this.state.nodes, newNode, id, index);
			this.setState({nodes: updatedTodos});
			// saveChildNodes(updatedTodos);
			for(var u of updatedTodos)
				saveTodo(u);
			createTodo(newNode);
		}
	}

	handleRemove = (evt, id) => {
	  evt.preventDefault()
	  const updatedTodos = removeTodo(this.state.nodes, id)
	  this.setState({nodes: updatedTodos});
	  destroyTodo(id);
	}

	handleIndent = (evt, id, index, passedNode) => {
		console.log('indent this node', passedNode);
		evt.preventDefault();
		let node = findById(id, this.state.nodes);
		node.parent = this.state.nodes[index-1].id;
		console.log('node has new parent', node);

		const updatedList = removeTodo(this.state.nodes, id);
		this.setState({nodes: updatedList});
		console.log('finished nodes', this.state.nodes);
		saveTodo(node);

		// let parent = this.state.nodes.find(parent => parent.id === node.parent);
		// parent.expanded = true;

		if(!this.refs['node-'+(index-1)].state.expanded){
			this.refs['node-'+(index-1)].toggleExpand(evt);
		}
	}

	handleMoveUp = (evt, node) => {
		// debugger;
		evt.preventDefault();
		node.position--;
		const nodes = updateNode(this.state.nodes, node);
		this.setState({nodes});
		saveTodo(node);
	}

	handleMoveDown = (evt, node) => {
		evt.preventDefault();
		node.position++;
		const nodes = updateNode(this.state.nodes, node);
		this.setState({nodes});
		saveTodo(node);
	}

	handleUnindent = (evt, id, index) => {
	  evt.preventDefault()
	  alert('unindent')
	}

	handleImplode = (evt, id, index, node) => {
		console.log(index);
		evt.preventDefault();
		debugger;
		
		// this.handleRemove(evt, id);
		let updatedTodos = removeTodo(this.state.nodes, id)
		this.setState({nodes: updatedTodos});
		console.log(this.state.nodes);

		const newId = generateId();
		const newNode = {name:'', id: newId, parent: this.props.id, created: Date.now(), updated: Date.now(), position: index};
		updatedTodos = addTodo(this.state.nodes, newNode, id-1, index-1);
		this.setState({nodes: updatedTodos});
		for(let u of updatedTodos)
			saveTodo(u);
		createTodo(newNode);

		node.position = 0;

		console.log(this.state.nodes);

		this.handleIndent(evt, id, index + 1, node);
	}
	
	handleNavigation = (evt, id, index, node) => {
		switch(evt.key) {
			case 'Enter':
			  this.handleEnter(evt, id, index)
			break;
			case 'ArrowUp':
				if(this.context.mods.length)
					this.handleMoveUp(evt, node);
				else
					this.handleUpArrow(evt, index);
			break;
			case 'ArrowDown':
				if(this.context.mods.length)
					this.handleMoveDown(evt, node);
				else
					this.handleDownArrow(evt, index);
			break;
			case 'Backspace':
				var node = this.refs['node-'+index];
				var contents = node.refs.input.innerHTML;
				if(contents.length === 0) {
					evt.preventDefault();
					this.handleRemove(evt, id);
					if(index===0)
						this.handleFocus(null, index-1, 999999);
					else{
						debugger;
						this.props.handleFocusParent(evt, 9999999);
						// this.focusPreviousSibling(evt, index);
					}
				}
			break;
			case 'Tab':
				if(this.context.mods.length)
					this.handleUnindent(evt, id, index);
				else
					this.handleIndent(evt, id, index, node);
			break;
			default:
			break;
		}
	}

	render() {
  		let filter = this.context.route.slice(1);
  		let filteredNodes = filterByStatus(this.state.nodes, filter);
  		filteredNodes = this.state.nodes;
		return (
			<div className='App-List' onKeyDown={this.handleKeyDown}>
			    {filteredNodes.map((node, i) => 
			    	<Node key={node.id} 
			    		{...node}
				    	name={node.name}
				    	parent={this.props.id}
				    	parentPos={this.props.position}
				    	position={i}
				    	ref={'node-'+i}
				    	status={node.status}
				    	expanded={node.expanded}
				    	created={node.created}
				    	handleNavigation={this.handleNavigation}
				    	handleInput={this.handleInput}
				    	handleFocus={this.handleFocus}
				    	handleFocusParent={this.props.handleFocusParent}
				    	handleFocusNextUncle={this.focusNextSibling}
				    	handleImplode={this.handleImplode}
				    />
			    )}
			</div>
		)
	}
}

NodeList.propTypes = {
	id: React.PropTypes.number.isRequired
}