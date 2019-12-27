const msg = require('./msg');
console.log('This is '+msg);

const v = Math.random();

const page = () => 421+v;

module.exports = page;

/*
const msg2 = require('../parcel-transformer-romutest');
console.log('[2] This is '+msg);
*/
