// Dependencies
const RippleAPI = require('ripple-lib').RippleAPI;
const request = require('request');

const api = new RippleAPI({
  server: 'wss://s.altnet.rippletest.net:51233' // Testnet Public rippled server
});

exports.create_funding_account = (req, res) => {

    const url = 'https://faucet.altnet.rippletest.net/accounts';

    const options = {
        uri: url,
        method: 'POST'
    }

    request(options, (error, result) => {

        if(!error && result.body){
            console.log(result.body);
            return res.status(200).send(result.body);
        } else {
            console.log(error);
            return res.status(500).json({
                "error": error
            });
        }
        
    });

}

exports.create_new_account = (req, res) => {

    let fundingAddress = req.body.fundingAddress;
    let fundingSecret = req.body.fundingSecret;
    let amount = '50';

    // connecting to ripple testnet server
    api.connect().then(() => {
    
        const account = api.generateAddress();
        console.log('Account Created with address '+ account.address);

        return api.preparePayment(fundingAddress, {
            // defining source and destination address
          source: {
            address: fundingAddress,
            maxAmount: {
              value: amount,
              currency: 'XRP'
            }
          },
          destination: {
            address: account.address,
            amount: {
              value: amount,
              currency: 'XRP'
            }
          }
        }, {maxLedgerVersionOffset: 5}).then(prepared => {
        
            // funding new account with 50 XRPs to activate it
            console.log('Funding account '+ account.address);
            const {signedTransaction} = api.sign(prepared.txJSON, fundingSecret);
            console.log('Payment transaction signed...');
            api.submit(signedTransaction).then(() => {
                console.log(`Funded ${account.address} with ${amount} XRP`)
                res.status(200).send({
                    account: account,
                    balance: Number(amount)
                })
            })
        })
      }).then(() => {
          // disconencting ripple testnet server
          return api.disconnect();
        }).catch(err => { 
            return res.status(500).json({
                "error": err
            }); 
        })
    

}

exports.account_Info = (req, res) => {

    let accountAddress = req.body.accountAddress;

    api.connect().then(() => {

        // getting account details
        console.log('getting account info for', accountAddress);
        return api.getAccountInfo(accountAddress);

    }).then(info => {

        console.log('getAccountInfo done');
        res.status(200).send(info);

    }).then(() => {
        // disconnecting from ripple testnet server
        return api.disconnect();
    }).catch( err => {
        return res.status(500).json({
            "error": err
        });
    });

}