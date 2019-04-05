pragma solidity >= 0.4.22 < 0.6.0;

contract FundingFactory {
    address contractOwner;
    address[] public deployedRequestAddress;
    string[] public deployedRequestTitle;

    function createInitiative(string memory _title, string memory _description, uint _goalAmount, string _date) public { //_duration trenutno u minutima
        
        FundingRequest requestInstance = new FundingRequest(_title, _description, _goalAmount, msg.sender, _date);
        deployedRequestAddress.push(address(requestInstance));
        deployedRequestTitle.push(_title);
    }
    
    function getDeployedAddress() public view returns(address[] memory) {
        return deployedRequestAddress;
    }
   
   function getStringsLength() public view returns(uint) {
    return deployedRequestTitle.length;
    }
    
    function getStringByIndex(uint index) public view returns(string memory) {
        if (index < deployedRequestTitle.length){
            return deployedRequestTitle[index];
        }
        return "";
    }
}


contract FundingRequest {
    struct Request {
        string description;
        uint value;
        address recepient;
        bool complete;
        uint approvalCount; // keeps track of numbur of YES votes that this request has received
        mapping(address => bool) approvals; //if someone has voded on given request
    }
    
    Request[] public requests;
    address public  fundingRequestOwner;
    uint public fundingDuration; // do kada se moze uplatiti
    uint public fundingGoal; // in wei
    uint public currentlyRaised; 
    string public title;
    string public description;
    string public date;
    uint public numberOfDonations;
    uint public averageDonation;
    
    struct DonatorsStruct {
        uint amout;
        bool exists;
        bool voted;
     }

    // Mapped Structs with Index
    mapping(address => DonatorsStruct) public donators;
    address[] public donatorsList;
     
    modifier isValidValue(){
        assert(msg.value >= 100 wei);
        _;
    }

    modifier isFundOwner() {
        require(msg.sender == fundingRequestOwner);
        _;
    }
    
    constructor (string memory _title, string memory _description, uint _goalAmount, address  _fundingRequestOwner, string _date) public payable{
        fundingRequestOwner = _fundingRequestOwner;
        fundingGoal = _goalAmount;
        //fundingDuration = block.timestamp + _duration * 1 minutes;
        title = _title;
        description = _description;
        date = _date;
    }
    
    function donateET() public payable isValidValue { 
        
        //require(msg.sender != fundingRequestOwner);
        require(!hasEnded()); 
        
        if(!donators[msg.sender].exists){
            donators[msg.sender].exists = true;
            donatorsList.push(msg.sender);
        }
        
        donators[msg.sender].amout += msg.value; 
        numberOfDonations++;
        
        averageDonation = calculateAverageDonation(msg.value);
        currentlyRaised += msg.value;
    }
    
    function withdrawRaisedAmount() public payable isFundOwner {
        
        if(hasEnded()){
            uint raisedEth = address(this).balance; // this - odnosi se na ovaj contract, na tu adresu odredjenog contrankta se vrse uplate donora
            address(fundingRequestOwner).transfer(raisedEth);
        }
    }
    
    function hasEnded() public view returns(bool success) {
        return currentlyRaised >= fundingGoal /*|| block.timestamp > fundingDuration */;
    }
    
    function calculateAverageDonation(uint _amount) public view returns(uint){
        return (currentlyRaised + _amount)/numberOfDonations;
    }
    
    function getDonatorsCount() public view returns(uint) {
        return donatorsList.length;
    }
    
    function createRequest(string memory _description, uint _value, address _recepient) public isFundOwner {
        Request memory newRequest = Request({
            description: _description,
            value: _value,
            recepient: _recepient,
            complete: false,
            approvalCount: 0
        });
        requests.push(newRequest);
    }
    
    function voteForRequest(uint _index) public { //index of request we are trying to approve
        //we want to manipulate the copy that exists inside of storedge not to make copy in memory
        Request storage request =  requests[_index];
        //two checks, if person has donated money and if person has not already voted
        require(donators[msg.sender].exists); 
        require(!request.approvals[msg.sender]);
        
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }
    
    function finalizeRequest(uint _index) public isFundOwner {
        Request storage request = requests[_index];
        uint donatorsCount = getDonatorsCount();
        // check if this request is not already marked as complete
        require(!request.complete);
        require(request.approvalCount > donatorsCount/2); // at least 51% must vote Yes in order to request to be accepted
        
        request.recepient.transfer(request.value); //send money to recepient - adresa na koju saljemo novac
        request.complete = true;
    }

    function getSummary() public view returns(uint, uint, uint, uint, uint, uint, address, string, string, string){
        uint donatorsCount = getDonatorsCount();
        
        return(
            fundingGoal,
            currentlyRaised,
            address(this).balance,
            numberOfDonations,
            averageDonation,
            donatorsCount,
            fundingRequestOwner,
            description,
            title,
            date
        );
    }

    function getRequestsCount() public view returns(uint) {
        return requests.length;
    }
}