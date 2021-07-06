const { Zilliqa } = require('@zilliqa-js/zilliqa');
const { BN, Long, bytes, units } = require('@zilliqa-js/util');
const { toBech32Address, fromBech32Address } = require('@zilliqa-js/crypto');

//You can set the value of the following variables according to your liking
let contractAddress = "0x4e38fa964533e2c23e7247112e28f88161a45bb8"; //
let privateKey = "3ddf47aff62044916ea19f62d1bc480d52ccbf8cf35cd8dd8aa0039dade5cced";
const zilliqa = new Zilliqa('https://dev-api.zilliqa.com');
                              
const myGasPrice = units.toQa('2000', units.Units.Li); // Gas Price that will be used by all transactions
contractAddress = contractAddress.substring(2);
const ftAddr = toBech32Address(contractAddress);
console.log('ftAddr : ', ftAddr);
const contract = zilliqa.contracts.at(ftAddr);
zilliqa.wallet.addByPrivateKey(privateKey);

const chainId = 333; // chainId of the developer testnet
const msgVersion = 1; // current msgVersion
const VERSION = bytes.pack(chainId, msgVersion);


async function getState(address) {
  try {
    // if (!address) throw new Error('Invalid parameter');

    // state of contract 
    /**
     * allowances: {},
     * balances:{ '0xbafcb5dc9fce052d30fbbea670ec69f773f864fe': '1000000000000000000000000000000' },
     * total_supply: '1000000000000000000000000000000' }
     */

    const completeState = await contract.getState();
    console.log('completeState : ', completeState);
    return completeState.balances[address];
  } catch (err) {
    console.log(err.message);
    return err.message;
  }
}

async function transfer(recipientAddress, sendingAmount) {
  try {
    recipientAddress = fromBech32Address(recipientAddress); //converting to ByStr20 format
  //  console.log('tobech address: ', toBech32Address(nonBechAddress));
  //  const convertedBechAddress = toBech32Address(nonBechAddress);
   // console.log('convertedBechAddress : ', convertedBechAddress);
    
  //  console.log('type convertedBechAddress ', typeof convertedBechAddress);
    console.log('type recipientAddress ', typeof recipientAddress);
    
    // Get Minimum Gas Price from blockchain
    const minGasPrice = await zilliqa.blockchain.getMinimumGasPrice();

    const myGasPrice = units.toQa('2000', units.Units.Li);

    const isGasSufficient = myGasPrice.gte(new BN(minGasPrice.result));
    console.log('isGasSufficient :  ', isGasSufficient);
    const callTx = await contract.callWithoutConfirm(
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
        gasLimit: Long.fromNumber(25000),
      },
      false
    );
    // console.log("transfer : ", JSON.stringify(callTx));
    // return callTx;
    console.log(callTx.bytes);

    console.log(`The transaction id is:`, callTx.id);
    console.log(`Waiting transaction be confirmed`);
    const confirmedTxn = await callTx.confirm(callTx.id);

    console.log(`The transaction status is:`);
    console.log(confirmedTxn.receipt);
  } catch (err) {
    console.log(err.message);
    return err.message;
  }

}

exports.getState = getState;
exports.transfer = transfer;
