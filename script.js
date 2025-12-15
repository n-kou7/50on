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

// ★ iOS対策：最初のタップで Audio を「鳴らせる状態」にする
let decisionSound = new Audio("se/decision.mp3");
decisionSound.preload = "auto";

const img = document.getElementById("kanaImage");
const usedList = document.getElementById("usedList");
const remainEl = document.getElementById("remain");
const randomBtn = document.getElementById("randomBtn");
const decideBtn = document.getElementById("decideBtn");
const resetBtn = document.getElementById("resetBtn");
const inputKana = document.getElementById("inputKana");

/* ---------- 共通 ---------- */

function normalizeHiragana(str){
  return str
    .trim()
    .normalize("NFC"); // 結合文字対策
}

function imgUrl(k){
  return `images/${k}.png`;
}

function flash(){
  document.body.classList.add("flash");
  setTimeout(()=>document.body.classList.remove("flash"),200);
}

function playSound(){
  decisionSound.currentTime = 0;
  decisionSound.play();
}

function showImage(k){
  img.classList.remove("boom");
  img.src = imgUrl(k);
  setTimeout(()=>img.classList.add("boom"),40);
}

function updateUI(){
  // ★ 終了音は「ひらがな表示」
  usedList.textContent = used.map(k => kanaMap[k]).join("　");
  remainEl.textContent = `のこり：${unused.length} / 46`;
}

/* ---------- 決定処理 ---------- */

function commit(k){
  showImage(k);
  playSound();   // ★ ユーザー操作内で鳴る
  flash();

  used.push(k);
  unused = unused.filter(x => x !== k);
  updateUI();
}

function stopRollingAndCommit(k){
  clearInterval(rollingTimer);
  clearTimeout(stopTimer);
  rollingTimer = null;
  stopTimer = null;
  commit(k);
}

/* ---------- ランダム ---------- */

randomBtn.addEventListener("click", () => {
  // ★ 無音再生で iOS を解除
  decisionSound.play().then(()=>decisionSound.pause());

  if (rollingTimer || unused.length === 0) return;

  rollingTimer = setInterval(()=>{
    img.src = imgUrl(unused[Math.floor(Math.random()*unused.length)]);
  },55);

  stopTimer = setTimeout(()=>{
    stopRollingAndCommit(
      unused[Math.floor(Math.random()*unused.length)]
    );
  },2000);
});

/* ---------- 入力決定 ---------- */

decideBtn.addEventListener("click", () => {
  // ★ iOS解除
  decisionSound.play().then(()=>decisionSound.pause());

  const hira = normalizeHiragana(inputKana.value);

  const k = kanaList.find(key => kanaMap[key] === hira);

  if (!k || !unused.includes(k)){
    alert("まだ のこっていない ひらがなです");
    return;
  }

  stopRollingAndCommit(k);
});

/* ---------- リセット ---------- */

resetBtn.addEventListener("click", () => {
  clearInterval(rollingTimer);
  clearTimeout(stopTimer);
  rollingTimer = null;
  stopTimer = null;

  unused = [...kanaList];
  used = [];
  img.src = "";
  img.classList.remove("boom");
  inputKana.value = "";
  updateUI();
});

updateUI();
