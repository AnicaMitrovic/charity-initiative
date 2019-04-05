import web3 from './web3';
import CrowdFundInitiative from './build/FundingRequest.json';

export default (address) => {
    return new web3.eth.Contract(
        JSON.parse(CrowdFundInitiative.interface),
        address
      );
};
  