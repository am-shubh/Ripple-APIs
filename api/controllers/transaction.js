// Dependencies
const RippleAPI = require('ripple-lib').RippleAPI;

// Testnet Public rippled server https://s.altnet.rippletest.net:51234 wss://s.altnet.rippletest.net:51233
const api = new RippleAPI({
  server: 'wss://s.altnet.rippletest.net:51233'
});

exports.make_transaction = (req, res) => {

    let source = req.body.sourceAddress;
    let destination = req.body.destinationAddress;
    let amount = req.body.amount;
    let currency = req.body.currency;
    let secretKey = req.body.secretKey;

    // connecting to ripple testnet server
    api.connect().then(() => {

        return api.preparePayment(source, {
            // defining source and destination address
          source: {
            address: source,
            maxAmount: {
              value: amount,
              currency: currency
            }
          },
          destination: {
            address: destination,
            amount: {
              value: amount,
              currency: currency
            }
          }
        }, {maxLedgerVersionOffset: 5}).then(prepared => {
        
            // signing and submitting transaction
            const {signedTransaction} = api.sign(prepared.txJSON, secretKey);
            console.log('Payment transaction signed...');
            api.submit(signedTransaction).then(() => {

                let result = {
                    "from": source,
                    "to": destination,
                    "amount": amount,
                    "currency": currency
                };
                
                res.status(200).send(result);
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

async function fetchAccountTransactions(req, res) {
    let address = req.params.address;
    let transactionResult = [];

    try {
      await api.connect();
      const serverInfo = await api.getServerInfo();
      const ledgers = serverInfo.completeLedgers.split('-');
      const minLedgerVersion = Number(ledgers[0]);
      const maxLedgerVersion = Number(ledgers[1]);
  
      const transactions = await api.getTransactions(address, {
        minLedgerVersion,
        maxLedgerVersion,
      });
      
      transactions.forEach(transaction => {
    
            let result = {
                "type": transaction.type,
                "source": transaction.specification.source.address,
                "destination": transaction.specification.destination.address,
                "amount": transaction.outcome.deliveredAmount.value,
                "currency": transaction.outcome.deliveredAmount.currency
            }

            console.log(result);

            transactionResult.push(result);

        });

        await api.disconnect();

        return res.status(200).send(transactionResult);

    } catch (err) {
        return res.status(500).json({
            "error": err
        });
    }
}

exports.transactions_of_account = (req, res)=> {
    return fetchAccountTransactions(req, res);
}