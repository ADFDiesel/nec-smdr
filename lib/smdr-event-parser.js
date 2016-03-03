'use strict';

const _ = require('lodash');

module.exports = function parseEventData (_data) {

    var data = _.trim(_data.toString());

    data = data.replace(/\s+/g, ' ');

    console.log('DATA: ' + data);

    var eventData = {
        'class': data[0],
        'time'
    };

    return data.split(' ');

};