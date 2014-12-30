'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Grade Schema
 */
var GradeSchema = new Schema({
    grade: Number,
    comment: String, 
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
});

/**
 * Article Schema
 */
var articleSchema = {
    created: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        default: '',
        trim: true,
        required: 'Title cannot be blank'
    },
    content: {
        type: String,
        default: '',
        trim: true
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    file: {
        type: Schema.ObjectId,
        ref: 'Grid'
    },
    version: Number,
    grades: [GradeSchema]
};

var ArticleSchema = new Schema(articleSchema);

mongoose.model('Article', ArticleSchema);

var articleHistorySchema = {
    originalArticle: {
        type: Schema.ObjectId,
        ref: 'Article'
    }
};
// Inherits the ArticleSchema
articleHistorySchema.prototype = articleSchema;

var ArticleHistorySchema = new Schema(articleHistorySchema);

mongoose.model('ArticleHistory', ArticleHistorySchema);