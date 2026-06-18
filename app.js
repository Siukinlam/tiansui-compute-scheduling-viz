const grid = document.querySelector("#gpuGrid");
const modeButtons = document.querySelectorAll(".mode-button");
const policyButtons = document.querySelectorAll("[data-policy]");
const playButton = document.querySelector("#playScenario");
const gpuUtil = document.querySelector("#gpuUtil");
const trainEta = document.querySelector("#trainEta");
const roiValue = document.querySelector("#roiValue");
const queueStatus = document.querySelector("#queueStatus");
const coreMode = document.querySelector("#coreMode");
const chapterTitle = document.querySelector("#chapterTitle");
const chapterCopy = document.querySelector("#chapterCopy");
const policyDetail = document.querySelector("#policyDetail");
const flowCards = document.querySelectorAll(".flow-card");

const policies = {
  gang: "需要一组 GPU 同时到位，任务才启动。",
  binpack: "尽量紧凑放置，减少碎片。",
  spread: "把请求分散开，避免某个节点过热。",
  topology: "优先放到通信更近的 GPU 上。"
};

const modes = {
  before: {
    bodyClass: "",
    util: "35%",
    eta: "拥塞",
    roi: "低",
    queue: "等待中",
    core: "任务还没有被合理分配",
    title: "未调度：任务在等",
    copy: "左边排队，右边还有空闲 GPU。",
    pattern: ["active", "idle", "mismatch", "idle", "over", "active", "idle", "mismatch"]
  },
  after: {
    bodyClass: "after",
    util: "60%+",
    eta: "流动",
    roi: "高",
    queue: "分配中",
    core: "正在匹配任务和 GPU",
    title: "调度中：开始匹配",
    copy: "调度器决定谁先跑、用几张卡、放在哪。",
    pattern: ["active", "active", "infer", "active", "protected", "active", "infer", "active"]
  },
  taas: {
    bodyClass: "taas",
    util: "稳定",
    eta: "顺畅",
    roi: "清晰",
    queue: "运行中",
    core: "任务运行并被隔离",
    title: "运行中：资源被用起来",
    copy: "任务开始计算，空闲和等待变少。",
    pattern: ["protected", "active", "infer", "protected", "active", "infer", "protected", "active"]
  }
};

let currentMode = "before";
let playTimer;

function createGrid() {
  const fragment = document.createDocumentFragment();
  for (let index = 0; index < 96; index += 1) {
    const cell = document.createElement("span");
    cell.className = "gpu-cell";
    cell.setAttribute("aria-label", `GPU ${index + 1}`);
    fragment.appendChild(cell);
  }
  grid.appendChild(fragment);
}

function applyMode(modeName) {
  const mode = modes[modeName];
  currentMode = modeName;
  document.body.className = mode.bodyClass;
  gpuUtil.textContent = mode.util;
  trainEta.textContent = mode.eta;
  roiValue.textContent = mode.roi;
  queueStatus.textContent = mode.queue;
  coreMode.textContent = mode.core;
  chapterTitle.textContent = mode.title;
  chapterCopy.textContent = mode.copy;

  modeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === modeName);
  });

  const activeStep = modeName === "before" ? 0 : modeName === "after" ? 2 : 3;
  setFlowStep(activeStep);

  const cells = [...document.querySelectorAll(".gpu-cell")];
  cells.forEach((cell, index) => {
    const state = mode.pattern[index % mode.pattern.length];
    cell.className = `gpu-cell ${state}`;
  });
}

function setFlowStep(step) {
  flowCards.forEach((card, index) => {
    card.classList.toggle("active", index === step);
  });
}

function highlightPolicy(policyName) {
  policyButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.policy === policyName);
  });
  policyDetail.textContent = policies[policyName];
}

function animateStep(step) {
  const jobs = [...document.querySelectorAll(".job-card")];
  const cells = [...document.querySelectorAll(".gpu-cell")];
  jobs.forEach((job, index) => job.classList.toggle("active-flow", index === step % jobs.length));
  cells.forEach((cell, index) => {
    const selected = index % 12 === step || index % 17 === step;
    cell.classList.toggle("flash", selected);
  });

  const policyNames = Object.keys(policies);
  highlightPolicy(policyNames[step % policyNames.length]);
  setFlowStep(Math.min(3, Math.floor(step / 2)));
}

function playScenario() {
  clearInterval(playTimer);
  applyMode("after");
  let step = 0;
  animateStep(step);
  playTimer = setInterval(() => {
    step += 1;
    if (step > 7) {
      clearInterval(playTimer);
      document.querySelectorAll(".job-card").forEach((job) => job.classList.remove("active-flow"));
      document.querySelectorAll(".gpu-cell").forEach((cell) => cell.classList.remove("flash"));
      applyMode("taas");
      highlightPolicy("topology");
      return;
    }
    animateStep(step);
  }, 950);
}

modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    clearInterval(playTimer);
    applyMode(button.dataset.mode);
  });
});

policyButtons.forEach((button) => {
  button.addEventListener("click", () => highlightPolicy(button.dataset.policy));
});

playButton.addEventListener("click", playScenario);

createGrid();
applyMode(currentMode);
