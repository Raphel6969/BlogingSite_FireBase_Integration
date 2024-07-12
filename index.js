const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyAAsyNrOBrZHjGEQDrGBMUGQMby7m-JPfo",
  authDomain: "atmp1-e68c1.firebaseapp.com",
  projectId: "atmp1-e68c1",
  storageBucket: "atmp1-e68c1.appspot.com",
  messagingSenderId: "724490524560",
  appId: "1:724490524560:web:4d3480cceb93537dc4c515",
});

const db = firebaseApp.firestore();
const btn = document.querySelector(".subBtn");

btn.addEventListener("click", (e) => {
  e.preventDefault()
  onSubmit();
});

const onSubmit = () => {
  const data = document.getElementById("inputTxt").innerHTML;

  if (data != "") {
    const time = new Date();
    const ogTime = `${time.getDate()}/${time.getMonth()}/${time.getFullYear()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;

    db.collection("thoughts")
      .add({
        data: data,
        time: ogTime,
      })
      .then((docRef) => {
        console.log("Document written in ID: ", docRef.id);
        location.reload();
      })
      .catch((err) => {
        console.log("Error in doc: ", err);
      });
  } else {
    alert("Write something bitch");
  }
};

const readData = () => {
  db.collection("thoughts")
    .get()
    .then((data) => {
      writeData(data);
    });
};
readData();

const writeData = (data) => {
  const parent = document.querySelector(".parent");
  const arr = data.docs.map((item) => {
    return { ...item.data(), id: item.id };
  });
  console.log(arr);
  arr.sort((a, b) => {
    // Convert time strings to Date objects
    const timeA = new Date(a.time);
    const timeB = new Date(b.time);
  
    // Compare the Date objects
    return timeB - timeA;
  })
  .map((block) => {
    let html = `<li>
    <p class="element" id="${block.id}"><span class="dataTime">${block.time}</span> 
        <span class="data">${block.data}</span></p>
      </li>`;
    parent.innerHTML += html;
  });
};
