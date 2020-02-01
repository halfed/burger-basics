import React from 'react';
import Burger from '../../Burger/Burger';
import Button from '../../UI/Button/Button';
import classes from './checkoutSummary.css';

const checkoutSummary = (props) => {
	return (
		<div className={classes.checkoutSummary}>
			<h1>We hope it tates well!</h1>
			<div style="width: '300px', height: '300px', margin: 'auto'">
				<Burger ingredients={props.ingredients} />
			</div>
			<Button 
				btnType="Danger"
				clicked>CANCEL</Button>
			<Button 
				btnType="Success"
				clicked>CONTINUE</Button>
		</div>
	)
}