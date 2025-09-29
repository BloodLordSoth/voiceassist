import OpenAI from 'openai'
import dotenv from 'dotenv'
import { Readable } from 'stream'

dotenv.config()

const openai = new OpenAI({
    apiKey: process.env.API_KEY
})

export async function transcribe(filesource){
    const source = Readable.from(filesource)
    source.path = 'audio.webm'
    //const source = fs.createReadStream(filesource)

    const response = await openai.audio.transcriptions.create({
        model: 'whisper-1',
        file: source
    })

    const reply = response.text
    const data = await callAI(reply)
    return data
}

async function callAI(prompt){
    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
            { role: 'system', content: 'You are a helpful chat assistant named Soth. Try to keep replies short, and reply like Raistlin Majere from Dragonlance.'},
            { role: 'user', content: prompt }
        ]
    })

    const reply = response.choices[0].message.content
    const audio = await speech(reply)
    return audio
}

async function speech(string){
    const response = await openai.audio.speech.create({
        model: 'gpt-4o-mini-tts',
        voice: 'onyx',
        input: string
    })

    const reply = Buffer.from(await response.arrayBuffer())
    return reply
}

export async function chatAI(prompt){
    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
            { role: 'system', content: 'You are a helpful chat assistant named Soth. Try to keep replies short, and reply like Raistlin Majere from Dragonlance.'},
            { role: 'user', content: prompt }
        ]
    })

    const reply = response.choices[0].message.content
    return reply
}
