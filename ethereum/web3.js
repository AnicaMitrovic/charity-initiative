import Web3 from 'web3';

//const web3 = new Web3(window.web3.currentProvider); //(1)

let web3;

if(typeof window !== 'undefined' && typeof window.web3 !== 'undefined') { //check to see if we are in browser and Meta mask is available
// We are in browser and window == object and metamask is running
    web3 = new Web3(window.web3.currentProvider);
}
else{ //We are on the server OR user is not runnig metamask
//set up our provider that connects to Rinkeby network throw infura
const provider = new Web3.providers.HttpProvider(
    //link , infura url of what network we want our provider to connect to
    'https://rinkeby.infura.io/v3/44ecac187959449cbb2e7d466a3efa36'
    );

    web3 = new Web3(provider);
}

export default web3;