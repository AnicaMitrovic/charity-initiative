import React, { Component } from 'react';
import { Form, Button, Message, Input } from 'semantic-ui-react';
import Initiative from '../../ethereum/initiative';
import web3 from '../../ethereum/web3';
import { Link, Router } from '../../routes';
import Layout from '../../components/Layout';

class RequestNew extends Component {
	state = {
		value: '',
		description: '',
		recipient: '',
		loading: false,
		errorMessage: '',
		showWarning: false,
		showError: false
	};

	static async getInitialProps(props) {
		const { address } = props.query;

		return { address };
	}

	onSubmit = async event => {
		event.preventDefault();
		const { description, value, recipient } = this.state;

		if (!this.state.description) {
			this.setState({
				showWarning: true
			});
			console.log('in if ');
		} else {
			const initiative = Initiative(this.props.address);

			this.setState({ loading: true, errorMessage: '' });

			try {
				const accounts = await web3.eth.getAccounts();
				await initiative.methods
					.createRequest(
						description,
						web3.utils.toWei(value, 'ether'),
						recipient
					)
					.send({ from: accounts[0] });

				Router.pushRoute(`/initiatives/${this.props.address}`);
			} catch (err) {
				this.setState({ errorMessage: err.message, showError: true });
			}

			this.setState({ loading: false });
		}

		console.log('warning ' + this.state.showWarning);
	};

	hideWarningMsg = () => {
		this.setState({
			showWarning: false
		});
	};

	hideErrorMsg = () => {
		this.setState({
			showError: false
		});
	};

	render() {
		return (
			<Layout>
				<Link route={`/initiatives/${this.props.address}`}>
					<a>Back</a>
				</Link>
				<h3>Create a Request</h3>
				<Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
					<Form.Field>
						<label>Description</label>
						<Input
							value={this.state.description}
							onChange={event =>
								this.setState({ description: event.target.value })
							}
						/>
					</Form.Field>

					<Form.Field>
						<label>Value in Ether</label>
						<Input
							value={this.state.value}
							onChange={event => this.setState({ value: event.target.value })}
						/>
					</Form.Field>

					<Form.Field>
						<label>Recipient</label>
						<Input
							value={this.state.recipient}
							onChange={event =>
								this.setState({ recipient: event.target.value })
							}
						/>
					</Form.Field>
					{this.state.showWarning ? (
						<Message
							error
							onDismiss={this.hideWarningMsg}
							header='Description field cannot be empty'
							content='Provide more information through the description about where will money be sent'
						/>
					) : null}
					{this.state.showError ? (
						<Message
							error
							header='Oops!'
							content={this.state.errorMessage}
							onDismiss={this.hideErrorMsg}
						/>
					) : null}

					<Button primary loading={this.state.loading}>
						Create!
					</Button>
				</Form>
			</Layout>
		);
	}
}

export default RequestNew;
