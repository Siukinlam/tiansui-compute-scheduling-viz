/* ===== Element References ===== */
const grid = document.querySelector("#gpuGrid");
const modeButtons = document.querySelectorAll(".mode-button");
const policyButtons = document.querySelectorAll("[data-policy]");
const playButton = document.querySelector("#playScenario");
const resetButton = document.querySelector("#resetView");
const gpuUtil = document.querySelector("#gpuUtil");
const queueLen = document.querySelector("#queueLen");
const wasteRate = document.querySelector("#wasteRate");
const roiScore = document.querySelector("#roiScore");
const utilDelta = document.querySelector("#utilDelta");
const queueDelta = document.querySelector("#queueDelta");
const wasteDelta = document.querySelector("#wasteDelta");
const roiDelta = document.querySelector("#roiDelta");
const queueStatus = document.querySelector("#queueStatus");
const queueBadge = document.querySelector("#queueBadge");
const coreMode = document.querySelector("#coreMode");
const chapterTitle = document.querySelector("#chapterTitle");
const chapterCopy = document.querySelector("#chapterCopy");
const policyDetail = document.querySelector("#policyDetail");
const flowCards = document.querySelectorAll(".flow-card");
const activeCount = document.querySelector("#activeCount");
const idleCount = document.querySelector("#idleCount");
const wasteCount = document.querySelector("#wasteCount");
const gpuTooltip = document.querySelector("#gpuTooltip");
const jobCards = document.querySelectorAll(".job-card");
const toast = document.querySelector("#toast");
const clusterScale = document.querySelector("#clusterScale");
const canvas = document.querySelector("#particleCanvas");
const ctx = canvas.getContext("2d");

/* ===== Policy Descriptions ===== */
const policies = {
  gang: "Gang Scheduling：训练任务必须等待所有需要的 GPU 同时就绪，才能启动。避免部分 GPU 空等。",
  binpack: "Bin Packing：把任务紧凑地放到尽可能少的节点上，减少碎片，提高整机利用率。",
  spread: "Spread：将推理请求分散到多个节点，避免单点过热，保证响应延迟稳定。",
  topology: "Topology-Aware：根据 GPU 之间的网络拓扑（NVLink / InfiniBand）优先就近放置，降低通信延迟。"
};

/* ===== Mode Configurations ===== */
const modes = {
  before: {
    bodyClass: "",
    util: "35%",
    queue: "12",
    waste: "42%",
    roi: "低",
    utilDeltaText: "▼ 利用率低",
    queueDeltaText: "▶ 等待中",
    wasteDeltaText: "⚠ 碎片严重",
    roiDeltaText: "需优化",
    utilDeltaClass: "negative",
    queueDeltaClass: "negative",
    wasteDeltaClass: "negative",
    roiDeltaClass: "",
    queueStatus: "队列拥塞中",
    queueBadge: "12 个等待",
    queueBadgeColor: "",
    core: "闲置 · 错配 · 过度供给",
    title: "未调度：任务在等",
    copy: "左边排队，右边空闲 GPU 很多。调度器还没开始工作，GPU 利用率只有 35%。",
    pattern: ["active","idle","idle","idle","mismatch","idle","idle","over","active","idle","idle","mismatch","idle","mismatch","idle","idle"],
    activeN: 18, idleN: 54, wasteN: 24,
    clusterLabel: "GPU 集群 · 96 卡 — 大量闲置"
  },
  after: {
    bodyClass: "after",
    util: "60%+",
    queue: "6",
    waste: "18%",
    roi: "中",
    utilDeltaText: "▲ 快速提升",
    queueDeltaText: "▶ 分配中",
    wasteDeltaText: "▶ 碎片减少",
    roiDeltaText: "优化中",
    utilDeltaClass: "positive",
    queueDeltaClass: "",
    wasteDeltaClass: "",
    roiDeltaClass: "",
    queueStatus: "正在分配资源",
    queueBadge: "6 个等待",
    queueBadgeColor: "",
    core: "正在匹配任务和 GPU",
    title: "调度中：智能匹配",
    copy: "调度器分析需求、选择策略、分配合适的 GPU。碎片开始减少。",
    pattern: ["active","active","infer","active","protected","active","infer","active","active","infer","active","protected","active","infer","active","active"],
    activeN: 58, idleN: 22, wasteN: 16,
    clusterLabel: "GPU 集群 · 96 卡 — 调度进行中"
  },
  taas: {
    bodyClass: "taas",
    util: "78%+",
    queue: "2",
    waste: "8%",
    roi: "高",
    utilDeltaText: "▲ 已优化",
    queueDeltaText: "✓ 顺畅运行",
    wasteDeltaText: "✓ 碎片极少",
    roiDeltaText: "高效运行",
    utilDeltaClass: "positive",
    queueDeltaClass: "positive",
    wasteDeltaClass: "positive",
    roiDeltaClass: "positive",
    queueStatus: "任务运行中",
    queueBadge: "2 个排队",
    queueBadgeColor: "",
    core: "任务运行并被有效隔离",
    title: "运营中：高效运行",
    copy: "GPU 被充分利用，任务有序执行，利用率从 35% 提升到 78%+。",
    pattern: ["protected","active","infer","protected","active","active","infer","protected","active","active","infer","protected","active","infer","protected","active"],
    activeN: 75, idleN: 13, wasteN: 8,
    clusterLabel: "GPU 集群 · 96 卡 — 高效运行中"
  }
};

