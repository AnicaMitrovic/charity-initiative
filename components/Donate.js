import React, { Component } from 'react';
import { Form, Input, Message, Button, Grid } from 'semantic-ui-react';
import Initiative from '../ethereum/initiative';
import web3 from '../ethereum/web3';
import { Router } from '../routes';

class Donate extends Component {
	state = {
		value: '',
		errorMessage: '',
		loading: false,
		showError: false
	};

	onSubmit = async event => {
		event.preventDefault();

		const initiative = Initiative(this.props.address);

		this.setState({ loading: true, errorMessage: '' });

		try {
			const accounts = await web3.eth.getAccounts();
			await initiative.methods.donateET().send({
				from: accounts[0],
				value: web3.utils.toWei(this.state.value, 'ether')
			});

			console.log('Adresa url: ' + this.props.address);
			Router.replaceRoute(`/initiatives/${this.props.address}`);
		} catch (err) {
			this.setState({ errorMessage: err.message, showError: true });
		}

		this.setState({ loading: false, value: '' });
	};

	hideErrorMsg = () => {
		this.setState({
			showError: false
		});
	};

	render() {
		return (
			<Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
				<Form.Field>
					<label>Amount to Donate</label>
					<Input
						value={this.state.value}
						onChange={event => this.setState({ value: event.target.value })}
						label='ether'
						labelPosition='right'
					/>
				</Form.Field>
				{this.state.showError ? (
					<Message
						error
						header='Oops!'
						content={this.state.errorMessage}
						onDismiss={this.hideErrorMsg}
					/>
				) : null}
				<Grid>
					<Grid.Row>
						<Grid.Column width={10} />
						<Grid.Column width={6}>
							<Button color='violet' loading={this.state.loading}>
								Donate
							</Button>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</Form>
		);
	}
}

export default Donate;
