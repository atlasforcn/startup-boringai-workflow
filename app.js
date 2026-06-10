const statusLabels = { draft: "草稿", review: "審核", done: "可交付" };

let tasks = [
  { id: 1, title: "客服回覆摘要", owner: "Mina", status: "done", quality: 91, hours: 4, prompt: "保留問題、情緒、下一步。" },
  { id: 2, title: "商品頁文案改寫", owner: "Kai", status: "review", quality: 83, hours: 3, prompt: "輸出三種語氣並標示受眾。" },
  { id: 3, title: "會議紀錄行動項", owner: "Rae", status: "draft", quality: 76, hours: 2, prompt: "擷取決議、負責人與期限。" },
  { id: 4, title: "市場訪談分類", owner: "Jin", status: "done", quality: 88, hours: 5, prompt: "依痛點、替代方案、付費意願分類。" },
];

let models = [
  { name: "快速模型", score: 82, note: "成本低，適合草稿。" },
  { name: "平衡模型", score: 89, note: "品質穩定，適合日常交付。" },
  { name: "嚴謹模型", score: 94, note: "引用與格式最佳。" },
];

const taskBoard = document.querySelector("#taskBoard");
const statusFilter = document.querySelector("#statusFilter");
const promptForm = document.querySelector("#promptForm");
const modelList = document.querySelector("#modelList");
const rerank = document.querySelector("#rerank");

function avg(items, field) {
  return Math.round(items.reduce((sum, item) => sum + item[field], 0) / Math.max(items.length, 1));
}

function updateMetrics() {
  const done = tasks.filter((task) => task.status === "done").length;
  document.querySelector("#taskCount").textContent = tasks.length;
  document.querySelector("#promptCount").textContent = tasks.length;
  document.querySelector("#qualityScore").textContent = avg(tasks, "quality");
  document.querySelector("#savedHours").textContent = tasks.reduce((sum, task) => sum + task.hours, 0);
  document.querySelector("#deliveryRate").textContent = `${Math.round(done / tasks.length * 100)}%`;
}

function filteredTasks() {
  return tasks.filter((task) => statusFilter.value === "all" || task.status === statusFilter.value);
}

function renderTasks() {
  taskBoard.innerHTML = filteredTasks().map((task) => `
    <article class="task-card">
      <span class="tag">${statusLabels[task.status]}</span>
      <div>
        <h3>${task.title}</h3>
        <p>${task.owner} / 節省 ${task.hours} 小時</p>
      </div>
      <p>${task.prompt}</p>
      <div class="score">${task.quality} 分</div>
    </article>
  `).join("");
}

function renderModels() {
  modelList.innerHTML = models.map((model) => `
    <article class="model-item">
      <strong>${model.name}</strong>
      <div class="meter"><span style="width: ${model.score}%"></span></div>
      <p>${model.score} 分 / ${model.note}</p>
    </article>
  `).join("");
}

promptForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(promptForm);
  tasks.unshift({
    id: Date.now(),
    title: data.get("title"),
    owner: "新成員",
    status: "draft",
    quality: 72,
    hours: 1,
    prompt: data.get("prompt"),
  });
  promptForm.reset();
  renderTasks();
  updateMetrics();
});

statusFilter.addEventListener("input", renderTasks);
rerank.addEventListener("click", () => {
  models = models.map((model, index) => ({ ...model, score: Math.min(98, model.score + 2 + index) }));
  renderModels();
});

renderTasks();
renderModels();
updateMetrics();
