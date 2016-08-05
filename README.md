# nec-smdr

A NodeJS module for extracting SMDR data from NEC SV8100/SV9100 PBX systems.

## Usage

### Creating a client

```javascript
const SmdrClient = require('../index.js');
const smdrClient = new SmdrClient({ host: 'localhost', port: 2000 });
```

You need to replace localhost with the actual PBX host or ip.

### Listening to events

Once the client is initiated, you can listen to events like this:

```javascript
smdrClient.on('any', event => {
    console.log(event);
});
```
#### Event names

'any': Will listen to all events.

'outgoingCall': Listens for outgoing calls.

'incomingCall': Listens for incoming calls.

'transferedCall': Listens for transfered calls.

'extensionCall': Listens for extension calls

#### Event object

The listener function is passed an event object with the following format:

```javascript
{ 
    type, 
    startedAt, 
    line, 
    durationInSeconds, 
    station, 
    numberDialed, 
    accountNumber 
}
```

type: type of the SMDR record, please refer to SV9100 documentation for type details. Types can be: POT, POTA, PIN,
PTRS, IVIN, ICM

startedAt: the time the call started

line: the line the call took place on

durationInSeconds: the call duration in seconds

station: station calling/called

numberDialed: number dialed

account number: see NEC documentation

## Notes

Please note that SMDR is only recorded when the call actually finishes.

## TODO

* Handle disconnects properly. Right now it doesn't automatically reconnect.

## Tests

Only tested on the SV9100.