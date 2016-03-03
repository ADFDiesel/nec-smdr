'use strict';

const _ = require('lodash');
const moment = require('moment');

const VALID_CALL_TYPES = {
    'POT': true,
    'PIN': true,
    'PTRS': true,
    'ICM': true
};

module.exports = function parseEventData (data) {

    var smdrRecord = {
        type: _.trim(data.substring(0, 3)),
        time: _.trim(data.substring(5, 10)),
        date: _.trim(data.substring(11, 16)),
        line: _.trim(data.substring(17, 21)),
        duration: _.trim(data.substring(22, 30)),
        station: _.trim(data.substring(31, 41)),
        numberDialed: _.trim(data.substring(42, 62)),
        accountNumber: _.trim(data.substring(63, 79))
    };

    if ( !VALID_CALL_TYPES[smdrRecord.type] ) return false;

    var now = moment();
    var timeField = smdrRecord.time.split(':');
    var dateField = smdrRecord.date.split('/');
    var callDuration = smdrRecord.duration.split(':');

    var momentDateObj = {
        years: now.year(),
        months: dateField[0],
        days: dateField[1],
        hours: timeField[0],
        minutes: timeField[1]
    };

    var momentDurationObj = {
        hours: callDuration[0],
        minutes: callDuration[1],
        seconds: callDuration[2]
    };

    smdrRecord.momentDate = moment(momentDateObj);
    smdrRecord.momentDuration = moment(momentDurationObj);

    return smdrRecord;

};