import React, { Component } from 'react';
import { Button, Table, Tab } from 'semantic-ui-react';
import { Link } from '../routes';
import Initiative from '../ethereum/initiative';
import RequestRow from './RequestRow';
import web3 from '../ethereum/web3';
import { Router } from '../routes';

class Requests extends Component {
	state = {
		address: '',
		requests: '',
		donatorsCount: 0,
		showWarning: false
	};

	componentWillMount() {
		this.setState({
			address: this.props.address,
			requests: this.props.requests,
			donatorsCount: this.props.donatorsCount
		});
	}

	//helper method
	renderRows() {
		return this.props.requests.map((req, index) => {
			return (
				<RequestRow
					key={index}
					id={index}
					request={req}
					address={this.props.address}
					donatorsCount={this.props.donatorsCount}
				/>
			);
		});
	}

	hideWarningMsg = () => {
		this.setState({
			showWarning: false
		});
	};

	handleRequest = async () => {
		console.log('TEST');
		try {
			const initiative = Initiative(this.props.address);
			const accounts = await web3.eth.getAccounts();
			const ownerAddress = await initiative.methods
				.fundingRequestOwner()
				.call();
			console.log(ownerAddress + ' ' + accounts[0]);
			if (ownerAddress != accounts[0]) {
				this.setState({
					showWarning: true
				});
			} else {
				Router.pushRoute(`/initiatives/${this.props.address}/request`);
			}
		} catch (err) {
			this.setState({ errorMessage: err.message });
		}
	};

	render() {
		const { Header, Row, HeaderCell, Body } = Table;

		return (
			<div>
				<h3>Requests</h3>
				{this.state.showWarning ? (
					<div className='ui warning message'>
						<i className='close icon' onClick={this.hideWarningMsg} />
						<div className='header'>Not an Initiative owner</div>
						Request can be added only from address that createt this Charity
						Initiative
					</div>
				) : null}
				<Button
					color='violet'
					floated='right'
					style={{ marginBottom: 10 }}
					onClick={this.handleRequest}>
					Add request
				</Button>

				<Table>
					<Header>
						<Row>
							<HeaderCell>ID</HeaderCell>
							<HeaderCell>Description</HeaderCell>
							<HeaderCell>Amount</HeaderCell>
							<HeaderCell>Receptient</HeaderCell>
							<HeaderCell>Approval Count</HeaderCell>
							<HeaderCell>Approve</HeaderCell>
							<HeaderCell>Finalize</HeaderCell>
						</Row>
					</Header>
					<Body>{this.renderRows()}</Body>
				</Table>
			</div>
		);
	}
}

export default Requests;
