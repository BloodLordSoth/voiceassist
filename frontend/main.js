const audio = document.getElementById('audio')
const chatbox = document.getElementById('chat')
const message = document.getElementById('message')
const input = document.getElementById('input')
const form = document.getElementById('form')


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


