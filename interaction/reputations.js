const { Zilliqa } = require('@zilliqa-js/zilliqa');
const { BN, Long, bytes, units } = require('@zilliqa-js/util');
const { toBech32Address, fromBech32Address } = require('@zilliqa-js/crypto');

//You can set the value of the following variables according to your liking
let contractAddress = "0xe2dfcd83bddd300ba046a219e076ea9ef6e13405"; //
let privateKey = "3ddf47aff62044916ea19f62d1bc480d52ccbf8cf35cd8dd8aa0039dade5cced";
const zilliqa = new Zilliqa('https://dev-api.zilliqa.com');

const myGasPrice = units.toQa('2000', units.Units.Li); // Gas Price that will be used by all transactions
contractAddress = contractAddress.substring(2);
const ftAddr = toBech32Address(contractAddress);
const contract = zilliqa.contracts.at(ftAddr);
zilliqa.wallet.addByPrivateKey(privateKey);

const chainId = 333; // chainId of the developer testnet
const msgVersion = 1; // current msgVersion
const VERSION = bytes.pack(chainId, msgVersion);

async function increaseReputation(userAddress, reputationPoint) {
  try {
    userAddress = fromBech32Address(userAddress);
    const callTx = await contract.callWithoutConfirm(
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
    console.log("callTx.bytes : ", callTx.bytes);
    console.log(`The transaction id is:`, callTx.id);
    console.log(`Waiting transaction be confirmed`);
    const confirmedTxn = await callTx.confirm(callTx.id);
    console.log(`The transaction status is:`);
    console.log(confirmedTxn.receipt);
  } catch (err) {
    console.log(err);
    return err.message;
  }

}


async function getState(address) {
  try {

    // state of contract
    /**
     * { _balance: '0',
     *  userVsReputation: { '0xbafcb5dc9fce052d30fbbea670ec69f773f864fe': '1245' }
     * }
     */


    userAddress = fromBech32Address(address);
    const completeState = await contract.getState();
    console.log('completeState : ', completeState);
    return completeState.userVsReputation[userAddress];
  } catch (err) {
    console.log(err.message);
    return err.message;
  }
}

async function decreaseReputation(userAddress, reputationPoint) {
  try {
    userAddress = fromBech32Address(userAddress);
    const callTx = await contract.call(
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
    console.log("callTx.bytes : ", callTx.bytes);
    console.log(`The transaction id is:`, callTx.id);
    console.log(`Waiting transaction be confirmed`);
    const confirmedTxn = await callTx.confirm(callTx.id);
    console.log(`The transaction status is:`);
    console.log(confirmedTxn.receipt);
  } catch (err) {
    console.log(err);
    return err.message;
  }

}

exports.increaseReputation = increaseReputation;
exports.decreaseReputation = decreaseReputation;
exports.getState = getState;
