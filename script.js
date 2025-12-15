const kanaMap = {
  a:"あ", i:"い", u:"う", e:"え", o:"お",
  ka:"か", ki:"き", ku:"く", ke:"け", ko:"こ",
  sa:"さ", shi:"し", su:"す", se:"せ", so:"そ",
  ta:"た", chi:"ち", tsu:"つ", te:"て", to:"と",
  na:"な", ni:"に", nu:"ぬ", ne:"ね", no:"の",
  ha:"は", hi:"ひ", fu:"ふ", he:"へ", ho:"ほ",
  ma:"ま", mi:"み", mu:"む", me:"め", mo:"も",
  ya:"や", yu:"ゆ", yo:"よ",
  ra:"ら", ri:"り", ru:"る", re:"れ", ro:"ろ",
  wa:"わ", wo:"を", n:"ん"
};

const kanaList = Object.keys(kanaMap);

let unused = [...kanaList];
let used = [];
let rollingTimer = null;
let stopTimer = null;
let decisionSound = null;

const img = document.getElementById("kanaImage");
const usedList = document.getElementById("usedList");
const remainEl = document.getElementById("remain");
const randomBtn = document.getElementById("randomBtn");
const decideBtn = document.getElementById("decideBtn");
const resetBtn = document.getElementById("resetBtn");
const inputKana = document.getElementById("inputKana");

function updateUI(){
  usedList.textContent = used.map(k=>kanaMap[k]).join(" ");
  remainEl.textContent = `のこり：${unused.length} / 46`;
}

function imgUrl(k){ return `images/${k}.png`; }

function flash(){
  document.body.classList.add("flash");
  setTimeout(()=>document.body.classList.remove("flash"),200);
}

function playSound(){
  if(decisionSound){
    decisionSound.currentTime=0;
    decisionSound.play();
  }
}

function showImage(k){
  img.classList.remove("boom");
  img.src = imgUrl(k);
  setTimeout(()=>img.classList.add("boom"),40);
}

function commit(k){
  showImage(k);
  playSound();
  flash();
  used.push(k);
  unused = unused.filter(x=>x!==k);
  updateUI();
}

randomBtn.onclick = ()=>{
  if(!decisionSound) decisionSound=new Audio("se/decision.mp3");
  if(rollingTimer||unused.length===0) return;

  rollingTimer=setInterval(()=>{
    img.src=imgUrl(unused[Math.floor(Math.random()*unused.length)]);
  },55);

  stopTimer=setTimeout(()=>{
    clearInterval(rollingTimer);
    rollingTimer=null;
    commit(unused[Math.floor(Math.random()*unused.length)]);
  },2000);
};

decideBtn.onclick = ()=>{
  if(!decisionSound) decisionSound=new Audio("se/decision.mp3");
  const hira=inputKana.value.trim();
  const k=Object.keys(kanaMap).find(x=>kanaMap[x]===hira);
  if(!k||!unused.includes(k)) return alert("使えません");
  commit(k);
};

resetBtn.onclick = ()=>{
  clearInterval(rollingTimer);
  clearTimeout(stopTimer);
  rollingTimer=null;
  stopTimer=null;
  unused=[...kanaList];
  used=[];
  img.src="";
  updateUI();
};

updateUI();