let currentMode = "before";
let playTimer = null;
let gpuCells = [];

/* ===== Particle Canvas ===== */
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

const particles = [];
const PARTICLE_COUNT = 40;

function initParticles() {
  particles.length = 0;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.25 + 0.05
    });
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p) => {
    p.x += p.speedX;
    p.y += p.speedY;

    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(10, 158, 108, ${p.alpha})`;
    ctx.fill();
  });

  requestAnimationFrame(animateParticles);
}

resizeCanvas();
initParticles();
animateParticles();
window.addEventListener("resize", () => {
  resizeCanvas();
  initParticles();
});

/* ===== GPU Grid ===== */
function createGrid() {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < 96; i += 1) {
    const cell = document.createElement("span");
    cell.className = "gpu-cell";
    cell.setAttribute("aria-label", `GPU ${i + 1}`);
    cell.setAttribute("data-index", i);

    cell.addEventListener("mouseenter", showTooltip);
    cell.addEventListener("mouseleave", hideTooltip);

    fragment.appendChild(cell);
  }
  grid.appendChild(fragment);
  gpuCells = [...document.querySelectorAll(".gpu-cell")];
}

function showTooltip(e) {
  const cell = e.target;
  const index = cell.dataset.index;
  const state = getCellState(cell);
  const rect = cell.getBoundingClientRect();
  const gridRect = grid.getBoundingClientRect();

  gpuTooltip.querySelector(".tooltip-id").textContent = `GPU #${parseInt(index) + 1}`;
  gpuTooltip.querySelector(".tooltip-status").textContent = state.label;
  gpuTooltip.querySelector(".tooltip-job").textContent = state.job;
  gpuTooltip.hidden = false;

  gpuTooltip.style.left = `${rect.left - gridRect.left + rect.width / 2}px`;
  gpuTooltip.style.top = `${rect.top - gridRect.top - 50}px`;
}

function hideTooltip() {
  gpuTooltip.hidden = true;
}

function getCellState(cell) {
  if (cell.classList.contains("active")) return { label: "有效计算", job: "训练任务运行中" };
  if (cell.classList.contains("infer")) return { label: "推理服务", job: "推理请求处理中" };
  if (cell.classList.contains("protected")) return { label: "租户隔离", job: "租户 A 独占使用" };
  if (cell.classList.contains("mismatch")) return { label: "错配碎片", job: "资源不匹配，无法使用" };
  if (cell.classList.contains("over")) return { label: "过度供给", job: "已分配但未充分利用" };
  return { label: "空闲", job: "等待任务分配" };
}

/* ===== Mode Application ===== */
function applyMode(modeName) {
  const mode = modes[modeName];
  currentMode = modeName;

  document.body.className = mode.bodyClass;

  // Metrics
  gpuUtil.textContent = mode.util;
  queueLen.textContent = mode.queue;
  wasteRate.textContent = mode.waste;
  roiScore.textContent = mode.roi;

  utilDelta.textContent = mode.utilDeltaText;
  utilDelta.className = `metric-delta ${mode.utilDeltaClass}`;
  queueDelta.textContent = mode.queueDeltaText;
  queueDelta.className = `metric-delta ${mode.queueDeltaClass}`;
  wasteDelta.textContent = mode.wasteDeltaText;
  wasteDelta.className = `metric-delta ${mode.wasteDeltaClass}`;
  roiDelta.textContent = mode.roiDeltaText;
  roiDelta.className = `metric-delta ${mode.roiDeltaClass}`;

  // Queue
  queueStatus.textContent = mode.queueStatus;
  queueBadge.textContent = mode.queueBadge;

  // Scheduler
  coreMode.textContent = mode.core;

  // Chapter
  chapterTitle.textContent = mode.title;
  chapterCopy.textContent = mode.copy;

  // Cluster
  clusterScale.textContent = mode.clusterLabel;
  activeCount.textContent = mode.activeN;
  idleCount.textContent = mode.idleN;
  wasteCount.textContent = mode.wasteN;

  // Update summary number colors
  if (modeName === "before") {
    idleCount.classList.add("idle-high");
    activeCount.classList.remove("active-high");
  } else if (modeName === "taas") {
    idleCount.classList.remove("idle-high");
    activeCount.classList.add("active-high");
  } else {
    idleCount.classList.remove("idle-high");
    activeCount.classList.remove("active-high");
  }

  // Mode buttons
  modeButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.mode === modeName);
  });

  // GPU cells
  const pattern = mode.pattern;
  gpuCells.forEach((cell, index) => {
    const state = pattern[index % pattern.length];
    cell.className = `gpu-cell ${state}`;
  });

  // Flow step
  const activeStep = modeName === "before" ? 0 : modeName === "after" ? 2 : 3;
  setFlowStep(activeStep);
}

