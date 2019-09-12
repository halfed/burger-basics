import React, { Component } from 'react';
import Aux from '../../hoc/Auxilary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OderSummary from '../../components/Burger/OderSummary/OderSummary';

const INGREDIENT_PRICES = {
	salad: 0.5, 
	cheese: 0.4,
	meat: 1.3,
	bacon: 0.7
}

class BurgerBuilder extends Component {
	// constuctor(props) {
	// 	super(props);
	// 	this.state = {...}
	// }

	state = {
		ingredients: {
			salad: 0,
			bacon: 0,
			cheese: 0,
			meat: 0
		},
		purchaseable: false,
		totoalPrice: 4,
		purchasing: false
	}

	updatePurchaseState (ingredients) {
		const sum = Object.keys(ingredients)
			.map(igKey => {
				return ingredients[igKey];
			})
			.reduce((sum, el) => {
				return sum + el;
			}, 0);
		this.setState({purchaseable: sum > 0});
	}

	addIngredientHandler = (type) => {
		const oldCount = this.state.ingredients[type];
		const updatedCounted = oldCount + 1;
		const updatedIngredients = {
			...this.state.ingredients
		};
		updatedIngredients[type] = updatedCounted;
		const priceAddition = INGREDIENT_PRICES[type];
		const oldPrice = this.state.totoalPrice;
		const newPrice = oldPrice + priceAddition;
		this.setState({totoalPrice: newPrice, ingredients:updatedIngredients});
		this.updatePurchaseState(updatedIngredients);
	}

	removeIngredientHandler = (type) => {
		const oldCount = this.state.ingredients[type];
		if(oldCount <= 0) {
			return;
		}
		const updatedCounted = oldCount - 1;
		const updatedIngredients = {
			...this.state.ingredients
		};
		updatedIngredients[type] = updatedCounted;
		const priceDeduction = INGREDIENT_PRICES[type];
		const oldPrice = this.state.totoalPrice;
		const newPrice = oldPrice - priceDeduction;
		this.setState({totoalPrice: newPrice, ingredients:updatedIngredients});
		this.updatePurchaseState(updatedIngredients);
	}

	purchaseHandler = () => {
		this.setState({purchasing: true});
	}

	purchasedCancelHandler = () => {
		this.setState({purchasing: false});
	}

	purchasedContinueHandler = () => {
		alert('You Continue');
	}

	render () {
		const disabledInfo = {
			...this.state.ingredients
		}
		for(let key in disabledInfo) {
			disabledInfo[key] = disabledInfo[key] <= 0
		}
		return (
			<Aux>
				<Modal show={this.state.purchasing} modalClosed={this.purchasedCancelHandler}>
					<OderSummary 
						ingredients={this.state.ingredients}
						purchasedCancelled={this.purchasedCancelHandler}
						purchasedContinued={this.purchasedContinueHandler}
					/>
				</Modal>

				<Burger ingredients={this.state.ingredients} />
				<BuildControls
					ingredientAdded ={this.addIngredientHandler}
					ingredientRemoved={this.removeIngredientHandler}
					disabled={disabledInfo}
					purchaseable={this.state.purchaseable}
					ordered={this.purchaseHandler}
					price={this.state.totoalPrice}
				/>
			</Aux>
		);
	}
}

export default BurgerBuilder;