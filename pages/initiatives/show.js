import React, { Component } from 'react';
import { Label, Grid, Button, Divider, Row, Table } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import Initiative from '../../ethereum/initiative';
import web3 from '../../ethereum/web3';
import Donate from '../../components/Donate';
import EthPrice from '../../components/EthPrice';
import { Link } from '../../routes';
import Requests from '../../components/Requests';

class InitiativeShow extends Component {
	static async getInitialProps(props) {
		//console.log(props.query.address);
		const { address } = props.query;
		const initiative = Initiative(address);
		const requestCount = await initiative.methods.getRequestsCount().call();
		const requests = await Promise.all(
			Array(parseInt(requestCount))
				.fill() //gives list of all different indexes for
				.map((element, index) => {
					return initiative.methods.requests(index).call();
				})
		);

		const summary = await initiative.methods.getSummary().call();

		return {
			address: props.query.address,
			fundingGoal: summary[0],
			currentlyRaised: summary[1],
			numberOfDonations: summary[3],
			averageDonation: summary[4],
			donatorsCount: summary[5],
			fundOwner: summary[6],
			description: summary[7],
			title: summary[8],
			date: summary[9],
			requests
		};
	}

	render() {
		return (
			<Layout>
				<br />
				<div className='ui segment'>
					<h2 className='ui left floated header'>{this.props.title}</h2>
					<div className='ui clearing divider' />
					<div className='ui right floated statistic'>
						<div className='value'>{this.props.numberOfDonations}</div>
						<div className='label'>Donations</div>
					</div>
					<p>{this.props.description}</p>
					<br />
					<Link
						href={`https://rinkeby.etherscan.io/address/${this.props.address}`}>
						{this.props.address}
					</Link>
				</div>
				<div
					className='ui statistics mini container center'
					style={{ marginTop: '2em' }}>
					<div className='statistic'>
						<div className='value'>{this.props.date}</div>
						<div className='label'>Started date</div>
					</div>
					<div className='statistic'>
						<div className='value'>
							{web3.utils.fromWei(this.props.fundingGoal, 'ether')} ETH
						</div>
						<div className='label'>Goal amount</div>
					</div>
					<div className='statistic'>
						<div className='value'>
							{web3.utils.fromWei(this.props.currentlyRaised, 'ether')} ETH
						</div>
						<div className='label'>Currently raised</div>
					</div>
				</div>
				<Divider section />
				<Grid>
					<Grid.Row>
						<Grid.Column width={11}>
							<EthPrice />
							<div>
								<Label key={'big'} size={'big'} basic color='violet'>
									Average donation:{' '}
									{web3.utils.fromWei(this.props.averageDonation, 'ether')} ETH
								</Label>
							</div>
						</Grid.Column>
						<Grid.Column width={5}>
							<Donate address={this.props.address} />
						</Grid.Column>
					</Grid.Row>
				</Grid>
				<Divider section />
				<Requests
					address={this.props.address}
					donatorsCount={this.props.donatorsCount}
					requests={this.props.requests}
				/>
				<br />
				<Divider section />
			</Layout>
		);
	}
}

export default InitiativeShow;
