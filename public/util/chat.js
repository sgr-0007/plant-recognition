let name = localStorage.getItem("username") || prompt('What is your name?');
localStorage.setItem("username", name);

let roomNo = null;
let socket = io();
let plantid = "";

function isOnline() {
    return navigator.onLine;
}

function init() {
    const urlParams = new URLSearchParams(window.location.search);
    plantid = urlParams.get('plantid');
    roomNo = plantid;
    connectToRoom();

    socket.on('joined', handleUserJoinedRoom);
    socket.on('chat', handleChatReceived);

    getChat();
}

function sendChatText() {
    if (!isOnline()) {
        const discussionFormData = {
            plantID: plantid,
            commentedby: name,
            comment: document.getElementById("chat_input").value
        };

        saveChatOffline(discussionFormData.comment);
    } else {
        let chatText = document.getElementById('chat_input').value;
        socket.emit('chat', roomNo, name, chatText);
        saveChat(chatText, Math.floor(Math.random() * 100000) + 1);
    }
}

function saveChatOffline(commentText) {
    openPlantsIDB().then((db) => {
        const plantId = parseInt(plantid);
        getPlantById(db, plantId)
            .then((plant) => {
                if (plant) {
                    const commentID = Math.floor(Math.random() * 10000);
                    const newComment = {
                        commentid: commentID,
                        commentedby: name,
                        comment: commentText
                    };
                    plant.comments.push(newComment);

                    const transaction = db.transaction(["plants"], "readwrite");
                    const plantStore = transaction.objectStore("plants");
                    const updateRequest = plantStore.put(plant);

                    updateRequest.onsuccess = () => {
                        alert("You are offline. Your comment will be synced when you are back online.");
                    };

                    updateRequest.onerror = (event) => {
                        console.error("Error updating plant data:", event.target.error);
                    };
                }
            });
    });
}

function saveChat(chatText, commentId) {
    let chat = {
        updateCommentId: commentId,
        comment: chatText,
        commentedby: name
    };

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
    .then(getChatAndUpdateHistory)
    .catch((error) => {
        console.error('getChatError:', error);
    });
}

function getIdbChatAndPushIntoNetworkDb() {
    openPlantsIDB().then((db) => {
        const plantId = parseInt(plantid);
        getPlantById(db, plantId)
            .then((plant) => {
                if (plant) {
                    const saveChatPromises = [];
                    plant.comments.forEach(comment => {
                        saveChatPromises.push(saveChat(comment.comment, comment.commentid));
                    });

                    Promise.all(saveChatPromises)
                        .then(() => {
                            console.log("All comments saved successfully");
                            getChatAndUpdateHistory(plant);
                        })
                        .catch(error => {
                            console.error("Error saving comments:", error);
                        });
                } else {
                    console.log("PLANT NOT FOUND");
                }
            });
    });
}

window.addEventListener('online', () => {
    alert("You are back online. Your comments will be synced now.");
    getIdbChatAndPushIntoNetworkDb();
});

function connectToRoom() {
    if (!name) name = 'Unknown-' + Math.random();
    socket.emit('create or join', roomNo, name);
}

function handleUserJoinedRoom(room, userId) {
    if (userId === name) {
        hideLoginInterface(room, userId);
    } else {
        writeOnHistory('<b>' + userId + '</b>' + ' joined room ' + room);
    }
}

function handleChatReceived(room, userId, chatText) {
    let who = userId;
    if (userId === name) who = 'Me';
    writeOnHistory('<b>' + who + ':</b> ' + chatText);
}

function writeOnHistory(text) {
    let history = document.getElementById('history');
    let paragraph = document.createElement('p');
    paragraph.innerHTML = text;
    history.appendChild(paragraph);
    document.getElementById('chat_input').value = '';
}

function hideLoginInterface(room, userId) {
    document.getElementById('who_you_are').innerHTML = userId;
    document.getElementById('in_room').innerHTML = ' ' + room;
}
