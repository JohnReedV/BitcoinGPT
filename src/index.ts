import express from 'express'
import axios from 'axios'
import cors from 'cors'

const app = express()
app.use(express.json())
app.use(cors())

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
