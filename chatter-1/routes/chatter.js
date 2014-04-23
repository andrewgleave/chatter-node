var ServiceName = 'Chatter';

module.exports = {
    attach: function(io) {
        
        var names = [];
        io.sockets.on('connection', function(socket) {
            
            socket.on('send', function(data) {
                socket.get('name', function(err, name) {
                    io.sockets.emit('update', name, data);
                });
            })
            .on('add', function(name) {
                // add the client's username to the global list
                if(names.indexOf(name) === -1) {
                    names.push(name);
                    socket.set('name', name, function() {
                        socket.emit('update', ServiceName, 'You\'re connected!');
                        socket.broadcast.emit('update', ServiceName, name + ' has joined the room');
                        io.sockets.emit('refresh-users', names);
                    });
                }
            })
            .on('disconnect', function(){
                socket.get('name', function(err, name) {
                    var index = names.indexOf(name);
                    if(index !== -1) {
                        names.splice(index, 1);
                        io.sockets.emit('refresh-users', names);
                        socket.broadcast.emit('update', ServiceName, name + ' has left the room');
                    }
                });
            });
        });
    }
}