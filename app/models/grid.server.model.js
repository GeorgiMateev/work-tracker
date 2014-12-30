'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var gridSchema = new Schema({},{ strict: false });

var Grid = mongoose.model('Grid', gridSchema, 'fs.files' );