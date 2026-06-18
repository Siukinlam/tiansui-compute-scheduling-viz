/* ===== Element References ===== */
const grid = document.querySelector("#gpuGrid");
const modeButtons = document.querySelectorAll(".mode-button");
const policyButtons = document.querySelectorAll("[data-policy]");
const playButton = document.querySelector("#playScenario");
const resetButton = document.querySelector("#resetView");
const langButtons = document.querySelectorAll(".lang-btn");
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

/* ====================================================================
   I18N — Trilingual: English (default), 简体中文, 繁體中文
   ==================================================================== */
let currentLang = "en";

const i18n = {
  /* ---- Page title ---- */
  pageTitle: {
    en: "Tiansui Lean Scheduling — Compute Orchestration Visualized",
    "zh-CN": "天遂精益智能调度平台 — 算力调度可视化",
    "zh-TW": "天邃精益智能調度平台 — 算力調度可視化"
  },

  /* ---- Brand ---- */
  brandEyebrow: {
    en: "Tiansui · Lean Intelligent Scheduling",
    "zh-CN": "天遂 · 精益智能调度平台",
    "zh-TW": "天邃 · 精益智能調度平台"
  },
  title1: {
    en: "Compute Scheduling ",
    "zh-CN": "算力调度",
    "zh-TW": "算力調度"
  },
  title2: {
    en: "Visualized",
    "zh-CN": "过程可视化",
    "zh-TW": "過程可視化"
  },

  /* ---- Metrics ---- */
  metricUtil:     { en: "GPU Utilization",     "zh-CN": "GPU 利用率",     "zh-TW": "GPU 利用率" },
  metricQueue:    { en: "Queued Jobs",         "zh-CN": "排队任务数",     "zh-TW": "排隊任務數" },
  metricWaste:    { en: "Resource Waste",      "zh-CN": "资源浪费率",     "zh-TW": "資源浪費率" },
  metricRoi:      { en: "Efficiency Score",    "zh-CN": "调度效率评分",   "zh-TW": "調度效率評分" },
  metricUtilLow:  { en: "▼ Low Utilization",   "zh-CN": "▼ 利用率低",     "zh-TW": "▼ 利用率低" },
  metricQueueWait:{ en: "▶ Waiting",           "zh-CN": "▶ 等待中",       "zh-TW": "▶ 等待中" },
  metricWasteHigh:{ en: "⚠ High Fragmentation","zh-CN": "⚠ 碎片严重",     "zh-TW": "⚠ 碎片嚴重" },
  metricRoiLow:   { en: "Low",                 "zh-CN": "低",             "zh-TW": "低" },
  metricRoiNeed:  { en: "Needs Optimization",  "zh-CN": "需优化",         "zh-TW": "需優化" },

  /* ---- Modes ---- */
  modeBefore:     { en: "Unscheduled",   "zh-CN": "未调度",   "zh-TW": "未調度" },
  modeBeforeDesc: { en: "See Problems",  "zh-CN": "看问题",   "zh-TW": "看問題" },
  modeAfter:      { en: "Scheduling",    "zh-CN": "调度中",   "zh-TW": "調度中" },
  modeAfterDesc:  { en: "See Process",   "zh-CN": "看过程",   "zh-TW": "看過程" },
  modeTaas:       { en: "In Operation",  "zh-CN": "运营中",   "zh-TW": "運營中" },
  modeTaasDesc:   { en: "See Results",   "zh-CN": "看效果",   "zh-TW": "看效果" },

  /* ---- Buttons ---- */
  btnPlay:  { en: "Play Full Scheduling Demo", "zh-CN": "播放完整调度过程", "zh-TW": "播放完整調度過程" },
  btnReset: { en: "Reset View",                "zh-CN": "重置视图",         "zh-TW": "重置視圖" },

  /* ---- Left Lane: Tasks ---- */
  laneTask: { en: "Jobs Enter", "zh-CN": "任务进入", "zh-TW": "任務進入" },
  queueCongested:  { en: "Queue Congested",  "zh-CN": "队列拥塞中",   "zh-TW": "隊列擁塞中" },
  queueAllocating: { en: "Allocating…",      "zh-CN": "正在分配资源", "zh-TW": "正在分配資源" },
  queueRunning:    { en: "Jobs Running",     "zh-CN": "任务运行中",   "zh-TW": "任務運行中" },

  /* Job cards */
  jobTrainGpu:  { en: "Needs 8 GPU",  "zh-CN": "需要 8 GPU",  "zh-TW": "需要 8 GPU" },
  jobTrainName: { en: "Distributed Training", "zh-CN": "分布式训练", "zh-TW": "分佈式訓練" },
  jobTrainDesc: { en: "Large-model training, needs multi-GPU in sync (Gang Scheduling)", "zh-CN": "大模型训练，需多卡同时启动（Gang Scheduling）", "zh-TW": "大模型訓練，需多卡同時啓動（Gang Scheduling）" },

  jobInferGpu:  { en: "Needs 1 GPU",  "zh-CN": "需要 1 GPU",  "zh-TW": "需要 1 GPU" },
  jobInferName: { en: "Online Inference", "zh-CN": "在线推理服务", "zh-TW": "在線推理服務" },
  jobInferDesc: { en: "High concurrency, low latency — spread to avoid hotspots", "zh-CN": "高并发低延迟，需分散放置避免热点", "zh-TW": "高併發低延遲，需分散放置避免熱點" },

  jobDevGpu:  { en: "Needs 1 GPU",  "zh-CN": "需要 1 GPU",  "zh-TW": "需要 1 GPU" },
  jobDevName: { en: "Interactive Dev", "zh-CN": "交互式开发", "zh-TW": "交互式開發" },
  jobDevDesc: { en: "Jupyter / VS Code — reserved GPU, no interruption", "zh-CN": "Jupyter / VS Code，预留 GPU 不中断", "zh-TW": "Jupyter / VS Code，預留 GPU 不中斷" },

  jobBatchGpu:  { en: "Needs 4 GPU",  "zh-CN": "需要 4 GPU",  "zh-TW": "需要 4 GPU" },
  jobBatchName: { en: "Batch / Fine‑tune", "zh-CN": "批处理 / 微调", "zh-TW": "批處理 / 微調" },
  jobBatchDesc: { en: "Elastic resource, preemptible, lower priority", "zh-CN": "弹性资源，可抢占，优先级较低", "zh-TW": "彈性資源，可搶佔，優先級較低" },

  /* ---- Scheduler ---- */
  schedulerLabel:  { en: "02 · Intelligent Decision", "zh-CN": "02 · 智能判断", "zh-TW": "02 · 智能判斷" },
  schedulerEngine: { en: "Scheduler Engine", "zh-CN": "Scheduler Engine", "zh-TW": "Scheduler Engine" },
  schedulerName:   { en: "Scheduler", "zh-CN": "调度器", "zh-TW": "調度器" },
  coreModeBefore:  { en: "Idle · Mismatch · Oversupply", "zh-CN": "闲置 · 错配 · 过度供给", "zh-TW": "閒置 · 錯配 · 過度供給" },
  coreModeAfter:   { en: "Matching jobs to GPUs…", "zh-CN": "正在匹配任务和 GPU", "zh-TW": "正在匹配任務和 GPU" },
  coreModeTaas:    { en: "Jobs running with full isolation", "zh-CN": "任务运行并被有效隔离", "zh-TW": "任務運行並被有效隔離" },

  /* Policies */
  policyLabel:       { en: "Scheduling Policies", "zh-CN": "调度策略", "zh-TW": "調度策略" },
  policyGangDesc:    { en: "All-at-once", "zh-CN": "同时启动", "zh-TW": "同時啓動" },
  policyBinpackDesc: { en: "Pack tight",  "zh-CN": "紧凑放置", "zh-TW": "緊湊放置" },
  policySpreadDesc:  { en: "Spread out",  "zh-CN": "分散放置", "zh-TW": "分散放置" },
  policyTopoDesc:    { en: "Place close", "zh-CN": "就近放置", "zh-TW": "就近放置" },

  policyGangHint: {
    en: "Gang Scheduling: all requested GPUs must be available at the same time before the training job starts — prevents partial allocation waste.",
    "zh-CN": "Gang Scheduling：训练任务必须等所有需要的 GPU 同时就绪才启动，避免部分 GPU 空等浪费。",
    "zh-TW": "Gang Scheduling：訓練任務必須等所有需要的 GPU 同時就緒才啓動，避免部分 GPU 空等浪費。"
  },
  policyBinpackHint: {
    en: "Bin Packing: pack jobs onto as few nodes as possible to reduce GPU fragmentation and improve overall utilization.",
    "zh-CN": "Bin Packing：把任务紧凑放到尽量少的节点上，减少 GPU 碎片，提高整机利用率。",
    "zh-TW": "Bin Packing：把任務緊湊放到盡量少的節點上，減少 GPU 碎片，提高整機利用率。"
  },
  policySpreadHint: {
    en: "Spread: distribute inference requests across nodes to prevent any single GPU from overheating — keeps latency stable.",
    "zh-CN": "Spread：将推理请求分散到多个节点，避免单点过热，保证响应延迟稳定。",
    "zh-TW": "Spread：將推理請求分散到多個節點，避免單點過熱，保證響應延遲穩定。"
  },
  policyTopoHint: {
    en: "Topology-Aware: place GPUs close together on the network fabric (NVLink / InfiniBand) to reduce cross-node communication latency.",
    "zh-CN": "Topology-Aware：根据 GPU 之间的网络拓扑（NVLink / InfiniBand）就近放置，降低通信延迟。",
    "zh-TW": "Topology-Aware：根據 GPU 之間的網絡拓撲（NVLink / InfiniBand）就近放置，降低通信延遲。"
  },
  policyHint: {
    en: "Click a policy button to see how the scheduler makes decisions",
    "zh-CN": "点击策略按钮，了解调度器如何做出决策",
    "zh-TW": "點擊策略按鈕，了解調度器如何做出決策"
  },

  /* ---- GPU Cluster ---- */
  clusterAlloc: { en: "Resource Allocation", "zh-CN": "资源分配", "zh-TW": "資源分配" },
  clusterBefore:{ en: "GPU Cluster · 96 Cards — Mostly Idle", "zh-CN": "GPU 集群 · 96 卡 — 大量闲置", "zh-TW": "GPU 集群 · 96 卡 — 大量閒置" },
  clusterDuring:{ en: "GPU Cluster · 96 Cards — Allocating", "zh-CN": "GPU 集群 · 96 卡 — 分配中", "zh-TW": "GPU 集群 · 96 卡 — 分配中" },
  clusterTaas:  { en: "GPU Cluster · 96 Cards — Efficient", "zh-CN": "GPU 集群 · 96 卡 — 高效运行", "zh-TW": "GPU 集群 · 96 卡 — 高效運行" },

  badgeCompute: { en: "Compute", "zh-CN": "计算", "zh-TW": "計算" },
  badgeNetwork: { en: "Network", "zh-CN": "网络", "zh-TW": "網絡" },
  badgeStorage: { en: "Storage", "zh-CN": "存储", "zh-TW": "存儲" },

  summaryActive: { en: "Active GPU", "zh-CN": "活跃 GPU", "zh-TW": "活躍 GPU" },
  summaryIdle:   { en: "Idle GPU",   "zh-CN": "空闲 GPU", "zh-TW": "空閒 GPU" },
  summaryWaste:  { en: "Fragmented", "zh-CN": "碎片 / 错配", "zh-TW": "碎片 / 錯配" },

  legendIdle:      { en: "Idle",            "zh-CN": "闲置浪费", "zh-TW": "閒置浪費" },
  legendMismatch:  { en: "Mismatch",        "zh-CN": "错配碎片", "zh-TW": "錯配碎片" },
  legendActive:    { en: "Active Compute",  "zh-CN": "有效计算", "zh-TW": "有效計算" },
  legendProtected: { en: "Tenant Isolation","zh-CN": "租户隔离", "zh-TW": "租戶隔離" },

  tenantNote: {
    en: "「Tenant Isolation」is not a separate job type — it is a platform-level capability that ensures each customer's workloads run without interference.",
    "zh-CN": "「租户隔离」不是独立任务，而是调度平台的资源隔离能力 —— 确保不同客户的 GPU 运行互不干扰。",
    "zh-TW": "「租戶隔離」不是獨立任務，而是調度平台的資源隔離能力 —— 確保不同客戶的 GPU 運行互不干擾。"
  },

  /* ---- Compare strip ---- */
  compareBefore:   { en: "Before", "zh-CN": "调度前", "zh-TW": "調度前" },
  compareAfter:    { en: "After",  "zh-CN": "调度后", "zh-TW": "調度後" },
  compareUtil:     { en: "GPU Utilization",  "zh-CN": "GPU 利用率",   "zh-TW": "GPU 利用率" },
  compareQueue:    { en: "Avg Queue Time",   "zh-CN": "平均排队时间", "zh-TW": "平均排隊時間" },
  compareFragment: { en: "Fragmentation",    "zh-CN": "资源碎片率",   "zh-TW": "資源碎片率" },
  compareEngine:   { en: "Engine",           "zh-CN": "调度引擎",     "zh-TW": "調度引擎" },

  /* ---- Narrative panel ---- */
  narrativeEyebrow: { en: "Scheduling Flow", "zh-CN": "调度流程 · Scheduling Flow", "zh-TW": "調度流程 · Scheduling Flow" },

  chapterTitleBefore: { en: "See the dots flow",     "zh-CN": "看小点怎么流动",     "zh-TW": "看小點怎麼流動" },
  chapterTitleAfter:  { en: "Scheduler at work",     "zh-CN": "调度器正在工作",     "zh-TW": "調度器正在工作" },
  chapterTitleTaas:   { en: "Everything running",    "zh-CN": "高效运行中",         "zh-TW": "高效運行中" },

  chapterCopyBefore: { en: "Jobs on the left, scheduler in the middle, GPUs on the right.", "zh-CN": "左边是任务，中间做判断，右边是 GPU。", "zh-TW": "左邊是任務，中間做判斷，右邊是 GPU。" },
  chapterCopyAfter:  { en: "The scheduler decides what runs first, how many GPUs, and where to place them.", "zh-CN": "调度器决定谁先跑、用几张卡、放在哪。", "zh-TW": "調度器決定誰先跑、用幾張卡、放在哪。" },
  chapterCopyTaas:   { en: "Jobs are running, GPUs are utilized. Idle waste reduced from 42% to <8%.", "zh-CN": "任务开始计算，利用率从 35% 提升到 78%+，浪费大幅减少。", "zh-TW": "任務開始計算，利用率從 35% 提升到 78%+，浪費大幅減少。" },

  step1Title: { en: "Jobs enter the queue",      "zh-CN": "任务进入队列",       "zh-TW": "任務進入隊列" },
  step1Desc:  { en: "Training, inference, dev & batch jobs waiting", "zh-CN": "训练、推理、开发、批处理任务等待资源", "zh-TW": "訓練、推理、開發、批處理任務等待資源" },
  step2Title: { en: "Scheduler reads requirements","zh-CN": "调度器读取需求",   "zh-TW": "調度器讀取需求" },
  step2Desc:  { en: "Analyzes GPU needs, priority & tenant ownership", "zh-CN": "分析 GPU 需求、优先级、租户归属", "zh-TW": "分析 GPU 需求、優先級、租戶歸屬" },
  step3Title: { en: "Select policy & target GPUs","zh-CN": "选择策略与 GPU",   "zh-TW": "選擇策略與 GPU" },
  step3Desc:  { en: "Gang / Binpack / Spread / Topology", "zh-CN": "Gang / Binpack / Spread / Topology", "zh-TW": "Gang / Binpack / Spread / Topology" },
  step4Title: { en: "Jobs start running",         "zh-CN": "任务开始运行",       "zh-TW": "任務開始運行" },
  step4Desc:  { en: "GPUs allocated, compute begins, resources well used", "zh-CN": "GPU 分配完成，计算启动，资源被有效利用", "zh-TW": "GPU 分配完成，計算啓動，資源被有效利用" },

  /* Legend */
  legendTitle:        { en: "Legend", "zh-CN": "颜色说明", "zh-TW": "顏色說明" },
  legendIdleLabel:    { en: "Mint",   "zh-CN": "浅绿",     "zh-TW": "淺綠" },
  legendIdleSub:      { en: "Idle GPU","zh-CN":"空闲 GPU", "zh-TW": "空閒 GPU" },
  legendMismatchLabel:{ en: "Red",    "zh-CN": "红色",     "zh-TW": "紅色" },
  legendMismatchSub:  { en: "Mismatch / Fragmented","zh-CN":"错配 / 碎片","zh-TW":"錯配 / 碎片" },
  legendActiveLabel:  { en: "Green",  "zh-CN": "绿色",    "zh-TW": "綠色" },
  legendActiveSub:    { en: "Active Compute","zh-CN":"有效计算","zh-TW":"有效計算" },
  legendProtectedLabel:{en: "Blue",   "zh-CN": "蓝色",    "zh-TW": "藍色" },
  legendProtectedSub: { en: "Tenant Isolation","zh-CN":"租户隔离","zh-TW":"租戶隔離" },



  /* GPU tooltip states */
  ttActive:    { en: "Active Compute",    "zh-CN": "有效计算",   "zh-TW": "有效計算" },
  ttInfer:     { en: "Inference Serving", "zh-CN": "推理服务",   "zh-TW": "推理服務" },
  ttProtected: { en: "Tenant Isolated",   "zh-CN": "租户隔离",   "zh-TW": "租戶隔離" },
  ttMismatch:  { en: "Mismatch Fragment", "zh-CN": "错配碎片",   "zh-TW": "錯配碎片" },
  ttOver:      { en: "Over-provisioned",  "zh-CN": "过度供给",   "zh-TW": "過度供給" },
  ttIdle:      { en: "Idle",              "zh-CN": "空闲",       "zh-TW": "空閒" },
  ttJobTrain:  { en: "Training job running", "zh-CN": "训练任务运行中", "zh-TW": "訓練任務運行中" },
  ttJobInfer:  { en: "Inference processing", "zh-CN": "推理请求处理中", "zh-TW": "推理請求處理中" },
  ttJobTenant: { en: "Tenant exclusive use", "zh-CN": "租户独占使用",   "zh-TW": "租戶獨佔使用" },
  ttJobOther:  { en: "Waiting for allocation", "zh-CN": "等待分配",     "zh-TW": "等待分配" },

  /* Toast */
  toastDone: { en: "Scheduling complete ✓  Utilization: 35% → 78%+", "zh-CN": "调度完成 ✓  利用率从 35% 提升至 78%+", "zh-TW": "調度完成 ✓  利用率從 35% 提升至 78%+" },
  toastReset:{ en: "Reset to initial state", "zh-CN": "已重置为初始状态", "zh-TW": "已重置為初始狀態" },

  /* Queue badge */
  badgeWait12: { en: "12 waiting", "zh-CN": "12 个等待", "zh-TW": "12 個等待" },
  badgeWait6:  { en: "6 waiting",  "zh-CN": "6 个等待",  "zh-TW": "6 個等待" },
  badgeWait2:  { en: "2 in queue", "zh-CN": "2 个排队",  "zh-TW": "2 個排隊" },

  /* Metric text overrides */
  metricUtilVal: { en: "78%+", "zh-CN": "78%+", "zh-TW": "78%+" },
  metricUtilHigh: { en: "▲ Optimized", "zh-CN": "▲ 已优化", "zh-TW": "▲ 已優化" },
  metricQueueOK:  { en: "✓ Smooth",    "zh-CN": "✓ 顺畅运行", "zh-TW": "✓ 順暢運行" },
  metricWasteOK:  { en: "✓ Very Low",  "zh-CN": "✓ 碎片极少", "zh-TW": "✓ 碎片極少" },
  metricRoiHigh:  { en: "High",        "zh-CN": "高",         "zh-TW": "高" },
  metricRoiOK:    { en: "Efficient",   "zh-CN": "高效运行",   "zh-TW": "高效運行" }
};

