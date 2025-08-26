// Simple Voice Command Shopping Assistant (no backend)
// Save / load from localStorage
const LS_KEY = "vcsa_items_v1";
const HISTORY_KEY = "vcsa_history_v1";

let items = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
let history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");

// DOM
const micBtn = document.getElementById("mic-btn");
const statusEl = document.getElementById("status");
const transcriptEl = document.getElementById("transcript");
const shoppingListEl = document.getElementById("shopping-list");
const suggestListEl = document.getElementById("suggest-list");
const langSelect = document.getElementById("lang");
const manualInput = document.getElementById("manual-input");
const manualAddBtn = document.getElementById("manual-add-btn");
const clearBtn = document.getElementById("clear-btn");
const exportBtn = document.getElementById("export-btn");

// Basic category keywords
const CAT_MAP = {
  dairy: ["milk","cheese","yogurt","butter"],
  produce: ["apple","banana","orange","tomato","potato","onion","garlic","spinach","mango"],
  bakery: ["bread","bun","croissant"],
  drinks: ["water","juice","tea","coffee","cola","milkshake","soda"],
  snacks: ["chips","biscuits","cookies","namkeen"],
  household: ["detergent","soap","shampoo","toothpaste","cleaner"]
};

// Simple substitute map
const SUBSTITUTES = {
  milk: ["almond milk", "soy milk"],
  eggs: ["tofu"],
  sugar: ["honey"]
};

// Seasonal produce by month (0-based)
const SEASONAL = {
  0: ["orange"], 1:["orange"], 2:["mango"], 3:["mango"], 4:["mango","berries"],
  5:["mango","lychee"], 6:["cucumber"], 7:["watermelon"], 8:["apple"],
  9:["apple"], 10:["orange"], 11:["orange"]
};

// Speech recognition setup (browser-dependent)
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;
let listening = false;
if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.onstart = () => { listening = true; updateUIListening(); statusEl.textContent = "Listening..." }
  recognition.onend = () => { listening = false; updateUIListening(); statusEl.textContent = "Idle" }
  recognition.onerror = (e) => {
    listening = false; updateUIListening();
    statusEl.textContent = "Error: " + (e.error || e.message);
  }
  recognition.onresult = (e) => {
    const text = e.results[0][0].transcript.trim();
    transcriptEl.textContent = text;
    handleCommand(text);
  }
} else {
  statusEl.textContent = "SpeechRecognition not supported in this browser.";
  micBtn.disabled = true;
}

// helpers
function save() {
  localStorage.setItem(LS_KEY, JSON.stringify(items));
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}
function updateUIListening(){
  micBtn.classList.toggle("listening", listening);
  micBtn.textContent = listening ? "🎙️ Listening..." : "🎤 Start";
  micBtn.setAttribute("aria-pressed", listening ? "true" : "false");
}

// parsing: pick quantity, item name, command
function parseCommand(text){
  const t = text.toLowerCase();
  // quantity
  const qMatch = t.match(/(\d+)\s*(?:kg|g|bottles|bottle|pcs|packs|pack|liters|liter)?/);
  const qty = qMatch ? parseInt(qMatch[1],10) : 1;

  // under $ pattern
  const priceMatch = t.match(/under\s*\$?(\d+(\.\d+)?)/);
  const priceFilter = priceMatch ? parseFloat(priceMatch[1]) : null;

  return { raw: t, qty, priceFilter };
}

function commandIsAdd(text){
  return /\b(add|i need|buy|please add|put|want)\b/.test(text);
}
function commandIsRemove(text){
  return /\b(remove|delete|dont want|cancel)\b/.test(text);
}
function commandIsSearch(text){
  return /\b(find|search|show me|where)\b/.test(text);
}

// categorize simple
function categorize(name){
  const n = name.toLowerCase();
  for(const [cat, keys] of Object.entries(CAT_MAP)){
    for(const k of keys){
      if(n.includes(k)) return cat;
    }
  }
  return "other";
}

function findSubstitute(name){
  for(const key of Object.keys(SUBSTITUTES)){
    if(name.includes(key)) return SUBSTITUTES[key];
  }
  return null;
}

function addItem(name, qty=1){
  name = name.trim();
  if(!name) return;
  // avoid duplicates - if exists, increase qty
  const existing = items.find(it => it.name.toLowerCase() === name.toLowerCase());
  if(existing){
    existing.qty = (existing.qty || 0) + qty;
  } else {
    const it = { id: Date.now()+"_"+Math.random().toString(36).slice(2,8), name, qty, category: categorize(name), createdAt: new Date().toISOString() };
    items.push(it);
  }
  // push to history
  history.unshift({name, ts: Date.now()});
  // limit history size
  history = history.slice(0,200);
  save();
  render();
}

function removeItemByName(name){
  const lower = name.toLowerCase();
  items = items.filter(it => it.name.toLowerCase() !== lower);
  save(); render();
}

