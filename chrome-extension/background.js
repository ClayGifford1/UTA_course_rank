const firebaseConfig = {
  apiKey: "AIzaSyDbGq-_w7iBzjmCncRVHeUovDsZNuaID3Q",
  authDomain: "course-rank.firebaseapp.com",
  databaseURL: "https://course-rank-default-rtdb.firebaseio.com",
  projectId: "course-rank",
  storageBucket: "course-rank.appspot.com",
  messagingSenderId: "303355690951",
  appId: "1:303355690951:web:97eb35208734ced587a3e2",
  measurementId: "G-9D8S1QQCY5"
};

const app = firebase.initializeApp(firebaseConfig);
const db = app.database().ref();

db.child("Christoph Csallner").get().then((snapshot) => {
  if (snapshot.exists()) {
    console.log(snapshot.val());
  } else {
    console.log("No data available");
  }
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.command === "fetch")
      {
        db.child(request.data).get().then((snapshot) => {
          if (snapshot.exists()) {
            sendResponse(snapshot.val());
          }
          else {
            sendResponse(0);
          }
        });
      }
  }
);