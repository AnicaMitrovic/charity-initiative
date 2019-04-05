import web3 from './web3';
import CampaignFactory from './build/FundingFactory.json';

const instance = new web3.eth.Contract(
	JSON.parse(CampaignFactory.interface),
	'0xb786881388E2Ae47190C1b3232561bABB3163994'
);

export default instance;
