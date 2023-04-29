import express, { Request, Response } from 'express'
import cors from 'cors'
import path from 'path'

const app = express()
app.use(cors())

const todos: string[] = []

app.get('/todos', (req: Request, res: Response) => {
  res.json({ todos })
})

app.post('/todos/:todo', (req: Request, res: Response) => {
  const todo = req.params.todo
  todos.push(todo)
  res.sendStatus(201)
})

app.delete('/todos/:todo', (req: Request, res: Response) => {
  const todo = req.params.todo
  const index = todos.indexOf(todo)
  if (index !== -1) {
    todos.splice(index, 1)
    res.sendStatus(200)
  } else {
    res.sendStatus(404)
  }
})

app.get('/.well-known/ai-plugin.json', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'ai-plugin.json'))
})
app.get('/openapi.yaml', (req, res) => {
  res.sendFile(path.join(__dirname, 'openapi.yaml'))
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
