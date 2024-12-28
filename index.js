const express = require('express');
const cors = require('cors');
const port = 3000
const app = express();
const http = require('http');// int socket
const { Server } = require('socket.io');


app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174','https://another-project-946be.web.app'],
    methods: ['GET', 'POST']
}));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173', 'http://localhost:5174', 'https://another-project-946be.web.app'],
        methods: ['GET', 'POST']
    }
})
// MongoDB 
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://chatApp-demo:cfVkaXxg3u1QQYjJ@cluster0.r9h20.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


// chatApp-demo
// cfVkaXxg3u1QQYjJ
async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        const messageCollection = client.db('messageDB').collection('messageCollection')

        io.on('connection', (socket) => {
            console.log('a user connected')
            const date = new Date();
            console.log('Connection time:', date);

            socket.on('join_room', ({ email }) => {
                socket.join('general')
                console.log('user joined')
                socket.emit('you are connected in our room')
            })

            socket.on('send_msg', async (data) => {
                console.log(data)
                const message = {
                    email: data.email,
                    message: data.message,
                    time: data.time
                }
                const result = await messageCollection.insertOne(message)
                console.log(data)
                socket.in('general').emit('receive_msg', { data })
            })


            socket.on('disconnect', () => {
                console.log('user disconnected')
            })

        })

        app.get('/messages', async (req, res) => {
            const cursor = messageCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })


        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


// Socket.io



app.get('/', (req, res) => {
    res.send('alhamdulillah, server created')
})
server.listen(port, () => {
    console.log('alhamdulillah')
})