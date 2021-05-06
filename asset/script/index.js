var stream = document.getElementById('stream');
var messageArea = document.getElementById('messageArea');


let userName = "";

stream.addEventListener('click', () => {
    fetch("http://localhost:3000")
        .then(response => {
            if (flvjs.isSupported()) {
                var videoElement = document.getElementById('videoElement');
                var flvPlayer = flvjs.createPlayer({
                    type: 'flv',
                    url: 'http://localhost:8000/live/STREAM_NAME.flv'
                });
                flvPlayer.attachMediaElement(videoElement);
                flvPlayer.load();
                flvPlayer.play();
            }
        })
})

messageArea.addEventListener('focusin', ()=> {
    var socket = io('http://localhost:3000');
    var inboxPeople = document.querySelector(".inbox__people");
    var messageForm = document.querySelector(".message_form");
    var messageBox = document.querySelector(".messages__history");
    var fallback = document.querySelector(".fallback");


    let userName = "";
    
    var newUserConnected = (user) => {
        userName = user || `User${Math.floor(Math.random() * 1000000)}`;
        socket.emit("new user", userName);
        addToUserBox(userName);
    };
    
    var addToUserBox = (userName) => {
        if(!!document.querySelector(`.${userName}-userlist`)){
            return;
        }
        var userBox = `
            <div class="chat_ib ${userName}-userlist">
                <h5> ${userName} </h5>
                </div>
                `;
        inboxPeople.innerHTML += userBox;
    };

    
    var addNewMessage = ({ user, message }) => {
        var time = new Date();
        var formattedTime = time.toLocaleString("fr-FR",  {hour: "numeric", minute:"numeric"});
        
        var receivedMsg = `
        <div class="incoming__message">
            <div class="recerived__message">
                <p>${message}</p>
                <div class="message__info">
                    <span class="message__author">${user}</span>
                    <span class="time_data">${formattedTime}</span>
                </div>
            </div>
        </div>`;

        var myMsg = `
        <div class="outgoing__message">
            <div class="sent__message">
                <p>${message}</p>
                <div class="message__info">
                    <span class="time_date">${formattedTime}</span>
                </div>
            </div>
        </div> `;

        messageBox.innerHTML += user === userName ? myMsg : receivedMsg;
    };

    newUserConnected();
    
    messageForm.addEventListener("submit", (e) =>{
        e.preventDefault();
        if(!messageArea.value){
            return;
        }
        socket.emit("chat message", {
            message: messageArea.value,
            nick: userName,
        });

        messageArea.value = "";
    });

    messageArea.addEventListener("keyup",()=>{
        socket.emit("typing",{
            isTyping: messageArea.value.length > 0,
            nick: userName,
        });
    });

    socket.on("new user", function (data){
        data.map((user) => addToUserBox(user));
    });

    socket.on("user disconnected", function(userName){
        document.querySelector(`.${userName}-userlist`).remove();
    });

    socket.on("chat message", function(data){
        addNewMessage({user: data.nick, message: data.message });
    });

    

    socket.on("typing", function(data){
        var { isTyping, nick } = data;
        if(!isTyping){
            fallback.innerHTML ="";
            return;
        }
        fallback.innerHTML = `<p>${nick} is typing...</p>`;
    });
})