import React, { Component } from 'react';
import Layout from '../../components/Layout';
import { Form, Button, Input, Message, TextArea } from 'semantic-ui-react';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Link, Router } from '../../routes';
import moment from 'moment-timezone';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
//import 'react-datepicker/dist/react-datepicker-cssmodules.css';
class FundingNew extends Component {
	state = {
		fundingGoal: '',
		errorMessage: '',
		loading: false,
		title: '',
		description: '',
		date: ''
	};

	constructor(props) {
		super(props);
		this.state = {
			date: new Date()
		};
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(newDate) {
		this.setState({
			date: newDate
		});
	}

	onSubmit = async event => {
		event.preventDefault;
		this.setState({ loading: true, errorMessage: '' });

		try {
			const accounts = await web3.eth.getAccounts();
			await factory.methods
				.createInitiative(
					this.state.title,
					this.state.description,
					this.state.fundingGoal,
					moment(new Date()).format('DD/MMM/YYYY')
				)
				.send({
					from: accounts[0]
				});

			Router.pushRoute('/');
		} catch (err) {
			this.setState({ errorMessage: err.message });
		}

		this.setState({ loading: false });
	};

	render() {
		console.log('Datetime: ' + moment(new Date()).format('DD/MMM/YYYY'));
		console.log(new Date());
		return (
			<Layout>
				<h3>Create New Charity Funding</h3>

				<Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
					<Form.Field>
						<label>Title for Initiative</label>
						<Input
							value={this.state.title}
							onChange={event => this.setState({ title: event.target.value })}
						/>
					</Form.Field>
					<Form.Field>
						<label>Enter a brief description</label>
						<TextArea
							placeholder='Tell us more'
							style={{ minHeight: 100, minHeight: 100 }}
							value={this.state.description}
							onChange={event =>
								this.setState({ description: event.target.value })
							}
						/>
					</Form.Field>
					<Form.Field>
						<label>Goal amount (in wei)</label>
						<Input
							label='wei'
							labelPosition='right'
							value={this.state.fundingGoal}
							onChange={event =>
								this.setState({ fundingGoal: event.target.value })
							}
						/>
					</Form.Field>
					<Form.Field>
						<label>End time</label>
						<DatePicker
							selected={this.state.date}
							onChange={this.handleChange}
						/>
					</Form.Field>
					<Message error content={this.state.errorMessage} />
					<Button loading={this.state.loading} primary>
						Create
					</Button>
				</Form>
			</Layout>
		);
	}
}

export default FundingNew;
