import React from 'react'
import logo from '../../logo.svg';
import {ButtonTheme} from './ButtonTheme'

export const Header = () => {
	return (

		<div className="Header">
			<h2>
				Priorify
				<img src={logo} className="logo" alt="logo" />
			</h2>
			<br/>
			<ButtonTheme name='color' value='Dark' active={true} />
			<ButtonTheme name='font' value='Mono' active={true} />
		</div>
	)
}