function t(key) {
  return i18n[key]?.[currentLang] ?? i18n[key]?.en ?? key;
}

function applyLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;

  // Update all [data-i18n] elements
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    const text = t(key);
    if (text) el.textContent = text;
  });

  // Update title
  document.title = t("pageTitle");

  // Update lang buttons
  langButtons.forEach((btn) => {
    const active = btn.dataset.lang === lang;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-checked", active);
  });

  // Re-apply mode-dependent text
  updateModeTexts(currentMode);
}

/* ===== Policy Descriptions (keyed by policy name, uses i18n) ===== */
function getPolicyText(policyName) {
  const map = {
    gang: "policyGangHint",
    binpack: "policyBinpackHint",
    spread: "policySpreadHint",
    topology: "policyTopoHint"
  };
  return t(map[policyName] || "policyHint");
}

/* ===== Mode Config ===== */
const modes = {
  before: {
    bodyClass: "",
    util: "35%", queue: "12", waste: "42%",
    roiKey: "metricRoiLow", roiDeltaKey: "metricRoiNeed", roiDeltaClass: "",
    utilDeltaKey: "metricUtilLow", queueDeltaKey: "metricQueueWait", wasteDeltaKey: "metricWasteHigh",
    utilDeltaClass: "negative", queueDeltaClass: "negative", wasteDeltaClass: "negative",
    queueStatusKey: "queueCongested", queueBadgeKey: "badgeWait12",
    coreKey: "coreModeBefore", titleKey: "chapterTitleBefore", copyKey: "chapterCopyBefore",
    clusterKey: "clusterBefore",
    pattern: ["active","idle","idle","idle","mismatch","idle","idle","over","active","idle","idle","mismatch","idle","mismatch","idle","idle"],
    activeN: 18, idleN: 54, wasteN: 24
  },
  after: {
    bodyClass: "after",
    util: "60%+", queue: "6", waste: "18%",
    roiKey: null, roiDeltaKey: null, roiDeltaClass: "",
    utilDeltaKey: null, queueDeltaKey: null, wasteDeltaKey: null,
    utilDeltaClass: "positive", queueDeltaClass: "", wasteDeltaClass: "",
    queueStatusKey: "queueAllocating", queueBadgeKey: "badgeWait6",
    coreKey: "coreModeAfter", titleKey: "chapterTitleAfter", copyKey: "chapterCopyAfter",
    clusterKey: "clusterDuring",
    pattern: ["active","active","infer","active","protected","active","infer","active","active","infer","active","protected","active","infer","active","active"],
    activeN: 58, idleN: 22, wasteN: 16
  },
  taas: {
    bodyClass: "taas",
    util: "78%+", queue: "2", waste: "8%",
    roiKey: "metricRoiHigh", roiDeltaKey: "metricRoiOK", roiDeltaClass: "positive",
    utilDeltaKey: "metricUtilHigh", queueDeltaKey: "metricQueueOK", wasteDeltaKey: "metricWasteOK",
    utilDeltaClass: "positive", queueDeltaClass: "positive", wasteDeltaClass: "positive",
    queueStatusKey: "queueRunning", queueBadgeKey: "badgeWait2",
    coreKey: "coreModeTaas", titleKey: "chapterTitleTaas", copyKey: "chapterCopyTaas",
    clusterKey: "clusterTaas",
    pattern: ["protected","active","infer","protected","active","active","infer","protected","active","active","infer","protected","active","infer","protected","active"],
    activeN: 75, idleN: 13, wasteN: 8
  }
};