function handleCommand(rawText){
  const p = parseCommand(rawText);
  const t = p.raw;

  if(commandIsRemove(t)){
    // attempt to pull item name from text after remove
    const after = t.replace(/\b(remove|delete|dont want|cancel)\b/,"").trim();
    const name = after || t; // fallback
    removeItemByName(name);
    statusEl.textContent = `Removed "${name}".`;
    return;
  }

  if(commandIsSearch(t)){
    // show search results from items or suggest
    const query = t.replace(/\b(find|search|show me|where)\b/,"").trim();
    const results = items.filter(i => i.name.toLowerCase().includes(query));
    transcriptEl.textContent = `Search: ${query} → ${results.length} found`;
    // highlight in UI
    render(results);
    return;
  }

  // default: add
  // try to remove command words
  let namePart = t.replace(/\b(add|i need|buy|please add|put|want|to my list|to the list)\b/g,"").trim();
  // remove quantity words
  namePart = namePart.replace(/\b\d+\s*(kg|g|bottles|bottle|pcs|packs|pack|liters|liter)?\b/g,"").trim();
  // remove trailing words like 'please'
  namePart = namePart.replace(/\bplease\b/,"").trim();

  if(!namePart){
    // fallback: if user said only "add", show prompt
    transcriptEl.textContent = "Couldn't parse item — try: 'Add 2 apples' or type it."
    return;
  }
  addItem(namePart, p.qty || 1);
  transcriptEl.textContent = `Added ${p.qty} × ${namePart}`;
  statusEl.textContent = "Item added";
  // show suggestions and substitutes
  const subs = findSubstitute(namePart);
  if(subs) {
    suggestListEl.innerHTML = `<li>Substitutes for ${namePart}: ${subs.join(", ")}</li>`;
  } else {
    renderSuggestions();
  }
}

// render functions
function render(list = items){
  shoppingListEl.innerHTML = "";
  if(list.length === 0){
    shoppingListEl.innerHTML = "<li class='tiny'>No items — say 'Add milk' or type below.</li>";
    renderSuggestions();
    return;
  }
  list.forEach(it=>{
    const li = document.createElement("li");
    li.className = "item";
    li.innerHTML = `<div>
        <strong>${it.name}</strong> <div class="meta">Qty: ${it.qty} • ${it.category}</div>
      </div>
      <div>
        <button data-id="${it.id}" class="remove-btn">Remove</button>
      </div>`;
    shoppingListEl.appendChild(li);
  });
  // attach remove listeners
  shoppingListEl.querySelectorAll(".remove-btn").forEach(b=>{
    b.addEventListener("click", e=>{
      const id = e.target.getAttribute("data-id");
      items = items.filter(i=>i.id !== id);
      save(); render();
    });
  });
  renderSuggestions();
}

function renderSuggestions(){
  // frequent items from history
  const freq = {};
  history.forEach(h => {
    const n = h.name.toLowerCase();
    freq[n] = (freq[n]||0) + 1;
  });
  const freqArr = Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const suggestions = [];
  if(freqArr.length) suggestions.push("Frequent: " + freqArr.map(r=>r[0]).join(", "));
  // seasonal
  const m = new Date().getMonth();
  const seasonal = SEASONAL[m] || [];
  if(seasonal.length) suggestions.push("Seasonal: " + seasonal.join(", "));
  // fill UI
  suggestListEl.innerHTML = "";
  if(suggestions.length===0){
    suggestListEl.innerHTML = `<li class="tiny">No suggestions yet. Add some items to build suggestions.</li>`;
  } else {
    suggestions.forEach(s=>{
      const li = document.createElement("li");
      li.textContent = s;
      suggestListEl.appendChild(li);
    });
  }
}

// manual UI
manualAddBtn.addEventListener("click", ()=>{
  const t = manualInput.value.trim();
  if(!t) return;
  transcriptEl.textContent = t;
  handleCommand(t);
  manualInput.value = "";
});

// mic controls
micBtn.addEventListener("click", ()=>{
  if(!recognition) return;
  recognition.lang = langSelect.value;
  if(listening){
    recognition.stop();
  } else {
    try {
      recognition.start();
    } catch(err){
      // some browsers disallow rapid start/stop calls
      statusEl.textContent = "Could not start microphone: " + err.message;
    }
  }
});

// clear and export
clearBtn.addEventListener("click", ()=>{
  if(!confirm("Clear full shopping list?")) return;
  items = [];
  save(); render();
});
exportBtn.addEventListener("click", ()=>{
  if(!items.length){ alert("No items to export"); return; }
  const csv = items.map(i=>`"${i.name}",${i.qty},${i.category}`).join("\n");
  const blob = new Blob([csv], {type:"text/csv;charset=utf-8;"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = "shopping-list.csv";
  a.click(); URL.revokeObjectURL(url);
});

// init
render();
renderSuggestions();