function setFlowStep(step) {
  flowCards.forEach((card, index) => {
    card.classList.toggle("active", index === step);
  });
}

/* ===== Policy Highlighting ===== */
function highlightPolicy(policyName) {
  policyButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.policy === policyName);
  });
  if (policies[policyName]) {
    policyDetail.innerHTML = `<span class="policy-detail-icon">💡</span><p>${policies[policyName]}</p>`;
  }
}

/* ===== Playback Animation ===== */
function resetJobCards() {
  jobCards.forEach((job) => {
    job.classList.remove("active-flow");
    const fill = job.querySelector(".job-progress-fill");
    if (fill) fill.style.width = "0%";
  });
  gpuCells.forEach((cell) => cell.classList.remove("flash", "allocating"));
}

function animateStep(step) {
  // Highlight job card
  jobCards.forEach((job, index) => {
    job.classList.toggle("active-flow", index === step % jobCards.length);
    const fill = job.querySelector(".job-progress-fill");
    if (fill && index === step % jobCards.length) {
      fill.style.width = `${(step % 4 + 1) * 25}%`;
    }
  });

  // Flash GPU cells — simulate allocation spread
  const policyNames = Object.keys(policies);
  highlightPolicy(policyNames[step % policyNames.length]);

  // Light up a batch of GPU cells
  const batchSize = 8;
  const startIdx = step * batchSize;
  gpuCells.forEach((cell, index) => {
    cell.classList.remove("flash", "allocating");
    if (index >= startIdx && index < startIdx + batchSize) {
      cell.classList.add("allocating");
    }
  });

  setFlowStep(Math.min(3, Math.floor(step / 2)));

  // Update intermediate metrics
  const progress = (step + 1) / 8;
  gpuUtil.textContent = `${Math.round(35 + progress * 43)}%`;
  wasteRate.textContent = `${Math.round(42 - progress * 34)}%`;
  queueLen.textContent = `${Math.round(12 - progress * 10)}`;
  roiScore.textContent = progress > 0.5 ? "中" : progress > 0.8 ? "高" : "低";
  activeCount.textContent = `${Math.round(18 + progress * 57)}`;
  idleCount.textContent = `${Math.round(54 - progress * 41)}`;
  wasteCount.textContent = `${Math.round(24 - progress * 16)}`;
}

function playScenario() {
  clearInterval(playTimer);
  resetJobCards();
  applyMode("after");

  let step = 0;
  animateStep(step);

  playTimer = setInterval(() => {
    step += 1;
    if (step > 7) {
      clearInterval(playTimer);
      resetJobCards();
      applyMode("taas");
      highlightPolicy("topology");
      showToast("调度完成 ✓  利用率从 35% 提升至 78%+");
      return;
    }
    animateStep(step);
  }, 1100);
}

/* ===== Toast ===== */
function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  setTimeout(() => {
    toast.hidden = true;
  }, 3000);
}

/* ===== Event Listeners ===== */
modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    clearInterval(playTimer);
    resetJobCards();
    applyMode(button.dataset.mode);
  });
});

policyButtons.forEach((button) => {
  button.addEventListener("click", () => highlightPolicy(button.dataset.policy));
});

playButton.addEventListener("click", playScenario);

resetButton.addEventListener("click", () => {
  clearInterval(playTimer);
  resetJobCards();
  applyMode("before");
  policyButtons.forEach((btn) => btn.classList.remove("active"));
  policyDetail.innerHTML = '<span class="policy-detail-icon">💡</span><p>点击策略按钮，了解调度器如何做出决策</p>';
  showToast("已重置为初始状态");
});

flowCards.forEach((card) => {
  card.addEventListener("click", () => {
    const step = parseInt(card.dataset.step);
    const modeName = step === 0 ? "before" : step >= 3 ? "taas" : "after";
    clearInterval(playTimer);
    resetJobCards();
    applyMode(modeName);
  });
});

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
  if (e.key === "1") { clearInterval(playTimer); resetJobCards(); applyMode("before"); }
  if (e.key === "2") { clearInterval(playTimer); resetJobCards(); applyMode("after"); }
  if (e.key === "3") { clearInterval(playTimer); resetJobCards(); applyMode("taas"); }
  if (e.key === " " || e.code === "Space") {
    e.preventDefault();
    playScenario();
  }
});

/* ===== Bootstrap ===== */
createGrid();
applyMode(currentMode);