function updateModeTexts(modeName) {
  const mode = modes[modeName];
  queueStatus.textContent = t(mode.queueStatusKey);
  queueBadge.textContent = t(mode.queueBadgeKey);
  coreMode.textContent = t(mode.coreKey);
  chapterTitle.textContent = t(mode.titleKey);
  chapterCopy.textContent = t(mode.copyKey);
  clusterScale.textContent = t(mode.clusterKey);

  if (mode.roiKey) roiScore.textContent = t(mode.roiKey);
  if (mode.roiDeltaKey) roiDelta.textContent = t(mode.roiDeltaKey);
  roiDelta.className = `metric-delta ${mode.roiDeltaClass}`;

  if (mode.utilDeltaKey) utilDelta.textContent = t(mode.utilDeltaKey);
  utilDelta.className = `metric-delta ${mode.utilDeltaClass}`;
  if (mode.queueDeltaKey) queueDelta.textContent = t(mode.queueDeltaKey);
  queueDelta.className = `metric-delta ${mode.queueDeltaClass}`;
  if (mode.wasteDeltaKey) wasteDelta.textContent = t(mode.wasteDeltaKey);
  wasteDelta.className = `metric-delta ${mode.wasteDeltaClass}`;
}

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
    p.x += p.speedX; p.y += p.speedY;
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

