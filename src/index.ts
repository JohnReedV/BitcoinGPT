import express, { Request, Response, response } from 'express'
import cors from 'cors'
import { BtcQueries } from './btcQ'

const app = express()
app.use(cors({ origin: 'https://chat.openai.com' }))
app.use(express.json())

const btcQ = new BtcQueries()

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

// app.get('/logo.png', (req: Request, res: Response) => {
//   res.sendFile('logo.png', { root: __dirname }, (err) => {
//     if (err) {
//       console.error(err)
//       res.sendStatus(404)
//     }
//   })
// })

app.get('/.well-known/ai-plugin.json', (req: Request, res: Response) => {
  res.sendFile('.well-known/ai-plugin.json', { root: __dirname }, (err) => {
    if (err) {
      console.error(err)
      res.sendStatus(404)
    }
  })
})

app.get('/openapi.yaml', (req: Request, res: Response) => {
  res.sendFile('openapi.yaml', { root: __dirname }, (err) => {
    if (err) {
      console.error(err)
      res.sendStatus(404)
    }
  })
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
