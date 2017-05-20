import React, {Component} from 'react'
import {NodeList} from './NodeList'
import {ButtonExpand} from './ButtonExpand'
import {ButtonStatus} from './ButtonStatus'
import {loadChildren, saveTodo} from '../../lib/todoService'

export class Node extends Component {
	state = {
    	expanded: this.props.expanded || false,
    	status: this.props.status || 'open',
    	childCount: 0
  	}

  	static contextTypes = {
  		mods: React.PropTypes.array
  	}

  	componentDidMount() {
  		loadChildren(this.props.id)
  			.then(nodes => this.setState({childCount: nodes.length}));
  			
  		this.refs.input.focus();

		// window.addEventListener('focus', this.handleWindowFocus.bind(this));
	}
	handleWindowFocus(e) {
	  this.refs.input.focus();
	  // this.handleFocus();
	}

	componentWillUnmount() {
		this.props.handleFocus(null, this.props.position-1, 999999);
	}

	componentWillUpdate() {
		// console.log(this.props.id, 'will update')
	}

	componentDidUpdate() {
		// console.log(this.props.name, 'did updte!')
	}

	handleKeyDown (evt) {
		var myNavigationKeys = ['.', 'Enter'];
		var navigationKeys = ['ArrowUp','ArrowDown','Enter','Backspace','Tab'];
		console.log(this.context.mods);
		if (this.context.mods.indexOf('Meta') > -1) {
			if(evt.key === 'd'){
				evt.preventDefault();
				this.refs.input.innerHTML += ' ' +  new Date().toLocaleString();
				this.setState({
					name: this.refs.input.innerHTML
				}, function(){
					this.saveNode(true);
				});
			}
			else if(evt.key === 'ArrowUp'){
				// jump to first node
			}
			else if(evt.key === 'ArrowDown'){
				// jump to last node
			}
			else if (myNavigationKeys.indexOf(evt.key) > -1)
				this.handleMyNavigation(evt, this.props.id, this.props.position);
		}
		else if (this.context.mods.indexOf('Alt') > -1) {
			// nodeList controls (jump to parent)
			if(evt.key === 'ArrowUp')
				console.log('jump to parent node');
			else if(evt.key === 'ArrowDown')
				console.log('jump to next uncle');
		}
		else if (this.context.mods.length) {
			if (myNavigationKeys.indexOf(evt.key) > -1)
				this.handleMyNavigation(evt, this.props.id, this.props.position);
		}
		else if (navigationKeys.indexOf(evt.key) > -1) {
				this.props.handleNavigation(evt, this.props.id, this.props.position, this);
		}
	}

	handleMyNavigation = (evt, id, position) => {
		switch(evt.key) {
			case '.':
			  this.toggleExpand(evt);
			break;
			case 'Enter':
				if (this.context.mods.indexOf('Meta') > -1)
					this.cycleStatus(evt);
				else if (this.context.mods.indexOf('Shift') > -1)
					this.implode(evt);
			break;
			default:
			break;
		}
	}

  	handleArrowDown = () => {
	    var node = this.refs['node-1'];
	    if (!node) return;
	    node.refs.input.focus();
	    alert('why')
	}

	saveNode = ( update ) => {
		const node = {
			id: this.props.id,
			name: this.refs.input.innerHTML,
			status: this.state.status,
			expanded: this.state.expanded,
			parent: this.props.parent,
			position: this.props.position,
			updated: update ? Date.now() : this.state.updated,
			created: this.props.created
		};
		console.log(node);
		saveTodo( node );
	}

  	handleInput = (evt, id) => {
  		if(this.refs.input.innerHTML === this.state.name)
  			return;
  		this.setState({
  			name: this.refs.input.innerHTML
  		}, function(){
  			this.saveNode(true);
  		});
  	}

  	toggleExpand = (evt) => {
  		evt.preventDefault();
  		this.setState({
  			expanded: !this.state.expanded
  		}, function(){
  			this.saveNode(false);	
  		});
  	}

  	cycleStatus = (evt) => {
  		evt.preventDefault();
  		const statuses = ['default','open','complete','closed','disabled'];
  		let i = statuses.indexOf(this.state.status);
  		i = i === statuses.length-1 ? 0 : i+1;
  		this.setState({
  			status: statuses[i]
  		}, function(){
  			this.saveNode(true);
  		});
  	}

  	implode = (evt) => {
  		// evt.preventDefault();
  		if(!this.state.expanded) this.toggleExpand(evt);
  		this.props.handleImplode(evt, this.props.id, this.props.position, this);
  	}

  	handleFocus = (evt, caret) => {
  		console.log('node handle focus');
  		evt.preventDefault();
  		var caretPos = caret || window.getSelection().anchorOffset;

  		this.refs.input.focus();

    	var el = this.refs.input;
    	var range = document.createRange();
    	var sel = window.getSelection();
    	range.setStart(el.childNodes[0], caretPos);
    	range.collapse(true);
    	sel.removeAllRanges();
    	sel.addRange(range);
  	}

  	handleFocusOverflow = (evt) => {
  		this.props.handleFocusNextUncle(evt, this.props.position);
  	}

  	handleEnterFromBottom = (evt) => {
		// var node = this.refs['node-'+index];
		// if(node.state.expanded){
		// 	node.refs.list.refs['node-0'].refs.input.focus();
		// }
		// else {
	 //    	var node = this.refs['node-'+ (index+1) ];
	 //    	if (node)
	 //    		node.refs.input.focus();
	 //    	else {
	 //    		this.props.handleFocusOverflow(evt);
	 //    	}
	 //    }
  	}

	render(){
		var childList = this.state.expanded ?
			<NodeList className='App-List'
				id={this.props.id}
				ref='list'
				position={this.props.position}
				mods={this.props.mods}
				handleFocusParent={this.handleFocus}
				handleFocusOverflow={this.handleFocusOverflow}/>
			: '';
		return (
			<div className='App-Node'>
				<ButtonExpand handleToggleExpand={this.toggleExpand} expanded={this.state.expanded} count={this.state.childCount} />
				<div className={'App-Input ' +  this.state.status}
					contentEditable='true'
					suppressContentEditableWarning='true'
					ref='input'
					onKeyDown={(e) => { this.handleKeyDown(e); }}
					onInput={this.handleInput} >
						{this.props.name}
				</div>
				<ButtonStatus handleCycleStatus={this.cycleStatus} status={this.state.status} />
				{childList}
			</div>
		)
	}
}

Node.propTypes = {
	id: React.PropTypes.number.isRequired
}