resizeCanvas(); initParticles(); animateParticles();
window.addEventListener("resize", () => { resizeCanvas(); initParticles(); });

/* ===== GPU Grid ===== */
let gpuCells = [];

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

function getCellState(cell) {
  if (cell.classList.contains("active"))    return { label: t("ttActive"),    job: t("ttJobTrain") };
  if (cell.classList.contains("infer"))     return { label: t("ttInfer"),     job: t("ttJobInfer") };
  if (cell.classList.contains("protected")) return { label: t("ttProtected"), job: t("ttJobTenant") };
  if (cell.classList.contains("mismatch"))  return { label: t("ttMismatch"),  job: t("ttJobOther") };
  if (cell.classList.contains("over"))      return { label: t("ttOver"),      job: t("ttJobOther") };
  return { label: t("ttIdle"), job: t("ttJobOther") };
}

function showTooltip(e) {
  const cell = e.target;
  const state = getCellState(cell);
  const rect = cell.getBoundingClientRect();
  const gridRect = grid.getBoundingClientRect();
  gpuTooltip.querySelector(".tooltip-id").textContent = `GPU #${parseInt(cell.dataset.index) + 1}`;
  gpuTooltip.querySelector(".tooltip-status").textContent = state.label;
  gpuTooltip.querySelector(".tooltip-job").textContent = state.job;
  gpuTooltip.hidden = false;
  gpuTooltip.style.left = `${rect.left - gridRect.left + rect.width / 2}px`;
  gpuTooltip.style.top = `${rect.top - gridRect.top - 50}px`;
}

