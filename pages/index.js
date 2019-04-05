import React, { Component } from 'react';
import factory from '../ethereum/factory';
import {
	Card,
	Button,
	Header,
	Icon,
	Container,
	Divider
} from 'semantic-ui-react';
import Layout from '../components/Layout';
import { Link } from '../routes';

class FundingIndex extends Component {
	static async getInitialProps() {
		//Next requires this method, it wants to retrieve initial data without rendering component
		const initiatives = await factory.methods.getDeployedAddress().call();
		const listLength = await factory.methods.getStringsLength().call();
		let titles = [];
		let recentInitiatives = [];

		for (let i = listLength - 1; i > listLength - 3; i--) {
			const title = await factory.methods.getStringByIndex(i).call();
			titles.push(title);
			recentInitiatives.push(initiatives[i]);
		}

		return { recentInitiatives, titles, listLength };
	}

	renderInitiatives() {
		let i = 0;
		const items = this.props.recentInitiatives.map(address => {
			return {
				header: this.props.titles[i++],
				description: (
					<Link route={`/initiatives/${address}`}>
						<a>{address}</a>
					</Link>
				),
				fluid: true
			};
		});
		return <Card.Group centered items={items} />;
	}

	render() {
		return (
			<Layout>
				<Header
					as='h1'
					content='Blockchain Charity Foundation'
					style={{
						fontSize: '4em',
						fontWeight: 'normal',
						marginBottom: '1em',
						marginTop: '1em',
						textAlign: 'center'
					}}
				/>
				<div className='ui container center aligned'>
					<Header
						as='h2'
						content='Transparent blockchain-based charity donation platform'
						style={{
							fontSize: '2em',
							fontWeight: 'normal',
							marginBottom: '1.5em',
							marginTop: 0,
							textAlign: 'center'
						}}
					/>
					<Button.Group size='huge' style={{ marginBottom: '3em' }}>
						<Link href='/show'>
							<a>
								<Button inverted color='violet' style={{ marginBottom: '3em' }}>
									Become a Donor
								</Button>
							</a>
						</Link>
						<Button.Or />
						<Link href='/initiatives/new'>
							<a>
								<Button
									inverted
									color='violet'
									positive
									style={{ marginBottom: '3em' }}>
									Create Initiative
								</Button>
							</a>
						</Link>
					</Button.Group>
				</div>
				<Divider section />
				{this.props.listLength === 0 ? null : (
					<div>
						<h3 style={{ marginBottom: '2em' }}>Most recent Initiatives</h3>
						{this.renderInitiatives()}
						<br />
						<div className='ui container center aligned'>
							<Link href={`/show`}>
								<a>
									<Button
										size='medium'
										color='violet'
										style={{ marginTop: '1em', marginBottom: '3em' }}>
										View More
										<Icon name='right arrow' />
									</Button>
								</a>
							</Link>
						</div>
					</div>
				)}

				<Divider section />
			</Layout>
		);
	}
}

export default FundingIndex;
