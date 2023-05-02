import express, { Request, Response, response } from 'express'
import cors from 'cors'
import { BtcQueries } from './btcQ'

const app = express()
app.use(cors({ origin: 'https://chat.openai.com' }))
app.use(express.json())

const btcQ = new BtcQueries()

app.get('/bitcoin/info', async (req, res) => {
  let result
  try {
    result = await btcQ.getChainInfo()
    res.json(result)
  } catch (error) {
    res.status(500).json({ message: `Here is the error message: ${error} and here is the response ${JSON.stringify(result)}` })
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