function hideTooltip() { gpuTooltip.hidden = true; }

/* ===== Apply Mode ===== */
let currentMode = "before";

function applyMode(modeName) {
  const mode = modes[modeName];
  currentMode = modeName;
  document.body.className = mode.bodyClass;

  gpuUtil.textContent = mode.util;
  queueLen.textContent = mode.queue;
  wasteRate.textContent = mode.waste;

  updateModeTexts(modeName);

  activeCount.textContent = mode.activeN;
  idleCount.textContent = mode.idleN;
  wasteCount.textContent = mode.wasteN;

  if (modeName === "before") {
    idleCount.classList.add("idle-high"); activeCount.classList.remove("active-high");
  } else if (modeName === "taas") {
    idleCount.classList.remove("idle-high"); activeCount.classList.add("active-high");
  } else {
    idleCount.classList.remove("idle-high"); activeCount.classList.remove("active-high");
  }

  modeButtons.forEach((btn) => btn.classList.toggle("active", btn.dataset.mode === modeName));

  const pattern = mode.pattern;
  gpuCells.forEach((cell, index) => {
    const state = pattern[index % pattern.length];
    cell.className = `gpu-cell ${state}`;
  });

  const activeStep = modeName === "before" ? 0 : modeName === "after" ? 2 : 3;
  setFlowStep(activeStep);
}

