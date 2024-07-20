// firebase crendentials
const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyAAsyNrOBrZHjGEQDrGBMUGQMby7m-JPfo",
  authDomain: "atmp1-e68c1.firebaseapp.com",
  projectId: "atmp1-e68c1",
  storageBucket: "atmp1-e68c1.appspot.com",
  messagingSenderId: "724490524560",
  appId: "1:724490524560:web:4d3480cceb93537dc4c515",
});

const db = firebaseApp.firestore();
const btn = document.querySelector(".subBtn"); //submit button

//Code from external source helps in to extend the textarea when it changes the line
const textarea = document.querySelector("textarea");
textarea.addEventListener("keyup", (e) => {
  textarea.style.height = "10vh";
  let scHeight = e.target.scrollHeight;
  textarea.style.height = `${scHeight}px`;
});

//initializes the submit action
btn.addEventListener("click", (e) => {
  e.preventDefault();
  onSubmit();
});

const onSubmit = () => {
  //gets the value in the text area
  const data = document.querySelector("textarea").value;

  if (data != "") {
    //gets the time
    const time = new Date();

    // sets the time format
    // const ogTime = `${time.getDate()}/${time.getMonth()}/${time.getFullYear()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;

    //makes connects the firebase and add the time, timeformat, and data
    db.collection("thoughts")
      .add({
        data: data,
        time: time,
        edited: false,
      })
      .then((docRef) => {
        console.log("Document written in ID: ", docRef.id);
        // reloads the window to automatically show the new updated data
        location.reload();
      })
      .catch((err) => {
        console.log("Error in doc: ", err);
      });
  } else {
    //edge case where the textarea is empty but still the submit is clicked
    alert("Write something bitch");
  }
};

//it reads the entire database everytime for a new change
const readData = () => {
  db.collection("thoughts")
    .get()
    .then((data) => {
      writeData(data);
    });
};

// had to run it externally as it gonna send the data to write data which is gonna show the data
readData(); //POTENTIAL BUG AND MEMORY LEAK

const writeData = (data) => {
  const parent = document.querySelector(".parent"); //gets the ul element
  const arr = data.docs.map((item) => {
    //maps through the entire data object
    return { ...item.data(), id: item.id };
  });

  //sorts the data according to the time property
  arr.sort((a, b) => {
    // Convert time strings to Date objects
    const timeA = a.time.seconds;
    const timeB = b.time.seconds;

    // Compare the Date objects
    return timeB - timeA;
  });

  // arr.reverse();
  console.log(arr);

  //maps through each item in the sorted array then pushes the values to the html
  arr.map((block) => {
    // Converted the firestore timestamp to js time stamp and then used it as the new time more in the devlog section
    const jsDate = new Date(block.time.seconds * 1000 + block.time.nanoseconds / 1000000)
    const ogTime = `${jsDate.getDate()}/${jsDate.getMonth()}/${jsDate.getFullYear()} ${jsDate.getHours()}:${jsDate.getMinutes()}:${jsDate.getSeconds()}`;

    let html = `<li id="${block.id}">
        <div class="Btn">
        <button class="save hidden">Save</button>
        <button class="edit" ><img src="icons/edit.svg" alt="Edit"></button>
        <button class="delete"><img src="icons/delete.svg" alt="Delete"></button>
        </div>
    <p class="element" ><span class="dataTime">${ogTime}<span class="edited ${block.edited ? "" : "hidden"}">  (Edited)</span></span> 
        <span contenteditable="false" class="data">${block.data}</span></p>
      </li>`;
    parent.innerHTML += html; //adds the list to the parent ul to show the data
  });
};

// adds interaction to the edit and delete button
document.querySelector(".parent").addEventListener("click", (e) => {
  if (e.target.closest(".edit")) {
    editBtn(e);
  } else if (e.target.closest(".delete")) {
    deleteBtn(e);
  }
});

//lets U edit your own writings (I WANT TO UPDATE THE TIMING TOO)
const editBtn = (e) => {
  const ID = e.target.closest("li").id; //gets the particular ID
  const listItem = document.querySelector(`#${ID}`); //gets the particular list item with that ID
  const data = listItem.querySelector(".data"); // the data in that list item
  const save = listItem.querySelector(".save"); // save button
  const editedSign = listItem.querySelector(".edited") // edited sign beside the time

  data.setAttribute("contenteditable", "true"); // lets u edit
  save.classList.remove("hidden"); // shows the save button which was hidden

  save.addEventListener("click", () => {
    save.classList.add("hidden"); //hides it again after use

    //updates the database with the edited data
    db.collection("thoughts")
      .doc(ID)
      .update({
        data: data.textContent,
        edited: true,
      })
      .then(() => {
        location.reload()
        data.setAttribute("contenteditable", "false"); // again makes it non editable
        alert("Data Updated");
        // editedSign.classList.remove("hidden") // shows that the peiece of thought is edited
      });
  });
};

//removes the clicked element from the database
const deleteBtn = (e) => {
  const decision = prompt("Do you want to delete this ? (type 'yes')")
  if(decision == 'yes'){
    const ID = e.target.closest("li").id;
    db.collection("thoughts")
      .doc(ID)
      .delete()
      .then(() => {
        // alert("Data Deleted");
        location.reload();
      });
  }
};


