import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { chatAI, transcribe } from './ai.js'
import multer from 'multer'

const app = express()
const PORT = 4700
app.use(express.json())
app.use(cors())
const __file = fileURLToPath(import.meta.url)
const __dir = path.dirname(__file)
app.use(express.static(path.join(__dir, 'frontend')))
const storage = multer.memoryStorage()
const upload = multer({ storage })

app.get('/', (req, res) => {
    res.sendFile(path.join(__dir, 'frontend', 'index.html'))
})

app.post('/chat', async (req, res) => {
    const post = req.body.post

    if (!post) return res.sendStatus(401);

    try {
        const reply = await chatAI(post)
        res.status(200).json({ reply: reply })
    }
    catch (e) {
        res.sendStatus(500)
        console.error(e)
    }
})

app.post('/audio', upload.single('audio'), async (req, res) => {
    if (!req.file) return res.sendStatus(401);

    try {
        const file = req.file.buffer
        const reply = await transcribe(file)
        res.status(200).send(reply)
    }
    catch (e) {
        console.error(e)
        res.sendStatus(500)
    }
})

app.listen(PORT, () => {
    console.log(`Running on localhost:${PORT}`)
})