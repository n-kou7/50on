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

const decisionSound = new Audio("se/decision.mp3");
decisionSound.preload = "auto";

const img = document.getElementById("kanaImage");
const usedList = document.getElementById("usedList");
const remainEl = document.getElementById("remain");
const randomBtn = document.getElementById("randomBtn");
const decideBtn = document.getElementById("decideBtn");
const resetBtn = document.getElementById("resetBtn");
const inputKana = document.getElementById("inputKana");

function imgUrl(k){ return `images/${k}.png`; }

function flash(){
  document.body.classList.add("flash");
  setTimeout(()=>document.body.classList.remove("flash"),200);
}

function playSound(){
  decisionSound.currentTime = 0;
  decisionSound.play();
}

function updateUI(){
  usedList.textContent = used.map(k=>kanaMap[k]).join("　");
  remainEl.textContent = `のこり：${unused.length} / 46`;
}

function commit(k){
  img.src = imgUrl(k);
  playSound();
  flash();
  used.push(k);
  unused = unused.filter(x=>x!==k);
  updateUI();
}

randomBtn.onclick = ()=>{
  // iOS解除
  decisionSound.play().then(()=>decisionSound.pause());

  if(rollingTimer || unused.length===0) return;

  rollingTimer = setInterval(()=>{
    img.src = imgUrl(unused[Math.floor(Math.random()*unused.length)]);
  },60);

  stopTimer = setTimeout(()=>{
    clearInterval(rollingTimer);
    rollingTimer=null;
    commit(unused[Math.floor(Math.random()*unused.length)]);
  },2000);
};

decideBtn.onclick = ()=>{
  decisionSound.play().then(()=>decisionSound.pause());

  const hira = inputKana.value.trim().normalize("NFC");
  const k = kanaList.find(key=>kanaMap[key]===hira);

  if(!k || !unused.includes(k)){
    alert("まだ のこっていない ひらがなです");
    return;
  }
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
  inputKana.value="";
  updateUI();
};

updateUI();
