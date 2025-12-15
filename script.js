const kanaList = [
  "a","i","u","e","o",
  "ka","ki","ku","ke","ko",
  "sa","shi","su","se","so",
  "ta","chi","tsu","te","to",
  "na","ni","nu","ne","no",
  "ha","hi","fu","he","ho",
  "ma","mi","mu","me","mo",
  "ya","yu","yo",
  "ra","ri","ru","re","ro",
  "wa","wo","n"
];

let unused = [...kanaList];
let used = [];

let rollingTimer = null;
let stopTimer = null;

const img = document.getElementById("kanaImage");
const usedList = document.getElementById("usedList");
const remainEl = document.getElementById("remain");
const randomBtn = document.getElementById("randomBtn");
const decideBtn = document.getElementById("decideBtn");
const resetBtn = document.getElementById("resetBtn");
const inputKana = document.getElementById("inputKana");

function updateUI(){
  usedList.textContent = used.join(" / ");
  remainEl.textContent = `残り: ${unused.length} / 46`;
  randomBtn.disabled = unused.length === 0;
  decideBtn.disabled = unused.length === 0;
}
updateUI();

function showImage(kana){
  img.classList.remove("boom");
  img.src = `images/${kana}.jpg`; // ★ jpg対応
  setTimeout(() => img.classList.add("boom"), 40);
}

function randomKana(){
  return unused[Math.floor(Math.random() * unused.length)];
}

function stopRollingAndCommit(finalKana){
  clearInterval(rollingTimer);
  rollingTimer = null;
  clearTimeout(stopTimer);
  stopTimer = null;

  showImage(finalKana);
  used.push(finalKana);
  unused = unused.filter(k => k !== finalKana);
  updateUI();
}

// 🎰 ランダム
randomBtn.addEventListener("click", () => {
  if (rollingTimer || unused.length === 0) return;

  randomBtn.disabled = true;
  decideBtn.disabled = true;

  rollingTimer = setInterval(() => {
    const k = randomKana();
    img.src = `images/${k}.jpg`; // ★ jpg対応
  }, 55);

  stopTimer = setTimeout(() => {
    const finalKana = randomKana();
    stopRollingAndCommit(finalKana);
  }, 2000);
});

// ⌨️ 入力決定
decideBtn.addEventListener("click", () => {
  const val = inputKana.value.trim();
  if (!val) return;

  if (!unused.includes(val)){
    alert("使えない（46音にない）か、すでに終了しています");
    return;
  }
  stopRollingAndCommit(val);
});

// Enterキーでも決定
inputKana.addEventListener("keydown", (e) => {
  if (e.key === "Enter") decideBtn.click();
});

// 🔄 リセット
resetBtn.addEventListener("click", () => {
  if (rollingTimer){
    clearInterval(rollingTimer);
    rollingTimer = null;
  }
  if (stopTimer){
    clearTimeout(stopTimer);
    stopTimer = null;
  }
  unused = [...kanaList];
  used = [];
  img.src = "";
  img.classList.remove("boom");
  inputKana.value = "";
  updateUI();
});
