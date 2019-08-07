var mqtt = require('mqtt')
var client = mqtt.connect( {
    host: 'localhost',
    port: 1883,
    protocol: 'mqtt',
})

client.on('connect', () => {
    console.log('Connected')
    client.subscribe('mytopic', err => {
        if (!err) {
            console.log('Connected to the topic')
        }
    })
})

client.on('message', (topic, message)=> {
    console.log(topic, message)
})