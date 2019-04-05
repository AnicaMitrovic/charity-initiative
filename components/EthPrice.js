import React, { Component } from 'react';
import { Label } from 'semantic-ui-react';

class EthPrice extends Component {
	state = {
		ethCurrentPrice: ''
	};

	componentDidMount() {
		setInterval(() => {
			fetch(
				'https://cors-anywhere.herokuapp.com/' +
					'https://api.bittrex.com/api/v1.1/public/getticker?market=USD-ETH'
			)
				.then(data => data.json())
				.then(data => {
					this.setState({ ethCurrentPrice: data.result.Last });
					//console.log(this.state.ethCurrentPrice);
				});
		}, 1000);
	}

	componentWillUnmount() {
		clearInterval(this.timer);
	}

	render() {
		return (
			<div>
				<Label key={'big'} size={'big'} basic color='violet'>
					Ether rate: {this.state.ethCurrentPrice} USD
				</Label>
				<br />
				<br />
			</div>
		);
	}
}

export default EthPrice;
