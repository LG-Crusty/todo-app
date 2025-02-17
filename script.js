
    document.querySelector("#button").addEventListener("click", f1);
    let inp_arr = [];

function f1(){       

    let input = document.querySelector("input").value;   
       
    if (input === "") { alert("task is empty")
    }else {

    inp_arr.push(input);
     
    // creating the span and updating it 
    
    let span = document.createElement("span");
    span.innerHTML = inp_arr;
    span.setAttribute('class', "d-span" )       
              // d-span detones dynamic span and same "d"will be used for buttons and div below;


// creating buttons and adding event listener to them;

let del = document.createElement( "button");
   del.innerHTML = `delete`;
   del.setAttribute('class', "d-del" ) 
   del.addEventListener("click", ()=>{ 

    // using dthis as variable representing delete this 
     let dthis = del.closest("div");
     dthis.remove()
   })

let complete = document.createElement("button");
complete.innerHTML = "completed";
complete.setAttribute('class', "d-complete" ) 
  complete.addEventListener("click", ()=>{ 
    
    // using dcomp to represent  similar to above;
    let dcomp = complete.closest("div");
      dcomp.remove();

  })

// using maindiv variable for the div which contain buttons and span;
  let maindiv =  document.createElement("div");
  maindiv.setAttribute('class', "d-maindiv" ) 

   maindiv.appendChild(span);
   maindiv.appendChild(del);
   maindiv.appendChild(complete);

   document.querySelector("#display").appendChild(maindiv);

inp_arr = [];

} }