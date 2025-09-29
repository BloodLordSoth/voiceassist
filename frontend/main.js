const audio = document.getElementById('audio')
const chatbox = document.getElementById('chat')
const message = document.getElementById('message')
const input = document.getElementById('input')
const form = document.getElementById('form')

let mediaRecorder;
let chunkarr;
let stream;

async function submit(){
    if (message.value.length === 0){
        return
    }

    const dataObj = {
        post: message.value
    }

    const res = await fetch('/chat', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataObj)
    })
    
    const usermsg = document.createElement('div')
    usermsg.classList.add('user')
    usermsg.textContent = message.value
    chatbox.appendChild(usermsg)
    
    message.value = ''

    chatbox.scrollTop = chatbox.scrollHeight


    if (!res.ok){
        window.alert('Issue connecting with the server')
        return
    }

    const data = await res.json()
    const aireply = document.createElement('div')
    aireply.classList.add('botreply')
    aireply.textContent = data.reply
    chatbox.appendChild(aireply)
}

form.addEventListener('submit', (e) => {
    e.preventDefault()
    submit()
})

audio.addEventListener('mousedown', async () => {
    audio.style.background = 'red'
    stream = await navigator.mediaDevices.getUserMedia({
        audio: true
    })

    chunkarr = []
    mediaRecorder = new MediaRecorder(stream)

    mediaRecorder.ondataavailable = (e) => {
        chunkarr.push(e.data)
    }

    mediaRecorder.onstop = async () => {
        const blob = new Blob(chunkarr)

        const formData = new FormData()
        formData.append('audio', blob, 'audio.webm')
        
        const res = await fetch('/audio', {
            method: "POST",
            body: formData
        })

        if (!res.ok){
            window.alert('There was an issue connecting with the server.')
            return
        }

        const dsource = await res.blob()
        const url = URL.createObjectURL(dsource)
        const audio = new Audio(url)
        audio.volume = 0.7
        audio.play()

    }

    mediaRecorder.start()
})

audio.addEventListener('mouseup', () => {
    audio.style.background = '#000'
    mediaRecorder.stop()
    stream.getTracks().forEach(track => track.stop())
})

audio.addEventListener('mouseenter', () => {
    audio.style.color = 'gold'
})
audio.addEventListener('mouseleave', () => {
    audio.style.color = '#000'
})