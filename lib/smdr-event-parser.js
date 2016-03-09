'use strict';

const _ = require('lodash');
const moment = require('moment');

const VALID_CALL_TYPES = {
    'POT': true,
    'POTA': true,
    'PIN': true,
    'PTRS': true,
    'IVIN': true,
    'ICM': true
};

module.exports = function parseEventData (data) {

    var type = _.trim(data.substring(0, 4));
    var time = _.trim(data.substring(5, 10));
    var date = _.trim(data.substring(11, 16));
    var line = _.trim(data.substring(17, 21));
    var duration = _.trim(data.substring(22, 30));
    var station = _.trim(data.substring(31, 41));
    var numberDialed = _.trim(data.substring(42, 62));
    var accountNumber = _.trim(data.substring(63, 79));

    if ( !VALID_CALL_TYPES[type] ) return false;

    var now = moment();
    var timeField = time.split(':');
    var dateField = date.split('/');
    var callDuration = duration.split(':');

    var momentDateObj = {
        years: now.year(),
        months: parseInt(dateField[0]) - 1,
        days: dateField[1],
        hours: timeField[0],
        minutes: timeField[1]
    };

    var momentDurationObj = {
        hours: callDuration[0],
        minutes: callDuration[1],
        seconds: callDuration[2]
    };

    var startedAt = moment(momentDateObj).format();
    var durationInSeconds = moment.duration(momentDurationObj).asSeconds();

    return { type, startedAt, line, durationInSeconds, station, numberDialed, accountNumber };

};