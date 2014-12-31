'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    extend = require('mongoose-schema-extend');

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
    topic: {
        type: Schema.ObjectId,
        ref: 'Topic'
    },
    version: {
        type: Number,
        default: 0
    },
    grades: [GradeSchema]
};

var ArticleSchema = new Schema(articleSchema);

mongoose.model('Article', ArticleSchema);

var ArticleHistorySchema =  ArticleSchema.extend({
    originalArticle: {
        type: Schema.ObjectId,
        ref: 'Article'
    }
});

mongoose.model('ArticleHistory', ArticleHistorySchema);
