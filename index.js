const axios = require('axios')
let receivers;
let beacons;


getAllocatedReceivers = async () => {
    try {
        return await axios.get('http://192.168.101.21:3063/api/GatewayLogController/LocationAssignedReceivers')
    }
    catch (error) {
        console.error(error)
    }
}

getBeaconByBranchId = async () => {
    try {
        return await axios.get('http://192.168.101.21:3063/api/GatewayLogController/BeaconList')
    }
    catch (error) {
        console.error(error)
    }
}

getFilteredBeacons = (beacons, receiver) => {
    return beacons.filter(beacon => beacon.branchId === receiver.branchId).map(beacon => {
        return {
            "providerCode": beacon.providerCode,
            "proximityUuid": beacon.uniqueId,
            "major": beacon.major,
            "minor": beacon.minor,
        };
    });
}


generateLocationData = (receiver, beacons) => {
    const locationData = []

    for (let i = 0; i < 50; i++) {
        const distance = (Math.random() * 20)
        locationData.push({
            "timestamp": 1564644241,
            "sourceId": receiver.uniqueID,
            "trackingId": beacons[Math.floor(Math.random() * beacons.length)].providerCode,
            "rssi": -88,
            "proximity": distance < 0.5 ? "NEAR" : distance >= 0.5 && distance < 3 ? "IMMEDIATE" : "FAR",
            "scanType": "BLE",
            "deviceAddress": null,
            "distance": distance
        })
    }
    return locationData;
}

var mqtt = require('mqtt')
var client = mqtt.connect({
    host: 'localhost',
    port: 1883,
    protocol: 'mqtt',
})

client.on('connect', async () => {
    receivers = (await getAllocatedReceivers()).data;
    beacons = (await getBeaconByBranchId()).data;
    startDataPumping();    
})

startDataPumping =()=>{
    setInterval(function() {
        console.log('Called')
        receivers.forEach(receiver => {
            const locationData = generateLocationData(receiver, getFilteredBeacons(beacons, receiver))
            client.publish(receiver.uniqueID, JSON.stringify(locationData))
            console.log(`Published by: ${receiver.uniqueID}: ${locationData.length}`)
        })
    },1000)
}