function setFlowStep(step) {
  flowCards.forEach((card, index) => card.classList.toggle("active", index === step));
}

/* ===== Policy ===== */
function highlightPolicy(policyName) {
  policyButtons.forEach((btn) => btn.classList.toggle("active", btn.dataset.policy === policyName));
  const text = getPolicyText(policyName);
  policyDetail.innerHTML = `<span class="policy-detail-icon">💡</span><p>${text}</p>`;
}

function clearPolicy() {
  policyButtons.forEach((btn) => btn.classList.remove("active"));
  policyDetail.innerHTML = `<span class="policy-detail-icon">💡</span><p>${t("policyHint")}</p>`;
}

/* ===== Fixed Animation — Flow-based, not random carousel ===== */
/*
  Playback is now a sequential pipeline:
  Phase 1 (steps 0-1): Jobs queue up          → highlight job cards one by one
  Phase 2 (steps 2-3): Scheduler analyzes      → highlight scheduler + policy for current job
  Phase 3 (steps 4-5): GPUs get allocated      → GPU cells light up in blocks
  Phase 4 (steps 6-7): Jobs run, metrics rise  → final state transitions
*/

let playTimer = null;

function resetAll() {
  jobCards.forEach((j) => { j.classList.remove("active-flow"); const f = j.querySelector(".job-progress-fill"); if (f) f.style.width = "0%"; });
  gpuCells.forEach((c) => c.classList.remove("flash", "allocating"));
}

