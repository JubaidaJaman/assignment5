const API="https://phi-lab-server.vercel.app/api/v1/lab/issues"

let allIssues=[]

function login(){
  let user=document.getElementById("username").value
  let pass=document.getElementById("password").value

  if(user==="admin" && pass==="admin123"){
    document.getElementById("loginPage").style.display="none"
    document.getElementById("mainPage").classList.remove("hidden")
    loadIssues()
  }else{
    alert("Invalid Credentials")
  }
}

async function loadIssues(){
  let res=await fetch(API)
  let data=await res.json()
  allIssues=data.data
  displayIssues(allIssues)
}

function displayIssues(issues){
  let container=document.getElementById("issuesContainer")
  container.innerHTML=""

  document.getElementById("issueCount").innerText=issues.length+" Issues"

  issues.forEach(issue=>{
    let div=document.createElement("div")
    div.className="card"

    if(issue.status==="closed"){
      div.classList.add("closed")
    }

    div.innerHTML=`
      <div class="card-header">
        <img src="images/${issue.status==="open"?"Open-Status.png":"Closed-Status.png"}" width="18">
        <span class="priority ${issue.priority.toLowerCase()}">${issue.priority}</span>
      </div>
      <div class="card-title">${issue.title}</div>
      <div class="card-desc">${issue.description}</div>
      <div class="labels">
        <span class="label bug">BUG</span>
        <span class="label help">HELP WANTED</span>
      </div>
      <div class="card-footer">
        #${issue.id} by ${issue.author}
        <br>
        ${new Date(issue.createdAt).toLocaleDateString()}
      </div>
    `

    div.onclick=()=>openModal(issue)
    container.appendChild(div)
  })
}

function changeTab(type,btn){
  document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"))
  btn.classList.add("active")

  let filtered=allIssues
  if(type==="open"){
    filtered=allIssues.filter(i=>i.status==="open")
  }
  if(type==="closed"){
    filtered=allIssues.filter(i=>i.status==="closed")
  }
  displayIssues(filtered)
}

async function searchIssue(){
  let text=document.getElementById("searchInput").value
  let url=`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${text}`
  let res=await fetch(url)
  let data=await res.json()
  displayIssues(data.data)
}

function openModal(issue){
  document.getElementById("modal").style.display="flex"
  document.getElementById("modalTitle").innerText=issue.title
  document.getElementById("modalDesc").innerText=issue.description
  document.getElementById("modalAuthor").innerText=issue.author
  document.getElementById("modalStatus").innerText=issue.status
  document.getElementById("modalPriority").innerText=issue.priority
  document.getElementById("modalDate").innerText=new Date(issue.createdAt).toLocaleDateString()
}

function closeModal(){
  document.getElementById("modal").style.display="none"
}