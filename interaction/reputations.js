const { Zilliqa } = require('@zilliqa-js/zilliqa');
const {BN, Long, bytes, units} = require('@zilliqa-js/util');
const {toBech32Address, fromBech32Address} = require('@zilliqa-js/crypto');

//You can set the value of the following variables according to your liking
let contractAddress = ""; // 
let recipientAddress =  ''; // sendingAddress;
let sendingAmount = ''; // sendingAmount;
let privkey = ""; 
const zilliqa = new Zilliqa('https://dev-api.zilliqa.com');

const myGasPrice = units.toQa('2000', units.Units.Li); // Gas Price that will be used by all transactions
contractAddress = contractAddress.substring(2);
recipientAddress = fromBech32Address(recipientAddress); //converting to ByStr20 format
const ftAddr = toBech32Address(contractAddress);


const contract = zilliqa.contracts.at(ftAddr);


async function increaseReputation() {
    try {
        const incrRep = await contract.call(
            'increaseReputation',
            [
                {
                    vname: 'user',
                    type: 'ByStr20',
                    value: "user", // it will be change, abhi dummy hai ye !
                },
                {
                    vname: 'reputation',
                    type: 'Uint128',
                    value: 43, // it will be change, abhi dummy hai ye !
                }
            ],
            {
                // amount, gasPrice and gasLimit must be explicitly provided
                version: VERSION,
                amount: new BN(0),
                gasPrice: myGasPrice,
                gasLimit: Long.fromNumber(10000),
            }
        );
        console.log("incrRep : ", incrRep);
    
    } catch (err) {
        console.log(err);
    }
    
}

async function decreaseReputation() {
    try {
        const decrRep = await contract.call(
            'decreaseReputation',
            [
                {
                    vname: 'user',
                    type: 'ByStr20',
                    value: "user", // it will be change, abhi dummy hai ye !
                },
                {
                    vname: 'reputation',
                    type: 'Uint128',
                    value: 43, // it will be change, abhi dummy hai ye !
                }
            ],
            {
                // amount, gasPrice and gasLimit must be explicitly provided
                version: VERSION,
                amount: new BN(0),
                gasPrice: myGasPrice,
                gasLimit: Long.fromNumber(10000),
            }
        );
        console.log("decrRep : ", decrRep);
    
    } catch (err) {
        console.log(err);
    }
    
}


increaseReputation();
decreaseReputation();
