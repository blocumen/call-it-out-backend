const Web3 = require("aion-web3");
const dotenv = require("dotenv");
dotenv.config();

const web3 = new Web3(
  new Web3.providers.HttpProvider(process.env.NODESMITH_API_KEY)
);
const privateKey = process.env.TRANSACTION_KEY;
const account = web3.eth.accounts.privateKeyToAccount(privateKey);

const contractAddress =
  "0xa0a36bc59912fa4d3883782a8cceec87073f197ccfc18dfe5e08f402f468a344";
const increaseReputation = "increaseReputation";
const decreaseReputation = "decreaseReputation";

async function raiseReputation(publicKey) {
  // Create the data object.
  let data = web3.avm.contract
    .method(increaseReputation)
    .inputs(["address", "BigInteger"], [publicKey, "100"])
    .encode();

  // Create the transaction object.
  const transactionObject = {
    from: account.address,
    to: contractAddress,
    data: data,
    gasPrice: "0x4A817C800",
    gas: 2000000,
    // type: "0x1"
  };
  try {
    // Send the transaction object to the network and wait for a response.
    let signedTransaction = await signTransaction(transactionObject);
    const txObject = await sendSignedTransaction(signedTransaction);

    console.log("txObject : ", txObject);
    // txObject.status === true ==> transaction was successfully

    // console.log('initialResponse : ', initialResponse);
    // Send the transaction object to the network and wait for a response.
  } catch (err) {
    console.log(err);
  }
}

async function downReputation(publicKey) {
  // Create the data object.
  let data = web3.avm.contract
    .method(decreaseReputation)
    .inputs(["address", "BigInteger"], [publicKey, "100"]) // public key, reputation points
    .encode();

  // Create the transaction object.
  const transactionObject = {
    from: account.address,
    to: contractAddress,
    data: data,
    gasPrice: "0x4A817C800",
    gas: 2000000,
    // type: "0x1"
  };

  // Send the transaction object to the network and wait for a response.
  let signedTransaction = await signTransaction(transactionObject);
  const txObject = await sendSignedTransaction(signedTransaction);

  console.log("txObject : ", txObject);
  // txObject.status === true ==> transaction was successfully

  // console.log('initialResponse : ', initialResponse);
  // Decode the reponse.
  let avmResponse = await web3.avm.contract.decode("string", initialResponse);

  // Print the response to the console.
  console.log("avn response : ", avmResponse);
}

const signTransaction = async (transactionObject) => {
  // Get an unlocked account object which we can use to sign transactions
  const unlockedAccount = web3.eth.accounts.privateKeyToAccount(privateKey);

  // Sign the transaction and wait for the result.
  const signedTransaction = await unlockedAccount.signTransaction(
    transactionObject
  );
  console.log("signedTransaction : ", signedTransaction);
  return signedTransaction;
};

const sendSignedTransaction = (signedTransaction) => {
  // Send the transaction and listen for the various events
  // https://web3js.readthedocs.io/en/1.0/callbacks-promises-events.html#promievent
  return web3.eth
    .sendSignedTransaction(signedTransaction.rawTransaction)
    .once("transactionHash", (hash) => {
      console.log(`Received transaction hash ${hash}`);
      const explorerUrl = "https://mastery.aion.network/#/transaction/" + hash;
      console.log(`Check ${explorerUrl} once transaction is confirmed.`);
    })
    .on("error", (error) => {
      console.error(`Error occurred sending transaction ${error}`);
    })
    .then((receipt) => {
      // This will be fired once the receipt is mined
      console.log(
        `Transaction sent successfully. Receipt: ${JSON.stringify(receipt)}`
      );
      return receipt;
    });
};

module.exports = {
  raiseReputation,
  downReputation,
};

//raiseReputation("0xa073eb74573e892d5cde20b3bf84f406a41cc669e012678452d00e7f0a06546d").then(console.log);