const PHASES = [
  /* step, jobIndex, policyToHighlight, gpuStartIdx, flowStep, description */
  { jobIdx: 0, policy: "gang",     gpuStart: 0,  flowStep: 0 },
  { jobIdx: 1, policy: "spread",   gpuStart: 8,  flowStep: 0 },
  { jobIdx: 0, policy: "binpack",  gpuStart: 16, flowStep: 1 },
  { jobIdx: 2, policy: "topology", gpuStart: 24, flowStep: 1 },
  { jobIdx: 1, policy: "spread",   gpuStart: 32, flowStep: 2 },
  { jobIdx: 3, policy: "binpack",  gpuStart: 48, flowStep: 2 },
  { jobIdx: 0, policy: "gang",     gpuStart: 64, flowStep: 3 },
  { jobIdx: 1, policy: "topology", gpuStart: 80, flowStep: 3 },
];

function animatePhase(step) {
  const phase = PHASES[step];
  if (!phase) return;

  // Highlight ONE job card at a time (not all jumping together)
  jobCards.forEach((job, idx) => {
    const isActive = idx === phase.jobIdx;
    job.classList.toggle("active-flow", isActive);
    const fill = job.querySelector(".job-progress-fill");
    if (fill) fill.style.width = isActive ? `${(step % 2 + 1) * 50}%` : "0%";
  });

  // Highlight ONE policy relevant to the current job
  highlightPolicy(phase.policy);

  // Allocate a block of GPU cells
  gpuCells.forEach((cell, idx) => {
    cell.classList.remove("flash", "allocating");
    if (idx >= phase.gpuStart && idx < phase.gpuStart + 12) {
      cell.classList.add("allocating");
    }
  });

  // Update flow step
  setFlowStep(phase.flowStep);

  // Update running metrics
  const progress = (step + 1) / PHASES.length;
  gpuUtil.textContent = `${Math.round(35 + progress * 43)}%`;
  wasteRate.textContent = `${Math.round(42 - progress * 34)}%`;
  queueLen.textContent = `${Math.round(12 - progress * 10)}`;
  roiScore.textContent = progress > 0.6 ? "High" : progress > 0.3 ? "Mid" : "Low";
  activeCount.textContent = `${Math.round(18 + progress * 57)}`;
  idleCount.textContent = `${Math.round(54 - progress * 41)}`;
  wasteCount.textContent = `${Math.round(24 - progress * 16)}`;
}

