import express, {raw} from 'express'
import http from 'http'
import ws, {WebSocketServer} from 'ws'


const app = express()
app.use(express.static('app'))
const port = process.env.PORT || 3000


const server = http.createServer(app)
const wss = new WebSocketServer({server, path: '/echo'})

wss.on('connection', (ws) => {
    const welcomeMessage = JSON.stringify({type: 'hello'})
    ws.send(welcomeMessage)

    ws.on('message', (rawMsg) => {
        try {
            const msg = JSON.parse(rawMsg)
            // console.log(msg)

            switch (msg.type) {
                case 'request':
                    switch (msg.data) {
                        case 'update':
                            const response = JSON.stringify({type: 'update', body: '...'})
                            ws.send(response)
                            break
                    }
                    break
            }

        } catch (err) {
            if (err instanceof SyntaxError) {
                console.log('received message is not valid JSON')
            } else {
                console.log(err)
            }
        }
    })
});

function broadcast(content) {
    wss.clients.forEach(client => {
        const message = JSON.stringify({type: 'update', data: content})
        client.send(message)
    })
    console.log('run timeout')
}

setTimeout(broadcast, 5000, 'Hello everyone')


app.get('/', function (req, res) {
    res.sendFile('home.html', {root: 'app'})
})




server.listen(port, () => {
    console.log(`Server started on port ${server.address().port}`);
});

