let socket_io = require('socket.io');
let io = socket_io();
let socketApi = {};
let socketCount=0;
//Your socket logic here
socketApi.io = io;
let i=0;

io.on('connection', function(socket){
    console.log("connected");
    // socketCount++;
    socket.on('disconnect', function() {
        console.log('user disconnected');        
        // socketCount--;
        // io.sockets.emit('connected-user',socketCount);
    });

    // socket.on('publish-poll', (message) => {
    //     io.emit('message', { type: 'new-message', text: message });
    //     // Function above that stores the message in the database
    //     databaseStore(message)
    // });
    
    // socket.on('broadcast-poll', function(q) {
    //     io.sockets.emit('new-poll',q); 
    //     i++          
    // });
    // socket.on('set-answer', function(ans) {
    //     io.sockets.emit('answer-poll',ans);        
    // });

    // io.sockets.emit('connected-user',socketCount);  
    

  });
module.exports = socketApi;