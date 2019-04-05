const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/FundingFactory.json');

const provider = new HDWalletProvider(
	//unlock account with mnemonic
	'distance mystery intact detect because six icon pupil blame auto slogan disagree',
	//link , infura url of what network we want our provider to connect to
	'https://rinkeby.infura.io/v3/44ecac187959449cbb2e7d466a3efa36'
);

const web3 = new Web3(provider);

const deploy = async () => {
	const accounts = await web3.eth.getAccounts();

	console.log('Attempting to deploy from account', accounts[0]);

	const result = await new web3.eth.Contract(
		JSON.parse(compiledFactory.interface)
	)
		.deploy({ data: compiledFactory.bytecode })
		.send({ gas: '1940000', from: accounts[0] });

	console.log('Contract deployed to', result.options.address);
};
deploy();
