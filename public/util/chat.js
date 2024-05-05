let name = null;
let roomNo = null;
let socket = io();
let plantid = "";
var storedUsername = localStorage.getItem("username");
if (storedUsername) {
    name = storedUsername;
} else {
    name = prompt('What is your name?');
    localStorage.setItem("username", name);
}

function isOnline() {
    return navigator.onLine;
}

function init() {

    const urlParams = new URLSearchParams(window.location.search);
    plantid = urlParams.get('plantid');
    roomNo = plantid;
    connectToRoom();
    // called when someone joins the room. If it is someone else it notifies the joining of the room
    socket.on('joined', function (room, userId) {
        if (userId === name) {
            // it enters the chat
            hideLoginInterface(room, userId);
        } else {
            // notifies that someone has joined the room
            writeOnHistory('<b>' + userId + '</b>' + ' joined room ' + room);
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
 * It gets the text to send from the interface
 * and sends the message via  socket
 */
function sendChatText() {
    if (!isOnline()) {
        const discussionFormData = {
            plantID: plantid,
            commentedby: name,
            comment: document.getElementById("chat_input").value
        };
        console.log("Collected suggestion data: ", discussionFormData);
        openPlantsIDB().then((db) => {
            const plantId = parseInt(plantid);
            console.log("PLANT ID: ", plantid);
            getPlantById(db, plantId)
                .then((plant) => {
                    if (plant) {
                        console.log("PLANT FOUND");
                        const commentID = Math.floor(Math.random() * 10000);

                        const newComment = {
                            commentid: commentID,
                            commentedby: discussionFormData.commentedby,
                            comment: discussionFormData.comment
                        };

                        plant.comments.push(newComment);
                        openPlantsIDB().then((db) => {
                            const transaction = db.transaction(["plants"], "readwrite");
                            const plantStore = transaction.objectStore("plants");
                            const updateRequest = plantStore.put(plant);

                            updateRequest.onsuccess = () => {
                                console.log("Plant data updated successfully.");
                                alert("You are offline. Your comment will be saved and synced when you are back online.");
                                
                            };

                            updateRequest.onerror = (event) => {
                                console.error("Error updating plant data:", event.target.error);
                            };
                        })
                        // Update the plant data in IndexedDB
                    } else {
                        console.log("PLANT NOT FOUND");
                    }
                })
        })
    }
    else {
        let chatText = document.getElementById('chat_input').value;
        socket.emit('chat', roomNo, name, chatText);
        saveChat(chatText,Math.floor(Math.random() * 100000) + 1);
    }

}

function saveChat(chatTextInput, commentId) {
    let chatText = chatTextInput;
    let chat = {
        updateCommentId : commentId,
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

function getIdbChatAndPushIntoNetworkDb() {
    openPlantsIDB().then((db) => {
        const plantId = parseInt(plantid);
        console.log("PLANT ID: ", plantid);
        getPlantById(db, plantId)
            .then((plant) => {
                if (plant) {
                    console.log("PLANT FOUND");
                    let history = document.getElementById('history');
                    history.innerHTML = '';
                    plant.comments.forEach(comment => {
                        let who = comment.commentedby
                        if (comment.commentedby === name) who = 'Me';                        
                        writeOnHistory('<b>' + who + ':</b> ' + comment.comment);
                        saveChat(comment.comment, comment.commentid);

                    });
                } else {
                    console.log("PLANT NOT FOUND");
                }
            })
    }
    )
}

// call getsychchat when the network is online using event listener
window.addEventListener('online', () => {
    alert("You are back online. Your comments will be synced now.");
    getIdbChatAndPushIntoNetworkDb();
});
 

function connectToRoom() {

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

    document.getElementById('who_you_are').innerHTML = userId;
    document.getElementById('in_room').innerHTML = ' ' + room;
}


