var http = require('http'),
    static = require('node-static'),
    WebSocketServer = require('ws').Server,
    staticServer = new static.Server('../'),
    httpServer,
    webSocketServer,
    subscribers = {};

httpServer = http.createServer(initHttpServer).listen(8080);
webSocketServer = new WebSocketServer({server: httpServer});
webSocketServer.on('connection', initWebSocketServer);
console.log('web server created on port 8080');

function initHttpServer(request, response) {
    // console.log(request.url.href);
    staticServer.serve(request, response);
}

function initWebSocketServer(ws) {
    var id = Math.random();

    subscribers[id] = ws;

    ws.on('message', function (data) {
        var jsonData = JSON.parse(data);
            message = jsonData.id + ': ' + jsonData.message;

        console.dir(message);
        publish(jsonData);
    });

    ws.on('close', function () {
        console.log('undescribed');
        delete subscribers[id];
        console.log(Object.keys(subscribers));
    });
}

function publish (message) {
    var id,
        message = JSON.stringify(message);
    for (id in subscribers) {
        subscribers[id].send(message);
    }
    console.log(Object.keys(subscribers));
}
