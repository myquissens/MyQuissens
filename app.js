const state={channel:"ogólny",user:localStorage.getItem("myquissens_user")||"Gość",messages:{}};

const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
const initials=name=>(name.trim()[0]||"G").toUpperCase();

function save(){localStorage.setItem("myquissens_state",JSON.stringify(state.messages));}
function load(){
  try{state.messages=JSON.parse(localStorage.getItem("myquissens_state")||"{}")}catch{state.messages={}}
}
function updateUser(){
  $("accountName").textContent=state.user;
  $("memberName").textContent=state.user;
  $("accountAvatar").textContent=initials(state.user);
  $("nameInput").value=state.user;
}
function render(){
  $("channelName").textContent=state.channel;
  $("messageInput").placeholder=`Napisz wiadomość na #${state.channel}...`;
  document.querySelectorAll(".channel").forEach(x=>x.classList.toggle("active",x.dataset.channel===state.channel));
  const box=$("messages"); box.innerHTML="";
  const list=state.messages[state.channel]||[];
  if(!list.length){
    box.innerHTML=`<div class="welcome"><div class="welcome-icon">MQ</div><h1>Witaj na MyQuissens!</h1><p>To początek kanału <b>#${esc(state.channel)}</b>. Napisz pierwszą wiadomość.</p></div>`;
    return;
  }
  list.forEach(m=>{
    const el=document.createElement("div");el.className="message";
    el.innerHTML=`<div class="avatar">${esc(initials(m.user))}</div><div class="message-body"><div class="message-meta"><b>${esc(m.user)}</b><time>${new Date(m.time).toLocaleString("pl-PL")}</time></div><div class="message-text">${esc(m.text)}</div></div>`;
    box.appendChild(el);
  });
  box.scrollTop=box.scrollHeight;
}
function addMessage(text){
  if(!state.messages[state.channel])state.messages[state.channel]=[];
  state.messages[state.channel].push({user:state.user,text,time:new Date().toISOString()});
  state.messages[state.channel]=state.messages[state.channel].slice(-100);
  save();render();
}

document.querySelectorAll(".channel").forEach(btn=>btn.onclick=()=>{
  state.channel=btn.dataset.channel;render();
});

$("composer").onsubmit=e=>{
  e.preventDefault();
  const input=$("messageInput"),text=input.value.trim();
  if(!text)return;
  addMessage(text);input.value="";input.focus();
};

function openModal(){ $("modal").classList.remove("hidden");$("nameInput").focus();}
function closeModal(){ $("modal").classList.add("hidden");}
$("changeName").onclick=openModal;
$("settingsBtn").onclick=openModal;
$("closeModal").onclick=closeModal;
$("saveName").onclick=()=>{
  const name=$("nameInput").value.trim().slice(0,32);
  if(name){state.user=name;localStorage.setItem("myquissens_user",name);updateUser();closeModal();}
};

$("addChannel").onclick=()=>{
  const name=prompt("Nazwa nowego kanału:");
  if(!name?.trim())return;
  const clean=name.trim().replace(/^#/,"").slice(0,30);
  const nav=$("channels");
  if([...nav.querySelectorAll(".channel")].some(x=>x.dataset.channel===clean))return;
  const btn=document.createElement("button");
  btn.className="channel";btn.dataset.channel=clean;btn.innerHTML=`# <span>${esc(clean)}</span>`;
  btn.onclick=()=>{state.channel=clean;render();};
  nav.appendChild(btn);state.channel=clean;render();
};

$("attachBtn").onclick=()=>alert("Załączniki zostaną dodane w kolejnej wersji.");

load();updateUser();render();
