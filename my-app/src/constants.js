export const ESCROW_AGREEMENT_CONTRACT_ADDRESS = "0x250Acba6EAA322A159fb8c4808707eAFDfce040A";
export const ESCROW_AGREEMENT_CONTRACT_ABI = [
    {
      "stateMutability": "payable",
      "type": "fallback"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_agreementId",
          "type": "uint256"
        }
      ],
      "name": "cancel",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address payable",
          "name": "_serviceProvider",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_agreementId",
          "type": "uint256"
        },
        {
          "internalType": "address payable",
          "name": "_client",
          "type": "address"
        }
      ],
      "name": "createEscrowAgreement",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_agreementId",
          "type": "uint256"
        }
      ],
      "name": "releaseFunds",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "returnAgreementList",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "agreementId",
              "type": "uint256"
            },
            {
              "internalType": "address payable",
              "name": "serviceProvider",
              "type": "address"
            },
            {
              "internalType": "address payable",
              "name": "client",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "amountReleased",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "cancelled",
              "type": "bool"
            }
          ],
          "internalType": "struct Escrow.agreementStruct[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalAgreementCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    }
  ];