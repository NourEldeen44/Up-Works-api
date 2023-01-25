const head = document.getElementById("head");
head.style.color = "red";
var socket = io();
const user_id = "63b99cb9b21b54184da319e3";
const chatRoom_id = "63b9ab304a2060baaec319d3";
socket.emit("user connected", user_id);
socket.emit("join", chatRoom_id, user_id);
socket.on("new message", (msg) => {
  console.log(msg);
});
socket.on("error", (msg) => {
  console.log(msg);
});
// const btn = document.getElementById("btn").addEventListener("click", () => {
//   socket.emit("message", "hello from chrome");
// });
function sendMessage(msg) {
  socket.emit("message", { from: "id", to: "id", msg });
  fetch("https://upworks.onrender.com/api/v1/chats/63b9ab304a2060baaec319d3", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzYjgxNWRlMTVjNTYyODFiZTc3MDA1MyIsInVzZXJuYW1lIjoibmFtZSIsInN0YXR1cyI6ImNsaWVudCIsImlhdCI6MTY3MzE4NDU5NCwiZXhwIjoxNjc1Nzc2NTk0fQ.h26V7WdMV5ZW8K3cUYnkDqBYx4EnLDNqof6zYXuF1XY",
    },
    body: JSON.stringify({
      message: "hello this is the 14 messgae from server",
      otherUser_id: "63b99cb9b21b54184da319e3",
    }),
  }).then((res) => {
    console.log(res);
    res.json().then((json) => {
      console.log(json);
    });
  });
}
sendMessage();
