import React, { Component } from 'react';
import { Button, Table } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import Initiative from '../ethereum/initiative';
import { Router } from '../routes';

class RequestRow extends Component {
	onApprove = async () => {
		const initiative = Initiative(this.props.address);
		const accounts = await web3.eth.getAccounts();
		console.log(this.props.id);
		await initiative.methods.voteForRequest(this.props.id).send({
			from: accounts[0]
		});
		console.log('Adresa url: ' + this.props.address);
		Router.pushRoute(`/initiatives/${this.props.address}`);
	};

	onFinalize = async () => {
		const initiative = Initiative(this.props.address);
		const accounts = await web3.eth.getAccounts();
		console.log('Id zahteva: ' + this.props.id);
		await initiative.methods.finalizeRequest(this.props.id).send({
			from: accounts[0]
		});

		Router.pushRoute(`/initiatives/${this.props.address}`);
	};

	render() {
		const { Row, Cell } = Table;
		const { id, request, donatorsCount } = this.props;
		const readyToFinalize = request.approvalCount > donatorsCount / 2;

		return (
			<Row
				disabled={request.complete}
				positive={readyToFinalize && !request.complete}>
				<Cell>{id}</Cell>
				<Cell>{request.description}</Cell>
				<Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>
				<Cell>{request.recepient}</Cell>
				<Cell>
					{request.complete ? (
						<p>>50%</p>
					) : (
						<p>
							{request.approvalCount}/{donatorsCount}
						</p>
					)}
				</Cell>
				<Cell>
					{request.complete ? (
						<i className='large green checkmark icon' />
					) : (
						<Button color='green' basic onClick={this.onApprove}>
							Approve
						</Button>
					)}
				</Cell>
				<Cell>
					{request.complete ? (
						<i className='large green checkmark icon' />
					) : (
						<Button color='teal' basic onClick={this.onFinalize}>
							Finalize
						</Button>
					)}
				</Cell>
			</Row>
		);
	}
}

export default RequestRow;
