
// same file for singup, login and main todo html
// same dom manipulation, data is pushed to backend through axios(which is an asynchronous operation) 
// for signup page
document.querySelector("#sgbutton")?.addEventListener("click",
   async () => {
      let username = document.querySelector("#sg-ip1").value
      let email = document.querySelector("#sg-ip2").value
      let password = document.querySelector("#sg-ip3").value

      if (username == "" || email == "" || password == "") {
         alert("input fields are empty")
      }
      const signupValue = await axios.post("http://localhost:3000/signup", (
         {
            "username": username,
            "email": email,
            "password": password
         }
      )
      )

      //  redirecting it to the login page 

      const signUp = signupValue.data.done
      if (signUp) {
         window.location.href = "logIn.html"
      }
      else {
         alert(signupValue.message)
      }
   })



// for the login page
document.querySelector("#lgbtn")?.addEventListener("click", async () => {

   const username = document.querySelector("#lgip1").value
   const password = document.querySelector("#lgip2").value

   if (username == "" || password == "") {
      alert("input fields are empty")
   }

   const token = await axios.post("http://localhost:3000/login", (
      {
         "username": username,
         "password": password
      }

   ))

   const realtoken = token.data.token

   Cookies.set('acesstoken', realtoken)
   const checked = token.data.done
   if (checked) {
      window.location.href = "index.html"
   }
   // if error is there
   const prob = token.data.message
   if (prob) {
      alert(prob)
   }
}
);

//  for the main todo page 
document.querySelector("#button").addEventListener("click", async () => {
   let task = document.querySelector("#input").value
   // console.log(task);

   if (task === "") {
      alert("task is empty")
   }
   else {

      //   access token from the cookies
      let token = Cookies.get('acesstoken');
      // console.log(token)
      //   always send the token that is give to user in the header
      const neededtodo = await axios.post("http://localhost:3000/todo_me",

         { todo: task },
         {
            headers: {
               "Authorization": `Bearer ${token}`,
               "Content-Type": "application/json"
            }
         }

      )

      let aptask = neededtodo.data.todo
      if (aptask) {
         document.querySelector("#input").value = ""
      }
      let spanEl = document.createElement("span")
      spanEl.setAttribute("id", "todo-span")
      spanEl.innerHTML = aptask


      let checkbox = document.createElement("input")
      checkbox.setAttribute('type', "checkbox")
      checkbox.setAttribute("id", "todoCheck")


      let del = document.createElement("button")
      del.setAttribute("id", "todo-del")
      del.innerHTML = "delete"


      // creating edit and add functionality 
      let edit = document.createElement("button")
      edit.setAttribute("id", "todo-edit")
      edit.innerHTML= "edit"


      //<------- event section for task specific element-------->

      // event on checkbox
      checkbox.addEventListener("change", () => {

         spanEl.style.textDecoration = "line-through"
         spanEl.style.opacity = "0.4"
      })


      // event for delete
      del.addEventListener("click", async () => {

         let token = Cookies.get("acesstoken")
         let mainDel = spanEl.textContent
         // console.log(mainDel)
         const successDelete = await axios.delete("http://localhost:3000/delete",
            {
               "task": mainDel
            },

            {
               headers: {
                  "Authorization": `Bearer ${token}`
               }

            }
         )
         const neededDel = successDelete.data.message
         if (neededDel) {
            mainDiv.remove()

         } else (
            alert("task is not deleted")
         )
      })

      //  event for edit button

      edit.addEventListener("click",
         async () => {
            const token = Cookies.get("acesstoken")
            const neededTask = spanEl.textContent

            const rtask = await axios.put("http://localhost:3000/update",
               {
                  "task": neededTask

               },
               {
                  headers: {
                     "Authorization": `Bearer ${token}`
                  }
               }
            )
            const editTask = rtask.data.task
            // console.log(editTask)
            if (editTask) {
               document.querySelector("#input").value = editTask;
               mainDiv.remove()
            }
         })
      //                              < ----- appending section---->
      //   append all these tasks to display
      let mainDiv = document.createElement("div")
      mainDiv.setAttribute("id", "mainDiv")
      mainDiv.append(checkbox, spanEl, del, edit)

      document.querySelector("#display").append(mainDiv);

   }
},
)
