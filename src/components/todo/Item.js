import React, {Component} from 'react'
import {ItemList} from './ItemList'
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
		this.setState({currentItem});
		this.setState({name: currentItem.name});
		saveTodo( currentItem );
  	}

  	toggleExpand = (evt) => {
  		evt.preventDefault()
  		this.setState({
  			expanded: !this.state.expanded
  		})
  	}

  	handleFocusParent = (evt) => {
  		this.props.handleNavigation(evt, this.props.parent, this.props.parentPos);
  	}

	render(){
		var childList = this.state.expanded ?
			<ItemList className='App-List'
				id={this.props.id}
				position={this.props.position}
				mods={this.props.mods}
				handleFocusParent={this.handleFocusParent}
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
					onInput={this.handleInput} 
					value={this.props.currentItem}>
						{this.props.name} 
				</div>
				{statusButton}
				{childList}
			</div>
		)
	}
}

Item.propTypes = {
	id: React.PropTypes.number.isRequired,
	name: React.PropTypes.string,
	currentItem: React.PropTypes.object,
	mods: React.PropTypes.array.isRequired,
}