import React from 'react'
// import {Link} from '../router'
import {Button} from './Button'

export const Footer = () => {
	return (
		<div className='Footer'>
			<Button to='/' name='All'/>
			<Button to='/' name='Open'/>
			<Button to='/' name='Pending'/>
			<Button to='/' name='Closed'/>
			<p style={{color:'white',fontSize:10}}>
				Sort by: Created, Edited (each generation)
			</p>
			{/*<Link to='/active'>Active</Link>*/}
			{/*<Link to='/complete'>Complete</Link>*/}
		</div>
	)
}