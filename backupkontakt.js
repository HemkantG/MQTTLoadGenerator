var mqtt = require('mqtt')
var client = mqtt.connect('mqtts://mqtt.kontakt.io', {
    host: 'mqtt.kontakt.io',
    port: 8083,
    protocol: 'mqtts',
    username: 'espl1',
    password: 'TTlXJYfTjpSFvktCSHmauuhaZtWbLLYX',
    clientId: 'bluedente'
})

client.on('connect', () => {
    client.subscribe('/presence/stream/otsmEZ', err => {
        if (!err) {
            console.log('Connected to the topic')
        }
    })
})

client.on('message', (topic, message)=> {
    console.log(topic)
})