import React, { Component } from 'react';
import Aux from '../../hoc/Auxilary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OderSummary from '../../components/Burger/OderSummary/OderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

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
		ingredients: null,
		purchaseable: false,
		totoalPrice: 4,
		purchasing: false,
		loading: false,
		error: false
	}

	componentDidMount() {
		axios.get('https://burger-builder-39f08.firebaseio.com/ingredients.json')
			.then(response => {
				this.setState({ingredients: response.data});
			})
			.catch(error => {
				this.setState({error: true});
			});
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
		//alert('You Continue');
		this.setState({loading: true});
		const order = {
			ingredients: this.state.ingredients,
			price: this.state.totoalPrice,
			customr: {
				name: 'Ed Wince',
				address: {
					street: 'test street',
					zipCode: '80329',
					country: 'US'
				},
				email: 'test@gmail.com',
			},
			deliveryMethod: 'fastest'
		}

		axios.post('/orders.json', order)
			.then(response=> {
				this.setState({loading: false, purchasing: false});
			})
			.catch(error=> {
				this.setState({loading: false, purchasing: false});
			});
	}

	render () {
		const disabledInfo = {
			...this.state.ingredients
		}
		for(let key in disabledInfo) {
			disabledInfo[key] = disabledInfo[key] <= 0
		}
		let orderSummary = null;

		let burger = this.state.error ? <p>Ingredients can't be loaded!</p> : <Spinner />;

		if(this.state.ingredients) {
			burger = (
				<Aux>
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
			orderSummary = <OderSummary 
				ingredients={this.state.ingredients}
				price={this.state.totoalPrice}
				purchasedCancelled={this.purchasedCancelHandler}
				purchasedContinued={this.purchasedContinueHandler}/>;
		}

		if(this.state.loading) {
			orderSummary = <Spinner />;
		}

		return (
			<Aux>
				<Modal show={this.state.purchasing} modalClosed={this.purchasedCancelHandler}>
					{orderSummary}
				</Modal>
				{burger}
				
			</Aux>
		);
	}
}

export default withErrorHandler(BurgerBuilder, axios);