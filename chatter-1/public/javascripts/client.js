window.addEventListener('DOMContentLoaded', function() {
    
    //Util
    function emptyNode(node) {
        while(node.hasChildNodes()) {
            node.removeChild(node.lastChild);
        }
    }
    
    function $(id) {
        return document.getElementById(id);
    }
    
    function sendMessage() {
        var chatBox = $('chat-box');
        var message = chatBox.value.trim();
        if(message.length > 0) {
            socket.emit('send', message);
            chatBox.value = '';
        }
        chatBox.focus();
    }
    
    //Socket Events
    var socket = io.connect('/');
    socket.on('connect', function() {
        var name = prompt('What\'s your name?').trim();
        if(name.length > 1) {
            socket.emit('add', name);
        }
    })
    .on('update', function (username, data) {
        var li = document.createElement('li');
        li.appendChild(document.createTextNode(username + ': ' + data));
        $('messages').appendChild(li);
    })
    .on('refresh-users', function(users) {
        var userList = $('users');
        emptyNode(userList);
        var fragment = document.createDocumentFragment();
        for (var i = 0; i < users.length; i++) {
            var li = document.createElement('li');
            li.appendChild(document.createTextNode(users[i]));
            fragment.appendChild(li);
        }
        userList.appendChild(fragment);
    });
    
    //DOM events
    $('chat-box')
        .addEventListener('keyup', function(e) {
            if(e.which === 13) {
                sendMessage();
            }
    }, false);
    
    $('chat-form')
        .addEventListener('submit', function(e) {
            e.preventDefault();
            sendMessage();
            return false;
        }, false);
});