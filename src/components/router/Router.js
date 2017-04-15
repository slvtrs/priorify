import React, {Component} from 'react'

const getCurrentPath = () => {
	const path = document.location.pathname
	return path.substring(path.lastIndexOf('/'))
}

export class Router extends Component {
	state = {
		route: getCurrentPath(),
		mods: []
	}

	componentDidMount = () => {
	  window.addEventListener('focus', this.handleFocus.bind(this));
	}
	handleFocus(e) {
	  this.setState({mods: []}, () => {
	  	console.log('mods cleared');
	  });
	}

	handleLinkClick = (route) => {
		this.setState({route})
		history.pushState(null,'',route)
	}

	checkMods = (evt) => {
		console.log(evt);
		var modKeys = ['Meta','Control','Shift','Alt'];
		if(modKeys.indexOf(evt.key) > -1) {
			var mods = this.state.mods;
			var index = mods.indexOf(evt.key);
			if (index === -1)
				mods.push(evt.key);
			else
				mods.splice(index,1);
			this.setState({mods});
		}
	}

	handleKeyUp = (evt) => {
		var modKeys = ['Meta','Control','Shift','Alt'];
		if(modKeys.indexOf(evt.key) > -1) {
			var mods = this.state.mods;
			var index = mods.indexOf(evt.key);
			if (index > -1) {
				mods.splice(index,1);
				this.setState({mods});
			}
		}
	}

	handleKeyDown = (evt) => {
		var modKeys = ['Meta','Control','Shift','Alt'];
		if(modKeys.indexOf(evt.key) > -1) {
			var mods = this.state.mods;
			var index = mods.indexOf(evt.key);
			if (index === -1) {
				mods.push(evt.key);
				this.setState({mods}, function(){
					console.log(this.state.mods);
				});
			}
		}
	}

	static childContextTypes = {
		route: React.PropTypes.string,
		mods: React.PropTypes.array,
		handleKeyUp: React.PropTypes.func,
		handleKeyDown: React.PropTypes.func,
		linkHandler: React.PropTypes.func
	}

	getChildContext () {
		return {
			route: this.state.route,
			mods: this.state.mods,
			handleKeyUp: this.handleKeyUp,
			handleKeyDown: this.handleKeyDown,
			linkHandler: this.handleLinkClick
		}
	}

	componentDidMount() {
		window.onpopstate = () => {
			this.setState({route: getCurrentPath()})
		}
	}

	render() {
		return <div>{this.props.children}</div>
	}
}