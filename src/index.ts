import express from 'express'
import cors from 'cors'
import { BtcQueries } from './btcQ'
import Bitcore from "bitcore-lib"
import { DecodedTransaction } from './IBitcoinGPT'
import axios from 'axios'

const app = express()
app.use(cors({ origin: 'https://chat.openai.com' }))
app.use(express.json())

const btcQ = new BtcQueries()

app.get('/bitcoin/current-price', async (req, res) => {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')
    res.json(response.data)
  } catch (error) {
    res.status(500).json({ message: `Error: ${error}` })
  }
})

app.get('/bitcoin/info', async (req, res) => {
  try {
    const result = await btcQ.getChainInfo()
    res.json(result)
  } catch (error) {
    res.status(500).json({ message: `Error: ${error}` })
  }
})

app.get('/bitcoin/block-height', async (req, res) => {
  try {
    const result = await btcQ.getBlockHeight()
    res.json({ blockHeight: result })
  } catch (error) {
    res.status(500).json({ message: `Error: ${error}` })
  }
})

app.get('/bitcoin/block-hash/:blockNumber', async (req, res) => {
  try {
    const result = await btcQ.getBlockHash(Number(req.params.blockNumber))
    res.json({ blockHash: result })
  } catch (error) {
    res.status(500).json({ message: `Error: ${error}` })
  }
})

app.get('/bitcoin/block/:blockHash', async (req, res) => {
  try {
    const result = await btcQ.getBlock(req.params.blockHash)
    res.json(result)
  } catch (error) {
    res.status(500).json({ message: `Error: ${error}` })
  }
})

app.get('/bitcoin/raw-tx/:txHash/:blockHash', async (req, res) => {
  try {
    const result = await btcQ.getRawTX(req.params.txHash, req.params.blockHash)
    res.json(result)
  } catch (error) {
    res.status(500).json({ message: `Error: ${error}` })
  }
})

app.get('/bitcoin/decoded-tx/:rawTXHexString', async (req, res) => {
  try {
    const result = await btcQ.getDecodedTX(req.params.rawTXHexString)
    res.json(result)
  } catch (error) {
    res.status(500).json({ message: `Error: ${error}` })
  }
})

app.get('/bitcoin/transaction/:txid', async (req, res) => {
  try {
    const result = await btcQ.getTransactionFromTxId(req.params.txid)
    res.json(result)
  } catch (error) {
    res.status(500).json({ message: `Error: ${error}` })
  }
})

app.get('/bitcoin/get-receivers/:decodedtx', async (req, res) => {
  const decodedTx: DecodedTransaction = JSON.parse(req.params.decodedtx)
  const receivers = []
  for (let v = 0; v < decodedTx.vout.length; v++) {
    const vout = decodedTx.vout[v]
    if (vout.scriptPubKey.type === 'nulldata' || !vout.scriptPubKey.address) {
      continue
    }

    receivers.push({
      address: vout.scriptPubKey.address,
      value: vout.value,
      type: vout.scriptPubKey.type,
      index: v,
    })
  }
  res.json(receivers)
})

app.get('/bitcoin/get-senders/:txhex', async (req, res) => {
  const transaction = new Bitcore.Transaction(req.params.txhex)
  const senders = []
  for (let i = 0; i < transaction.inputs.length; i++) {
    const input = transaction.inputs[i]
    const oldTransaction = await btcQ.getTransactionFromTxId(input.prevTxId.toString('hex'))
    const decodedTX = await btcQ.getDecodedTX(oldTransaction.hex)
    const spk = decodedTX.vout[input.outputIndex].scriptPubKey
    if (spk.address) {
      senders.push({
        address: spk.address,
        value: decodedTX.vout[input.outputIndex].value,
        type: spk.type,
        index: i,
      })
    }
  }
  res.json(senders)
})

app.get('/bitcoin/generate-keypair', (req, res) => {
  const amount = parseInt(req.query.amount as string ?? '1')
  const keyPairs = [];

  for (let i = 0; i < amount; i++) {
    const privateKey = new Bitcore.PrivateKey();
    const publicKey = privateKey.toPublicKey();
    const address = privateKey.toAddress();

    keyPairs.push({
      privateKey: privateKey.toString(),
      publicKey: publicKey.toString(),
      address: address.toString(),
    })
  }

  res.json(keyPairs);
})

app.get('/logo.png', (req, res) => {
  res.sendFile('assets/bitcoin-btc-logo.png', { root: __dirname }, (err) => {
    if (err) {
      console.error(err)
      res.sendStatus(404)
    }
  })
})

app.get('/.well-known/ai-plugin.json', (req, res) => {
  res.sendFile('.well-known/ai-plugin.json', { root: __dirname }, (err) => {
    if (err) {
      console.error(err)
      res.sendStatus(404)
    }
  })
})

app.get('/openapi.yaml', (req, res) => {
  res.sendFile('openapi.yaml', { root: __dirname }, (err) => {
    if (err) {
      console.error(err)
      res.sendStatus(404)
    }
  })
})

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
