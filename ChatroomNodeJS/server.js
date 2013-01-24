
"use strict";

process.title = 'node-chat';
var webSocketsServerPort = process.env.PORT || 8080;
var webSocketServer = require('websocket').server;

var Encoder = require('node-html-encoder').Encoder;
var encoder = new Encoder('entity');


var webroot = require("path").join(__dirname, 'public');

var nstatic = require('node-static');
var file = new (nstatic.Server)(webroot, {
    cache: 600,
    headers: { 'X-Powered-By': 'node-static' }
});

var http = require('http');
var util = require('util');
var msghistory = [];
var clients = [];

var colors = [
    'red',
    'green',
    'blue',
    'magenta',
    'purple',
    'plum',
    'orange'
];
colors.sort(function (a, b)
{
    return Math.random() > 0.5;
});

var server = http.createServer(function (request, response)
{
    request.addListener('end', function ()
    {
        file.serve(request, response, function (err, result)
        {
            if (err)
            {
                console.error('Error serving %s - %s', request.url, err.message);
                /*
                if (err.status === 404 || err.status === 500) {
                  file.serveFile(util.format('/%d.html', err.status), err.status, {}, request, response);
                } else {
                  response.writeHead(err.status, err.headers);
                  response.end();
                }
                */
            }
            else
            {
                console.log('%s - %s', request.url, response.message);
            }
        });
    });

});

server.listen(webSocketsServerPort, function ()
{
    console.log((new Date()) + " Server is listening on port " + webSocketsServerPort);
});

var wsServer = new webSocketServer({
    httpServer: server
});

wsServer.on('request', function (request)
{
    console.log((new Date()) + ' Connection from origin ' + request.origin + '.');

    var connection = request.accept(null, request.origin);
    var index = clients.push(connection) - 1;
    var userName = '';
    var userColor = '';

    console.log((new Date()) + ' Connection accepted.');

    if (msghistory.length > 0)
    {
        connection.sendUTF(JSON.stringify({
            type: 'history',
            data: encoder.htmlEncode(msghistory || '')
        }));
    }

    connection.on('message', function (message)
    {
        if (message.type === 'utf8')
        {
            if (userName === '')
            {
                userName = message.utf8Data;
                userColor = colors.shift();
                
                connection.sendUTF(JSON.stringify({
                    type: 'color',
                    data: userColor
                }));
                console.log((new Date()) + ' User is known as: ' + userName + ' with ' + userColor + ' color.');
            }
            else
            {
                console.log((new Date()) + ' Received Message from ' + userName + ': ' + message.utf8Data);
                var obj = {
                    time: (new Date()).getTime(),
                    text: encoder.htmlEncode(message.utf8Data),
                    author: encoder.htmlEncode(userName),
                    color: encoder.htmlEncode(userColor)
                };

                msghistory.push(obj);
                msghistory = msghistory.slice(-100);

                var json = JSON.stringify({
                    type: 'message',
                    data: obj
                });

                for (var i = 0; i < clients.length; i++)
                {
                    clients[i].sendUTF(json);
                }
            }
        }
    });

    connection.on('close', function (connection)
    {
        if (userName !== '' && userColor !== '')
        {
            console.log((new Date()) + " Peer " + connection.remoteAddress + " disconnected.");
            clients.splice(index, 1);
            colors.push(userColor);
        }
    });
});
