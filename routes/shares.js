var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var formidable = require('formidable');

var mongoose = require('mongoose');
var Shares = require('../models/shares');