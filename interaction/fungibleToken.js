const { Zilliqa } = require('@zilliqa-js/zilliqa');
const {BN, Long, bytes, units} = require('@zilliqa-js/util');
const {toBech32Address, fromBech32Address} = require('@zilliqa-js/crypto');

//You can set the value of the following variables according to your liking
let contractAddress = ""; // 
let privkey = ""; 
const zilliqa = new Zilliqa('https://dev-api.zilliqa.com');

const myGasPrice = units.toQa('2000', units.Units.Li); // Gas Price that will be used by all transactions
contractAddress = contractAddress.substring(2);
const ftAddr = toBech32Address(contractAddress);
const contract = zilliqa.contracts.at(ftAddr);


async function getState(address) {
    try {
        if (!address) throw new Error('Invalid parameter');
        const balance = await contract.getState(address);
        return balance;
    } catch (err) {
        console.log(err.message);
        return err.message;
    }
}

async function transfer(recipientAddress, sendingAmount) {
    try {
        if (!recipientAddress) throw new Error('Invalid parameter');
        if (!sendingAmount) throw new Error('Invalid parameter');
        recipientAddress = fromBech32Address(recipientAddress); //converting to ByStr20 format
        const callTx = await contract.call(
            'Transfer',
            [
                {
                    vname: 'to',
                    type: 'ByStr20',
                    value: recipientAddress,
                },
                {
                    vname: 'amount',
                    type: 'Uint128',
                    value: sendingAmount,
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
        console.log("transfer : ", callTx);
        return callTx;    
    } catch (err) {
        console.log(err.message);
        return err.message;
    }
    
}

exports.getState = getState;
exports.transfer = transfer;
