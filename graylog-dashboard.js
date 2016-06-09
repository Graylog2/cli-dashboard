#!/usr/bin/env node

/**
 * This file is part of Graylog2.
 *
 * Graylog2 is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Graylog2 is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Graylog2.  If not, see <http://www.gnu.org/licenses/>.
 */
var fs = require('fs')
var yaml = require('js-yaml')
var argv = require('yargs').usage('Usage: graylog-dashboard --stream-id [stream-id] --host [graylog-server REST API URL]').
	demand(['s', 'h']).
	alias('s', 'stream-id').
	alias('h', 'host').
	alias('c', 'slave').
	alias('q', 'mainq').
	argv
//var graylog = require("./lib/graylog-api.js")
//var ui = require("./lib/screen.js")
//var handlers = require("./lib/handlers.js")
var controller = require("./lib/controller.js")

/*
 *
 *   ┈╱╱▏┈┈╱╱╱╱▏╱╱▏┈┈┈    ┈╱╱▏┈┈╱╱╱╱▏╱╱▏┈┈┈    ┈╱╱▏┈┈╱╱╱╱▏╱╱▏┈┈┈
 *   ┈▇╱▏┈┈▇▇▇╱▏▇╱▏┈┈┈    ┈▇╱▏┈┈▇▇▇╱▏▇╱▏┈┈┈    ┈▇╱▏┈┈▇▇▇╱▏▇╱▏┈┈┈
 *   ┈▇╱▏▁┈▇╱▇╱▏▇╱▏▁┈┈    ┈▇╱▏▁┈▇╱▇╱▏▇╱▏▁┈┈    ┈▇╱▏▁┈▇╱▇╱▏▇╱▏▁┈┈
 *   ┈▇╱╱╱▏▇╱▇╱▏▇╱╱╱▏┈    ┈▇╱╱╱▏▇╱▇╱▏▇╱╱╱▏┈    ┈▇╱╱╱▏▇╱▇╱▏▇╱╱╱▏┈
 *   ┈▇▇▇╱┈▇▇▇╱┈▇▇▇╱┈┈    ┈▇▇▇╱┈▇▇▇╱┈▇▇▇╱┈┈    ┈▇▇▇╱┈▇▇▇╱┈▇▇▇╱┈┈
 *
 *   I have no clue about JavaScript or even node.js and this is
 *   going to be pretty terrible code. It is a wonder that I got
 *   it running at all lol.
 *
 *   I wish this was Java.
 *
 *   Have fun in here! (Lennart, 01/2015)
 *
 */
// CLI arguments
controller.config.streamId = argv.s
controller.config.slaveStream = argv.c
controller.config.mainq = argv.q

var serverUrl = argv.h
// Make sure serverUrl has a trailing slash. (computers.)
var lastChar = serverUrl.substr(-1);
if (lastChar != '/') {
	serverUrl = serverUrl + '/';
}


controller.config.serverUrl = serverUrl;

// Read user credentials.
var credFilePath = process.env['HOME'] + "/.graylog_dashboard"
try {
	var config = yaml.safeLoad(fs.readFileSync(credFilePath, 'utf8'))
} catch (err) {
	throw new Error("Could not read Graylog user credentials file at " + credFilePath + " - Please create it " + "as described in the README. (" + err + ")")
}
// Check config.
if (config.username == undefined) {
	throw new Error("No username defined in " + credFilePath)
}
if (config.password == undefined) {
	throw new Error("No password defined in " + credFilePath)
}
controller.config.apiUser = config.username.toString()
controller.config.apiPass = config.password.toString()


controller.setupHandler();