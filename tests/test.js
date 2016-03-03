'use strict';

const SmdrClient = require('../index.js');

const smdrClient = new SmdrClient({ host: '10.7.3.10', port: 2000 });

smdrClient.on('outgoingCall', event => {

    console.log(event);

});



