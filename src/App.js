import React, { Component } from 'react';
import logo from './logo.svg';
import './App.scss';
import {ItemList, Footer} from './components/todo'
import {loadChildren} from './lib/todoService'

class App extends Component {
  state = {
    children: [],
    currentItem: {},
    mods: [],
  }

  static contextTypes = {
    route: React.PropTypes.string
  }

  componentDidMount() {
    loadChildren(0)
      .then(children => this.setState({children}))
  }

  handleNewItem = (item) => {
    this.showTempMessage('Todo added')
  }

  showTempMessage = (msg) => {
    this.setState({message: msg})
    setTimeout(() => this.setState({message: ''}), 2500)
  }

  handleInput = (evt, id) => {
    var currentItem = {
      id: id,
      name: evt.target.innerHTML
    }
    this.setState({
      currentItem: currentItem
    })
  }

  handleKeyChange = (evt) => {
    var modKeys = ['Meta','Control','Shift','Alt']
    if(modKeys.indexOf(evt.key) === -1) return;

    var mods = this.state.mods;
    var index = mods.indexOf(evt.key);
    if (index === -1)
      mods.push(evt.key);
    else
      mods.splice(index,1);
    this.setState({mods: mods});
  }

  handleKeyUp = (evt) => {
    switch(evt.key) {
      case 'Meta':
        this.setState({meta: false})
      break;
      case 'Control':
        this.setState({control: false})
      break;
      case 'Shift':
        this.setState({meta: false})
      break;
      case 'Alt':
        this.setState({meta: false})
      break;
      default:
      break;
    }
  }

  render() {
    return (
      <div className="App"
        onKeyDown={this.handleKeyChange}
        onKeyUp={this.handleKeyChange}>
        <div className="App-Header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Priorify</h2>
        </div>
        <div className="Todo-App">
          {this.state.errorMessage && <span className='error'>{this.state.errorMessage}</span>}
          {this.state.message && <span className='success'>{this.state.message}</span>}
          <ItemList 
            id={0}
            position={0}
            mods={this.state.mods}
            handleFocusParent={this.test}
            handleFocusOverflow={this.test}
            currentItem={this.state.currentItem}/>
          <Footer/>
        </div>
      </div>
    );
  }
}

export default App;
