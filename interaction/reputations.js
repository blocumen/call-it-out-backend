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


async function increaseReputation(userAddress, reputationPoint) {
    try {
        if (!userAddress) throw new Error('Invalid parameter');
        if (!reputationPoint) throw new Error('Invalid parameter');
        userAddress = fromBech32Address(userAddress); 
        const incrRep = await contract.call(
            'increaseReputation',
            [
                {
                    vname: 'user',
                    type: 'ByStr20',
                    value: userAddress
                },
                {
                    vname: 'reputation',
                    type: 'Uint128',
                    value: reputationPoint 
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
        return incrRep;
    } catch (err) {
        console.log(err);
        return err.message;
    }
    
}

async function decreaseReputation(userAddress, reputationPoint) {
    try {
        if (!userAddress) throw new Error('Invalid parameter');
        if (!reputationPoint) throw new Error('Invalid parameter');
        userAddress = fromBech32Address(userAddress); 
        const decrRep = await contract.call(
            'decreaseReputation',
            [
                {
                    vname: 'user',
                    type: 'ByStr20',
                    value: userAddress
                },
                {
                    vname: 'reputation',
                    type: 'Uint128',
                    value: reputationPoint
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
        return decrRep;
    } catch (err) {
        console.log(err);
        return err.message;
    }
    
}

exports.increaseReputation = increaseReputation;
exports.decreaseReputation = decreaseReputation;
