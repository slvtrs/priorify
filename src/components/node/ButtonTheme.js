import React, {Component} from 'react'

export class ButtonTheme extends Component {
	state = {
		value: this.props.value
	}

	toggleStyle = () => {
		if(this.props.name === 'color'){
			if(document.body.className.indexOf('theme-light') > -1){
				document.body.className.replace('theme-light','');
				this.setState({value: 'Dark'});
			}
			else {
				document.body.className += ' theme-light';
				this.setState({value: 'Light'});
			}
		}
		else if(this.props.name === 'font'){
			if(document.body.className.indexOf('font-helv') > -1){
				document.body.className.replace('font-helv','');
				this.setState({value: 'Mono'});
			}
			else {
				document.body.className += ' font-helv';
				this.setState({value: 'Helv'});
			}
		}
	}

	render(){
		return (
			<div className={'theme-button ' + this.props.active} onClick={this.toggleStyle}>
				{this.state.value}
			</div>
		)
	}
}

ButtonTheme.propTypes = {
	name: React.PropTypes.string.isRequired,
	active: React.PropTypes.bool.isRequired,
	value: React.PropTypes.string.isRequired
}