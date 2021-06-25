const Web3 = require("aion-web3");
const dotenv = require("dotenv");
dotenv.config();

const web3 = new Web3(
  new Web3.providers.HttpProvider(process.env.NODESMITH_API_KEY)
);
const privateKey = process.env.TRANSACTION_KEY;
const account = web3.eth.accounts.privateKeyToAccount(privateKey);

async function transferAion(amount, to) {
  try {
    // Create the transaction object.
    const transactionObject = {
      to: to,
      value: amount,
      data: "",
      gasPrice: "0x4A817C800",
      gas: 2000000,
    };

    const signedTransaction = await signTransaction(transactionObject);
    const receiptObj = await sendSignedTransaction(signedTransaction);
    console.log("receiptObj : ", receiptObj);
  } catch (err) {
    console.log(err);
  }
}

const signTransaction = async (transactionObject) => {
  try{
 // Get an unlocked account object which we can use to sign transactions
 const unlockedAccount = web3.eth.accounts.privateKeyToAccount(privateKey);

 // Sign the transaction and wait for the result.
 const signedTransaction = await unlockedAccount.signTransaction(
   transactionObject
 );
 console.log("signedTransaction : ", signedTransaction);
 return signedTransaction;
  }catch(err){
  return err;
  }
 
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
  transferAion,
};
// transferAion("1","0xa0fedce2e8287c980a870ff7ab9208a878b66f694a507fb3dd542f0f6b105c35").then(console.log);
// here '1' is 0.000000000000000001 AION
