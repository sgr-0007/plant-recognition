let name = null;
let roomNo = null;
let socket = io();
let plantid = "";

//TODO : get the name from session

function init() {   
    const urlParams = new URLSearchParams(window.location.search);
     plantid = urlParams.get('plantid');
     roomNo  = plantid;
     connectToRoom();
    // called when someone joins the room. If it is someone else it notifies the joining of the room
    socket.on('joined', function (room, userId) {
        if (userId === name) {
            // it enters the chat
            hideLoginInterface(room, userId);
        } else {
            // notifies that someone has joined the room
            writeOnHistory('<b>'+userId+'</b>' + ' joined room ' + room);
        }
    });
    // called when a message is received
    socket.on('chat', function (room, userId, chatText) {
        let who = userId
        if (userId === name) who = 'Me';
        writeOnHistory('<b>' + who + ':</b> ' + chatText);
    });

    getChat();
}

/**
 * called when the Send button is pressed. It gets the text to send from the interface
 * and sends the message via  socket
 */
function sendChatText() {
    let chatText = document.getElementById('chat_input').value;
    socket.emit('chat', roomNo, name, chatText);
    //call the API to save the chat
    saveChat();
}

function saveChat() {
    let chatText = document.getElementById('chat_input').value;
    let chat = {
        comment: chatText,
        commentedby: name
    }
    console.log('Chat:', chat);
    fetch(`http://localhost:3000/api/plantdetails/${plantid}/comments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(chat),
    })
        .then(response => response.json())
        .then(data => {
            console.log('ChatSuccess:', data);
        })
        .catch((error) => {
            console.error('ChatError:', error);
        });
}

function getChat() {
    fetch(`http://localhost:3000/api/plantdetails/${plantid}/comments`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log('getChatSuccess:', data);
            data.comments.forEach(comment => {
                let who = comment.commentedby
                if (comment.commentedby === name) who = 'Me';
                writeOnHistory('<b>' + who + ':</b> ' + comment.comment);
            });
        })
        .catch((error) => {
            console.error('getChatError:', error);
        });
}



function connectToRoom() {
    name = "sagar";
    if (!name) name = 'Unknown-' + Math.random();
    socket.emit('create or join', roomNo, name);
}
/**
 * it appends the given html text to the history div
 * @param text: teh text to append
 */
function writeOnHistory(text) {
    let history = document.getElementById('history');
    let paragraph = document.createElement('p');
    paragraph.innerHTML = text;
    history.appendChild(paragraph);
    document.getElementById('chat_input').value = '';
}

/**
 * it hides the initial form and shows the chat
 * @param room the selected room
 * @param userId the user name
 */
function hideLoginInterface(room, userId) {

    document.getElementById('who_you_are').innerHTML= userId;
    document.getElementById('in_room').innerHTML= ' '+room;
}

