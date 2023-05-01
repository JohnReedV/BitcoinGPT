import express, { Request, Response } from 'express'
import cors from 'cors'
import axios from 'axios'

const app = express()
app.use(cors({ origin: 'https://chat.openai.com' }))
app.use(express.json())


app.get('/bitcoin/info', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:8332/', {
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({
        method: 'getblockchaininfo',
        params: [],
        id: 1,
      }),
      auth: {
        username: 'yourUsername',
        password: 'yourPassword',
      },
    });

    res.json(response.data.result)
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving Bitcoin node info' })
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
