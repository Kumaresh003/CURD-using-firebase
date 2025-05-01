import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove, set } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

const appset = {
    databaseURL: "https://curd-723ad-default-rtdb.firebaseio.com/",
};

const app = initializeApp(appset);
const database = getDatabase(app);
const userListDB = ref(database, "users");

const idEl = document.querySelector("#si");
const nameEl = document.querySelector("#name");
const ageEl = document.querySelector("#age");
const cityEl = document.querySelector("#city");
const tblbodyEl = document.querySelector("#tblbody");
const fm = document.querySelector("#fm");

fm.addEventListener("submit", function(e){
    e.preventDefault();
    
    if(!nameEl.value.trim() || !ageEl.value.trim() || !cityEl.value.trim()){
        alert("Please fill all detils");
        return;
    }

    const newUser = {
        name:nameEl.value.trim(),
        age:ageEl.value.trim(),
        city:cityEl.value.trim(),
    };

    if(idEl.value){
        set(ref(database, "users/" + idEl.value), newUser);
        fm.reset();
        idEl.value = "";
        document.querySelectorAll("input").forEach(input => input.classList.remove("hval"));
        return;
    }
 
    push(userListDB, newUser);  
    fm.reset();

    document.querySelectorAll("input").forEach(input => input.classList.remove("hval"));
});

onValue(userListDB,function(snapshot){
    if(snapshot.exists()){
        let uarray = Object.entries(snapshot.val());
        tblbodyEl.innerHTML = "";
        for(let i = 0; i < uarray.length; i++){
            let cuser = uarray[i];
            let cuserID = cuser[0];
            let cuserValue = cuser[1];

            tblbodyEl.innerHTML += `<tr>
                <td>${i + 1}</td>
                <td>${cuserValue.name}</td>
                <td>${cuserValue.age}</td>
                <td>${cuserValue.city}</td>
                <td>
                    <button class="e-btn" data-id="${cuserID}">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h357l-80 80H200v560h560v-278l80-80v358q0 33-23.5 56.5T760-120H200Zm280-360ZM360-360v-170l367-367q12-12 27-18t30-6q16 0 30.5 6t26.5 18l56 57q11 12 17 26.5t6 29.5q0 15-5.5 29.5T897-728L530-360H360Zm481-424-56-56 56 56ZM440-440h56l232-232-28-28-29-28-231 231v57Zm260-260-29-28 29 28 28 28-28-28Z"/></svg>
                    </button>
                </td>
                <td>
                    <button class="d-btn" data-id="${cuserID}">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                    </button>
                </td>
            </tr>`

        }
    } else{
        tblbodyEl.innerHTML = "<tr><td colspan='6'>No Data</td></tr>";
    }
});

document.addEventListener("click", (e) => {
    if(e.target.classList.contains("e-btn")){
        const id = e.target.dataset.id;
        const tdEl = e.target.closest("tr").children;
        idEl.value = id;
        nameEl.value = tdEl[1].textContent;
        ageEl.value = tdEl[2].textContent;
        cityEl.value = tdEl[3].textContent;

        [nameEl, ageEl, cityEl].forEach(input => {
            if (input.value.trim() !== "") {
                input.classList.add("hval");
            } else {
                input.classList.remove("hval");
            }
        });

    } else if(e.target.classList.contains("d-btn")) {
        if(confirm("Are you sure to delete?")){
            const id = e.target.dataset.id;
            let data = ref(database, `users/${id}`);
            remove(data);
        }
    }
});


// check input
document.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", () => {
        if(input.value.trim() !== ""){
            input.classList.add("hval");
        } else{
            input.classList.remove("hval");
        }
    });
});


