import React, { Component } from 'react';
import './App.scss';
import {NodeList, Footer, Header} from './components/node'
// import {loadChildren} from './lib/todoService'

class App extends Component {
	state = {}

	static contextTypes = {
		route: React.PropTypes.string,
		mods: React.PropTypes.array,
		handleKeyDown: React.PropTypes.func,
		handleKeyUp: React.PropTypes.func
	}

	componentDidMount = () => {
		// loadChildren(0)
		// 	.then(children => this.setState({children}));
	 }

	handleNewItem = (item) => {
		this.showTempMessage('Todo added')
	}

	showTempMessage = (msg) => {
		this.setState({message: msg})
		setTimeout(() => this.setState({message: ''}), 2500)
	}

	checkForModKeys = (evt) => {
		var modKeys = ['Meta','Control','Shift','Alt']
		if(modKeys.indexOf(evt.key) > -1) {
			var mods = this.context.mods;
			var index = mods.indexOf(evt.key);
			if (index === -1)
				mods.push(evt.key);
			else
				mods.splice(index,1);
			this.setState({mods});
		}
	}

	render() {
		return (
			<div className="App" onKeyDown={this.context.handleKeyDown}
				onKeyUp={this.context.handleKeyUp}>
				<Header/>
				<div className="Todo-App">
					{this.state.errorMessage && <span className='error'>{this.state.errorMessage}</span>}
					{this.state.message && <span className='success'>{this.state.message}</span>}
					<NodeList 
						id={0}
						position={0}
						handleFocusParent={this.test}
						handleFocusOverflow={this.test} />
					<Footer/>
				</div>
			</div>
		);
	}
}

export default App;