function playScenario() {
  clearInterval(playTimer);
  resetAll();
  applyMode("after");

  let step = 0;
  animatePhase(step);

  playTimer = setInterval(() => {
    step += 1;
    if (step >= PHASES.length) {
      clearInterval(playTimer);
      resetAll();
      applyMode("taas");
      clearPolicy();
      showToast(t("toastDone"));
      return;
    }
    animatePhase(step);
  }, 1300);
}

/* ===== Toast ===== */
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.hidden = true; }, 3500);
}

/* ===== Event Listeners ===== */
langButtons.forEach((btn) => {
  btn.addEventListener("click", () => applyLanguage(btn.dataset.lang));
});

modeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    clearInterval(playTimer);
    resetAll();
    applyMode(btn.dataset.mode);
    clearPolicy();
  });
});

policyButtons.forEach((btn) => {
  btn.addEventListener("click", () => highlightPolicy(btn.dataset.policy));
});

playButton.addEventListener("click", playScenario);

resetButton.addEventListener("click", () => {
  clearInterval(playTimer);
  resetAll();
  applyMode("before");
  clearPolicy();
  showToast(t("toastReset"));
});

flowCards.forEach((card) => {
  card.addEventListener("click", () => {
    const step = parseInt(card.dataset.step);
    const modeName = step === 0 ? "before" : step >= 3 ? "taas" : "after";
    clearInterval(playTimer);
    resetAll();
    applyMode(modeName);
    clearPolicy();
  });
});

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
  if (e.key === "1") { clearInterval(playTimer); resetAll(); applyMode("before"); clearPolicy(); }
  if (e.key === "2") { clearInterval(playTimer); resetAll(); applyMode("after"); clearPolicy(); }
  if (e.key === "3") { clearInterval(playTimer); resetAll(); applyMode("taas"); clearPolicy(); }
  if (e.key === " " || e.code === "Space") { e.preventDefault(); playScenario(); }
});

/* ===== Bootstrap ===== */
createGrid();
applyLanguage("en");  // default language: English
applyMode(currentMode);
