'use strict';

const _ = require('lodash');
const net = require('net');
const smdrEventParser = require('./smdr-event-parser');

const CLASS_TO_EVENTS = {
    'POT': 'outgoingCall',
    'PIN': '',
    'PTRS': '',
    'ICM': ''
};

module.exports = class SmdrClient {

    constructor (opts) {

        if ( _.isUndefined(opts.host) ) throw new Error('Missing host option.');
        if ( _.isUndefined(opts.port) ) throw new Error('Missing port option.');

        this.host = opts.host;
        this.port = opts.port;
        this.netClient = new net.Socket();
        this.listeners = {};
        this.listeners.outgoingCall = [];

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

        this.netClient.on('data', function(data) {

            // call all event callbacks with event data

            let event = smdrEventParser(data);

            if ( event ) {

                let callbacks = this.listeners[CLASS_TO_EVENTS[event.class]];

                _.forEach(callbacks, cb => cb(event));

            }

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