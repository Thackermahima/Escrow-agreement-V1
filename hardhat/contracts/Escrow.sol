// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Escrow{
    struct agreementStruct {
        uint agreementId;
        address payable serviceProvider;
        address payable client;
        uint amount;
        bool amountReleased;
        bool cancelled;
    }
    uint256 public totalAgreementCount;

mapping(uint => agreementStruct) escrows;
    function createEscrowAgreement(address payable _serviceProvider, uint256  _agreementId, address payable _client) public payable{
     require(_client != address(0) && _serviceProvider != address(0),"Invalid client or service provider address");
     require(msg.value > 0, "Amount cannot be zero!");

      agreementStruct storage escrowAgreement = escrows[totalAgreementCount];
      escrowAgreement.agreementId = _agreementId;
      escrowAgreement.amount = msg.value;
      escrowAgreement.client = _client;
      escrowAgreement.amountReleased = false;
      escrowAgreement.serviceProvider = _serviceProvider;

      totalAgreementCount++;
    } 
    function releaseFunds(uint256 _agreementId) public payable{
        require(escrows[_agreementId].client == msg.sender, "Only client can approve the realease of funds");
        require(!escrows[_agreementId].amountReleased,"Funds have been released for this escrow agreement.");
        require(escrows[_agreementId].amount >=0,"There are no funds to realease");
        payable(escrows[_agreementId].serviceProvider).transfer(escrows[_agreementId].amount);
        escrows[_agreementId].amountReleased = true;

    }
    function cancel(uint256 _agreementId) public payable{
        require(escrows[_agreementId].client == msg.sender,"Client can cancel the agreement");
        require(!escrows[_agreementId].amountReleased,"Funds have already been released for this escrow agreement");
        require(escrows[_agreementId].amount >= 0,"There are no funds to return.");
        payable(escrows[_agreementId].client).transfer(escrows[_agreementId].amount);
        escrows[_agreementId].cancelled = true;

    }
    function returnAgreementList() public view returns (agreementStruct[] memory) {
        agreementStruct[] memory agreements = new agreementStruct[](totalAgreementCount);
          for (uint i = 0; i < totalAgreementCount; i++) {
              agreementStruct storage agreement = escrows[i];
              agreements[i] = agreement;
          }
          return agreements;
    }
    receive() external payable {}
    fallback() external payable {}
}