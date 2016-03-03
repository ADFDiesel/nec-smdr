'use strict';

const _ = require('lodash');
const net = require('net');
const smdrEventParser = require('./smdr-event-parser');

const TYPE_TO_EVENTS = {
    'POT': 'outgoingCall',
    'PIN': 'incomingCall',
    'PTRS': 'transferedCall',
    'ICM': 'extensionCall'
};

module.exports = class SmdrClient {

    constructor (opts) {

        if ( _.isUndefined(opts.host) ) throw new Error('Missing host option.');
        if ( _.isUndefined(opts.port) ) throw new Error('Missing port option.');

        this.host = opts.host;
        this.port = opts.port;
        this.netClient = new net.Socket();

        this.listeners = {
            outgoingCall: [],
            extensionCall: [],
            transferedCall: [],
            incomingCall: [],
            any: []
        };

        this.connect();

    }

    on (eventName, func) {

        if ( _.isFunction(func) && !_.isUndefined(this.listeners[eventName]) ) {

            this.listeners[eventName].push(func);

        }
        else {

            throw new Error(`Event '${eventName}' is invalid.`);

        }

    }

    connect () {

        this.netClient.connect(this.port, this.host, () => {

            console.log(`Connected to: ${this.host}:${this.port}`);

            this.addListeners();

        });

    }

    addListeners () {

        this.netClient.on('data', _data => {

            // call all event callbacks with event data
            var lines = _data.toString().split('\r\n\n');

            _.forEach(lines, line => {

                let smdrRecord = smdrEventParser(line);

                if ( smdrRecord ) {

                    let callbacks = _.concat(
                        this.listeners[TYPE_TO_EVENTS[smdrRecord.type]],
                        this.listeners.any
                    );

                    _.forEach(callbacks, cb => cb(smdrRecord));

                }

            });

        });

        // Add a 'close' event handler for the client socket
        this.netClient.on('close', function() {
            console.log('Connection closed');
            // reconnect ?
        });

        this.netClient.on('error', function(e) {
            console.log(e);
            // reconnect ?
        });

    }

    closeConnection () {

        // Close the client socket completely
        this.netClient.destroy();

    }

};