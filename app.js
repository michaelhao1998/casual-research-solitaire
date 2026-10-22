"use strict";
(() => {
const D = window.RESEARCH_DATA, C = window.RESEARCH_CONTENT, V = window.RESEARCH_VISUAL, K = window.RESEARCH_CLASSIC, DASH = window.RESEARCH_DASH, DEEP = window.RESEARCH_DEEP;
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/[&<>"']/g, x => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[x]));
const num = v => typeof v === "number" && Number.isFinite(v);
const exact = v => num(v) ? new Intl.NumberFormat("zh-CN", {maximumFractionDigits: 8}).format(v) : "缺失";
const compact = v => !num(v) ? "缺失" : v >= 1e8 ? (v/1e8).toFixed(2)+"亿" : v >= 1e4 ? (v/1e4).toFixed(v>=1e6?1:2)+"万" : exact(v);
const safeLink = u => /^https?:\/\//i.test(u) ? esc(u) : "";
const point = (p, month = "2026-09") => p.months.find(m => m.month === month) || {month, mau:null,downloads:null,revenue:null,arpu:null,statsRow:null};
const productById = id => D.products.find(p => p.id === id);
const profileByKey = key => C.profiles.find(p => p.key === key);
const sourceById = id => C.sources.find(s => s.id === Number(id));
const titles = {overview:"专题概览",market:"数据看板",game:"产品深拆",new:"新品深拆",idea:"机会分页",rules:"规则与乐趣",products:"产品拆解",changes:"新品变化",opportunities:"机会检验",candy:"Candy · Hold 深拆",compare:"三款同轴对比",sources:"证据与版本",layout:"阅读设计诊断",classic:"经典规则详情",glossary:"专业术语"};
let currentRoute = "overview", leaderMetric = "mau", holdStep = 0, modalReturnHash = "", modalReturnEntity = null;
const M = {scope:"discovery167", month:"2026-09", q:"", branch:"all", coverage:"all", metric:"mau", order:"desc",page:1,size:25};
const chip = (t, cls="") => `<span class="chip ${cls}">${esc(t)}</span>`;
const refs = ids => `<div class="ref-row"><span>来源</span>${[...new Set(ids || [])].map(n=>`<button class="ref-button" data-source="${n}" aria-label="查看来源 ${n}">[${n}]</button>`).join("")}</div>`;
const bullets = list => `<ul>${list.map(t=>`<li>${esc(t)}</li>`).join("")}</ul>`;
const heading = (k,t,p,extra="") => `<div class="page-heading"><div><span class="overline">${esc(k)}</span><h1>${esc(t)}</h1><p>${esc(p)}</p></div>${extra}</div>`;
const notice = (t,cls="") => `<div class="notice ${cls}">${t}</div>`;
const sectionHead = (label,title,sub="",right="") => `<div class="section-heading"><div><span class="label">${esc(label)}</span><h2>${esc(title)}</h2>${sub?`<p>${esc(sub)}</p>`:""}</div>${right}</div>`;
const toast = t => {$("#toast").textContent=t;$("#toast").classList.add("visible");clearTimeout(toast.timer);toast.timer=setTimeout(()=>$("#toast").classList.remove("visible"),2200);};

function ranks(items, metric, month) {
 const sorted = items.filter(p=>num(point(p,month)[metric])).sort((a,b)=>point(b,month)[metric]-point(a,month)[metric] || a.id.localeCompare(b.id));
 const map = new Map();let last=null, rank=0;
 sorted.forEach((p,i)=>{const v=point(p,month)[metric];if(v!==last)rank=i+1;map.set(p.id,rank);last=v;});
 return map;
}
function leaderHTML(){
 const pool=D.products.filter(p=>p.memberships.includes("discovery167")), metric=leaderMetric;
 const valid=pool.filter(p=>num(point(p)[metric])).sort((a,b)=>point(b)[metric]-point(a)[metric]||a.id.localeCompare(b.id));
 const ranked=ranks(pool,metric,"2026-09"), top=valid.slice(0,6), max=point(top[0])[metric];
 return `<div class="leader-toolbar"><div class="segmented"><button data-leader="mau" class="${metric==="mau"?"active":""}">月活 MAU</button><button data-leader="downloads" class="${metric==="downloads"?"active":""}">当月下载</button></div><span class="scope-note">9月扩展发现集 · 167记录 · ${valid.length}条有值 · 筛选内源值顺位</span></div><div class="leader-grid">${top.map(p=>`<button class="leader-item" data-product="${p.id}" title="${esc(p.name)} · ${exact(point(p)[metric])}"><span class="rank">${String(ranked.get(p.id)).padStart(2,"0")}</span><span><strong>${esc(p.name)}</strong><small>${esc(p.publisher)} · ${esc(p.branch)}</small></span><span class="leader-value">${compact(point(p)[metric])}</span><div class="leader-bar"><span style="width:${Math.max(1,point(p)[metric]/max*100)}%"></span></div></button>`).join("")}</div><p class="leader-foot">2026-09 · Global 为源标签，平台覆盖与完整月定义待确认。邻近玩法保留在发现集；这些顺位不是已核全球Solitaire名次，也不是三款主讲的选择依据。</p>`;
}
function overview(){
 if(DEEP)return DEEP.overview({leaderHTML});
 if(V)return V.overview({leaderHTML});
 const short = [
  ["rules","规则与乐趣","从归位、周转、成组到±1，理解一次点击的短反馈与长后果。","P02—P05"],
  ["products","产品拆解","同样±1：农场补给、Hold双基准、IP场景如何改变下一局。","P06—P10"],
  ["changes","新品变化","区分语义归类、同局合牌、局間物品Merge与旧规则新服务。","P11—P13"],
  ["opportunities","机会检验","从具体玩家处境出发，同时审视收益、代价与否决条件。","P14—P16"]
 ];
 return `<section class="hero"><div class="hero-copy"><span class="overline">CASUAL GAME RESEARCH / 01</span><h1>Solitaire</h1><h2>一套熟悉的纸牌，<br>为什么能长成不同的产品？</h2><p class="hero-description">从规则与玩家选择出发，拆解局内机制、成果回流和新品变化。沿四章学习，也能直接按产品、指标或问题查取。</p><div class="hero-actions"><a class="btn" href="#rules">沿四章开始阅读 <span>→</span></a><a class="btn secondary" href="#market">查看产品全景 <span>↗</span></a></div><p class="hero-foot">PPT 四章骨架 · v10 研究基线 · S0 代表页与数据快照</p></div><div class="hero-visual" aria-hidden="true"><div class="playing-card card-one"><span class="value">K</span><span class="suit">♠</span><span class="bottom">K</span></div><div class="playing-card card-two"><span class="value">Q</span><span class="suit">♦</span><span class="bottom">Q</span></div><div class="playing-card card-three"><span class="value">J</span><span class="suit">♣</span><span class="bottom">J</span></div><span class="visual-label">RULES → CHOICES → PRODUCT</span></div></section>
 <div class="quick-guide"><div><b><span class="step-num">01</span>先看结论</b><p>短判断 + 关键视觉，建立玩法认知</p></div><div><b><span class="step-num">02</span>展开解释</b><p>追问为什么、谁得利、代价是什么</p></div><div><b><span class="step-num">03</span>回到证据</b><p>官文、源值、版本与仍未验证的部分</p></div></div>
 <section class="section">${sectionHead("LEARNING PATH","四章，一条解释链","前三层讲清已经发生的变化，最后一层检验尚未成立的机会。")}
 <div class="chapter-grid">${short.map((a,i)=>`<a class="chapter-tile" href="#${a[0]}"><span class="chapter-no">CHAPTER ${String(i+1).padStart(2,"0")}</span><h3>${a[1]}</h3><p>${a[2]}</p><span class="tile-footer"><span>${a[3]}</span><span>进入 →</span></span></a>`).join("")}</div></section>
 <section class="section">${sectionHead("MARKET PANORAMA","样本内规模领先速览","规模领先、机制代表与本期主讲，分开回答。",'<a class="text-button" href="#market">完整产品大表 →</a>')}<div id="leaders" class="leader-layout">${leaderHTML()}</div></section>
 <section class="section split-grid"><article class="feature-card"><span class="overline">MECHANIC DEEP DIVE</span><h3>Candy：一格 Hold，改变哪一步？</h3><p>存入当前弃牌，旧牌重新露出；多一个基准，也多一次占位取舍。</p><div class="mini-hold" aria-label="规则示意4接3、存3、重露4接5"><span class="mini-card">4</span>→<span class="mini-card">3</span>→<span class="mini-card hold">3</span>＋<span class="mini-card">4</span>→<span class="mini-card">5</span></div><a class="text-button" href="#candy">逐步看规则示意与完整解释 →</a></article><article class="feature-card"><span class="overline">PRODUCT COMPARISON</span><h3>GH / Candy / Disney</h3><p>不只比较功能数量，而是同轴看：<br>此手怎样变、通关得到什么、下一局为什么开始。</p><div class="resource-flow"><span class="flow-node">农场与补给</span><span class="flow-node">双基准与明信片</span><span class="flow-node">IP与场景</span></div><a class="text-button" href="#compare">打开三款同轴对比 →</a></article></section>`;
}
function marketItems(){
 let items=D.products.filter(p=>p.memberships.includes(M.scope));
 const q=M.q.trim().toLowerCase();
 if(q)items=items.filter(p=>[p.name,p.publisher,p.developer,p.branch,p.identity.officialName,p.profileKey].join(" ").toLowerCase().includes(q));
 if(M.branch!=="all")items=items.filter(p=>p.branch===M.branch);
 if(M.coverage==="profile")items=items.filter(p=>p.profileKey);
 if(M.coverage==="official")items=items.filter(p=>p.links.length);
 if(M.coverage==="unverified")items=items.filter(p=>!p.links.length);
 return items;
}
function renderMarketResults(){
 const items=marketItems(), ranked=ranks(items,M.metric,M.month);
 const sign=M.order==="desc"?-1:1;
 items.sort((a,b)=>{let va=point(a,M.month)[M.metric],vb=point(b,M.month)[M.metric]; if(!num(va)&&!num(vb))return a.id.localeCompare(b.id);if(!num(va))return 1;if(!num(vb))return -1;return (va-vb)*sign||a.id.localeCompare(b.id);});
 M.page=Math.max(1,Math.min(M.page,Math.ceil(items.length/M.size)||1));
 const valid=items.filter(p=>num(point(p,M.month)[M.metric])).length;
 $("#marketMeta").innerHTML=`<span>${esc(D.datasets.find(s=>s.id===M.scope)?.name||"")} · ${M.month} · ${items.length}条匹配 · ${valid}条${M.metric==="mau"?"MAU":"下载"}有值 / ${items.length-valid}条缺失</span><span>仅筛选内源值顺位 · 不是正式行业排名</span>`;
 $("#productRows").innerHTML=items.length?items.slice((M.page-1)*M.size,M.page*M.size).map(p=>{
 const x=point(p,M.month),prev=point(p,previousMonth(M.month));
 const growth=num(x[M.metric])&&num(prev[M.metric])&&prev[M.metric]!==0?(x[M.metric]-prev[M.metric])/prev[M.metric]:null;
 return `<tr><td>${ranked.get(p.id)||"—"}</td><td><button class="cell-name" data-product="${p.id}">${esc(p.name)}</button><div class="cell-publisher">${esc(p.publisher)}</div>${p.profileKey?`<div class="cell-tags">${chip(["harvest","candy","disney"].includes(p.profileKey)?"本期主讲":"扩展档案","tiny")}</div>`:""}</td><td class="branch">${esc(p.branch)}<div class="cell-publisher">${esc(p.sourceSet)}</div></td><td class="numeric">${exact(x.mau)}</td><td class="numeric">${exact(x.downloads)}</td><td class="numeric secondary">${num(growth)?(growth>0?"+":"")+(growth*100).toFixed(1)+"%":"不可算"}</td><td class="coverage">${p.profileKey?"v10独立档案":p.links.length?"官方入口已定位":"待核候选"}<br><span>源App映射待核</span></td><td><button class="text-button" data-product="${p.id}">月度 / 口径 ↗</button></td></tr>`;
 }).join(""):`<tr><td colspan="8"><div class="empty-state">没有符合条件的记录。可清除搜索或重置筛选；未知不是零。</div></td></tr>`;
 $("#paginationInfo").textContent=`第 ${M.page} / ${Math.ceil(items.length/M.size)||1} 页 · 每页 ${M.size} 条`;
 $("#prevPage").disabled=M.page===1;$("#nextPage").disabled=M.page*M.size>=items.length;
 $("#mauSort").textContent=`月活 MAU ${M.metric==="mau"?(M.order==="desc"?"↓":"↑"):"↕"}`;
 $("#downloadSort").textContent=`下载次数 ${M.metric==="downloads"?(M.order==="desc"?"↓":"↑"):"↕"}`;
 $("#growthHeader").textContent=`${M.metric==="mau"?"MAU":"下载"}源值月环比`;
}
function previousMonth(m){let [y,mo]=m.split("-").map(Number);mo--;if(!mo){mo=12;y--;}return `${y}-${String(mo).padStart(2,"0")}`;}
function market(){
 const branches=[...new Set(D.products.map(p=>p.branch))].sort((a,b)=>a.localeCompare(b,"zh-CN"));
 return (DASH?DASH.page():"")+`<div id="market-table" class="section-heading table-head"><div><span class="label">FULL TABLE</span><h2>完整产品大表</h2><p>筛选、排序、分页；点击任一行查看月度源值、身份与研究覆盖。</p></div></div><div class="stat-strip"><article class="stat-card"><div class="number">167</div><p class="stat-label">九月扩展发现记录</p><small>不是已核独立App数</small></article><article class="stat-card"><div class="number">174</div><p class="stat-label">月度研究候选序列</p><small>与发现集为不同批次</small></article><article class="stat-card"><div class="number">3,176</div><p class="stat-label">可追溯月度记录</p><small>2025-01—2026-09</small></article><article class="stat-card"><div class="number">159 / 8</div><p class="stat-label">九月下载有值 / 缺失</p><small>缺失不补零</small></article></div>
 <section class="table-panel"><div class="filters"><div class="filter-control wide"><label for="productSearch">产品 / 发行商 / 别名</label><input type="search" id="productSearch" placeholder="如 Solitaire、King、Fairway…" value="${esc(M.q)}"></div><div class="filter-control"><label for="scopeFilter">数据范围</label><select id="scopeFilter">${D.datasets.map(s=>`<option value="${s.id}" ${s.id===M.scope?"selected":""}>${s.name} · ${s.records}</option>`).join("")}</select></div><div class="filter-control"><label for="monthFilter">源月份</label><select id="monthFilter">${[...D.months].reverse().map(m=>`<option ${m===M.month?"selected":""}>${m}</option>`).join("")}</select></div><div class="filter-control"><label for="branchFilter">规则分支 / 初筛标签</label><select id="branchFilter"><option value="all">全部分支</option>${branches.map(b=>`<option value="${esc(b)}" ${b===M.branch?"selected":""}>${esc(b)}</option>`).join("")}</select></div><div class="filter-control"><label for="coverageFilter">研究覆盖</label><select id="coverageFilter"><option value="all">全部记录</option><option value="profile" ${M.coverage==="profile"?"selected":""}>五款v10档案</option><option value="official" ${M.coverage==="official"?"selected":""}>有官方定位入口</option><option value="unverified" ${M.coverage==="unverified"?"selected":""}>待核候选</option></select></div><button class="btn secondary small reset" id="resetFilters">重置</button></div><div class="table-meta" id="marketMeta"></div><div class="table-scroll"><table aria-label="Solitaire产品源值大表"><thead><tr><th>源值顺位</th><th>产品 / 源发行商</th><th>分支与范围</th><th class="numeric"><button id="mauSort">月活 MAU ↓</button></th><th class="numeric"><button id="downloadSort">下载次数 ↕</button></th><th class="numeric" id="growthHeader">MAU源值月环比</th><th>身份 / 覆盖</th><th>深查</th></tr></thead><tbody id="productRows"></tbody></table></div><div class="pagination"><span id="paginationInfo"></span><div class="pagination-controls"><button class="btn secondary small" id="prevPage">上一页</button><button class="btn secondary small" id="nextPage">下一页</button></div></div></section>
 <details class="extra-research"><summary>还有 ${D.unmatchedResearch.length} 款官文研究样本未匹配源数据：Fusion、Make It 10、Merge Kingdom 等</summary><div class="extra-list">${D.unmatchedResearch.map(p=>`<article><strong>${esc(p.name)}</strong><p>${esc(p.publisher)} · ${esc(p.branch)}</p><p>${esc(p.notes)}</p>${p.links[0]?`<a href="${safeLink(p.links[0])}" target="_blank" rel="noopener noreferrer">官方定位入口 ↗</a>`:""}<p>没有匹配数据，不填0、不用同名作品代填。</p></article>`).join("")}</div></details>
 <section class="section">${sectionHead("DATA PROVENANCE","两批版本，已按原行连接")}${notice('167条发现记录均精确匹配174条月度候选中的九月原行；另7条月度候选只保留在其本批范围中。连接验证名称、发行商和下载原值，不进行名称猜测合并。',"purple")}<a class="text-button" href="#sources">查看来源版本、计算契约与未验收部分 →</a></section>`;
}
function unitHTML(u){
 if(V)return V.unit(u);
 return `<article class="unit-card" id="${esc(u.id)}"><div class="chip-row">${chip(u.kind,u.kind==="事实"?"teal":u.kind==="假设"?"gold":"")}${u.ppt?.length?chip(u.ppt.join(" / "),"neutral"):""}</div><h3>${esc(u.title)}</h3><p class="unit-summary">${esc(u.summary)}</p>${bullets(u.points||[])}<details><summary>展开：为什么、收益代价与如何验证</summary><div class="expanded-copy">${(u.detail||[]).map(t=>`<p>${esc(t)}</p>`).join("")}</div><div class="tradeoffs"><div class="tradeoff"><strong>可能收益</strong>${esc(u.benefit)}</div><div class="tradeoff cost"><strong>对应代价</strong>${esc(u.cost)}</div></div><div class="falsify"><b>怎样推翻这个解释</b>${esc(u.verification)}</div></details>${refs(u.refs)}<div class="ref-row"><button class="text-button" data-copy-link="${currentRoute}/${u.id}">复制本单元定位链接 ↗</button></div></article>`;
}
function profileCards(){if(V)return V.profileCards();return `<div class="profile-grid">${C.profiles.map(p=>`<article class="profile-card"><div class="product-mark ${p.key}">${{harvest:"GH",candy:"C",disney:"D",tiki:"T",fairway:"F"}[p.key]}</div><h3>${esc(p.name)}</h3><p>${esc(p.summary)}</p><div class="profile-footer">${chip(["harvest","candy","disney"].includes(p.key)?"本期主讲":"扩展档案","neutral")}<button class="text-button" data-profile="${p.key}">查看档案 →</button></div></article>`).join("")}</div>`;}
function chapter(route){
 const ch=C.chapters.find(c=>c.id===route),idx=C.chapters.indexOf(ch),next=C.chapters[idx+1];
 const units=ch.units.filter(u=>u.id!=="rules-s0-overview"&&!(K&&route==="rules"&&u.id==="rules-family"));
 return heading(`CHAPTER ${ch.number} / SOLITAIRE`,titles[route],ch.question)+`<div class="chapter-intro"><h2>${esc(ch.conclusion)}</h2><p>先看截图或结构示意；需要时展开完整解释与原编号来源。</p></div>`+(DEEP?DEEP.chapterCards(route):"")+
 (route==="rules"&&K?K.intro():"")+
 (route==="products"?`${profileCards()}<div class="section-heading"><p>五款平级档案保留，主讲顺序 Grand Harvest → Candy → Disney；不是规模Top5。</p><a class="text-button" href="#compare">三款同轴对比 ↗</a></div>`:"")+
 `<div class="visual-unit-list">${units.map(unitHTML).join("")}</div><div class="chapter-end"><div><strong>${next?"下一章："+titles[next.id]:"回到产品与证据"}</strong><p>${esc(next?next.question:"机会要能被观察否决，不能靠新颖标签或市场数字替代验证。")}</p></div><a class="btn secondary small" href="#${next?next.id:"sources"}">${next?"继续学习":"查证与补核"} →</a></div>`;
}
const holdStates=[
 {bottom:4,hold:null,three:"legal",five:"legal",caption:"当前基准是4：开放3可接，5也可接。这里先选择3，观察后续变化。"},
 {bottom:3,hold:null,three:"played",five:"blocked",caption:"接走3后，3成为新基准：5不能直接接到3上。旧4仍在弃牌历史中。"},
 {bottom:4,hold:3,three:"played",five:"legal",caption:"将弃牌顶3放入空Hold槽：旧4重新露出，5又能接；槽内3也提供另一基准。"},
 {bottom:5,hold:3,three:"played",five:"played",caption:"接走5后，当前基准变5，Hold里仍是3。这只演示已证步骤，不补写满槽交换规则。"}
];
function holdHTML(){const s=holdStates[holdStep];return `<div class="demo-panel-head"><h3>4 → 3 → Hold → 4 → 5</h3>${chip("规则示意 · 非实录","gold")}</div><div class="hold-scene"><div><p class="board-label">桌面开放牌</p><div class="board-area"><div class="demo-card ${s.three}" aria-label="桌面3 ${s.three}">${s.three==="played"?"—":3}</div><div class="demo-card ${s.five}" aria-label="桌面5 ${s.five}">${s.five==="played"?"—":5}</div></div></div><div class="baseline-area"><div class="baseline-group"><div class="demo-card">${s.bottom}</div>当前弃牌顶</div><div class="baseline-group"><div class="demo-card ${s.hold===null?"slot":"legal"}">${s.hold===null?"空槽":s.hold}</div>Hold Slot · 1格</div></div></div><p class="demo-caption">${s.caption}</p><div class="demo-controls"><span>STEP ${holdStep+1} / 4</span><div class="step-dots">${holdStates.map((_,i)=>`<span class="${i===holdStep?"active":""}"></span>`).join("")}</div><button class="btn small" id="nextHold">${holdStep===3?"重新演示 ↻":["先接3 →","把3存入Hold →","以4接5 →"][holdStep]}</button></div>`;}
function candy(){
 if(V)return V.candy();
 const unit=C.chapters.find(c=>c.id==="products").units.find(u=>u.id==="products-candy"),p=D.products.find(p=>p.profileKey==="candy");
 return heading("MECHANIC / PRODUCT DEEP DIVE","Candy · 一格 Hold 的取舍","先理解一个动作怎样改变可选基准，再看工具、经济与局外成果。不把收入差距归因于这个机制。",`<button class="btn secondary small" data-product="${p.id}">查看月度源值 ↗</button>`)+
 `<div class="showcase-grid"><section class="demo-panel" id="holdDemo">${holdHTML()}</section><div class="hold-analysis"><article class="feature-card"><div class="chip-row">${chip("官方规则","teal")}</div><h3>不是留一张备用牌这么简单</h3><p>弃牌顶入空槽 → 旧牌重露 → 两基准同时可匹配。它改变当前能接什么，而不只是增加牌库供给。</p>${refs([27])}</article><article class="feature-card"><div class="chip-row">${chip("机制解释")}</div><h3>多一条路，也占掉一格</h3><p>愿意规划的玩家可能获得技巧性补救；快速连消的玩家可能多一层记忆与教程负担。“更深”要靠真实分支和玩家解释验证。</p><a class="text-button" href="#opportunities">查看收益、代价与否决条件 →</a></article></div></div>
 <section class="section">${sectionHead("THREE LAYERS","规则、产品、证据分层查取")}<div class="unit-grid">${unitHTML(unit)}<article class="unit-card">${chip("成果与经济","teal")}<h3>Energy不是入场体力</h3><p class="unit-summary">明信片与卡册是两条成果线；Coins、Lives及Bet Up另列。</p><div class="resource-flow"><span class="flow-node">通关</span><span class="flow-arrow">→</span><span class="flow-node">Energy</span><span class="flow-arrow">→</span><span class="flow-node">Postcards任务</span></div><div class="resource-flow"><span class="flow-node">Card Packs</span><span class="flow-arrow">→</span><span class="flow-node">Cards / Sets</span><span class="flow-arrow">→</span><span class="flow-node">Album</span></div><details class="reading-details"><summary>展开经济用途与测试组边界</summary><div class="expanded-copy"><p>King官方说明 Coins用于额外操作、Lives和Boosters；不由此写全体玩家都要金币入场。Bet Up只对部分玩家测试，更高投入与胜利奖励、失败投入损失必须分账。</p><p>关内取得卡包须胜利后结算，不能把看见卡包等同永久保留。同事账号四小时＋3,000、Lv4＋3牌只限该观察，不是全体购买力或永不缺资源的证明。</p></div></details>${refs([25,26,31,32,115])}</article></div></section>
 <section class="section">${sectionHead("EVIDENCE","教学画面不等于连续动作录像","本机阅读预览单独生成，原图保留；仅支持该画面中可见的教学与UI。")}<figure class="evidence-figure"><img src="assets/candy-hold-preview.jpg" alt="Candy教程提示将当前牌放入空Hold槽，底部可见当前8和空槽" loading="lazy"><figcaption>同事教学截图：可见当前牌、空Hold槽与操作提示。它不是上方4→3→4→5示意的实录，也不证明全部满槽操作。[115]</figcaption></figure>${refs([27,115])}</section><div class="chapter-end"><div><strong>把 Hold 放回完整产品</strong><p>再看 GH 的补给与 Disney 的场景：三种差异发生在不同层级。</p></div><a class="btn secondary small" href="#compare">三款同轴对比 →</a></div>`;
}
function compare(){if(V)return V.compare();return heading("CROSS-PRODUCT / SAME QUESTIONS","三款同轴对比","Grand Harvest → Candy → Disney。每行回答同一个问题：动作怎样变、成果去哪里、证据到哪一步。")+notice("主讲三款不是市场Top3。不同年代的经济与特定账号截图，不拼成现行购买力或留存排名。", "purple")+`<div class="compare-summary"><article><h3>Grand Harvest</h3><p>以农场目标与周期补给连接下一局。<br>关键问题：收获怎样回供尝试？</p></article><article><h3>Candy Crush Solitaire</h3><p>以Hold增加当前可用基准。<br>关键问题：玩家能否理解新的分支？</p></article><article><h3>Disney Solitaire</h3><p>以熟悉IP成为可见场景进度。<br>关键问题：目标是否支持自愿继续？</p></article></div><div class="table-panel"><div class="table-scroll"><table class="compare-table" aria-label="GH Candy Disney同轴比较"><thead><tr><th>同一个问题</th><th>Grand Harvest</th><th>Candy</th><th>Disney</th></tr></thead><tbody>${C.comparison.filter(r=>r.axis!=="三款历史同窗商店快照").map(r=>`<tr><td><strong>${esc(r.axis)}</strong>${refs(r.refs)}</td><td>${esc(r.harvest)}</td><td>${esc(r.candy)}</td><td>${esc(r.disney)}</td></tr>`).join("")}</tbody></table></div></div><section class="section">${sectionHead("EXTENDED ARCHIVES","保留五款完整研究，而不扩大本期主讲","Tiki解释共同目标，Fairway解释球洞与全场成绩。它们和其余产品平级，但证据深度不同。")}${profileCards()}</section>`;}
const localFiles=[
 {name:"统一研究主稿 v10",note:"四章 + 四知识库；原126编号保留。原稿未改。",path:"本地资料/outputs/Solitaire_玩法与产品拆解研究主稿_v10.md"},
 {name:"最终PPT / 演讲备注",note:"39物理页；P01—P16是主讲骨架，重复与替代页不合并。",path:"本地资料/outputs/Solitaire_final_结构化逐字稿_20261016/Solitaire_final_含结构化演讲备注.pptx"},
 {name:"结构化逐字稿",note:"网页只采用Solitaire部分；前部抓娃娃笔记剥离。",path:"本地资料/outputs/Solitaire_final_结构化逐字稿_20261016/solitaire逐字稿_结构化版.txt"}
];
function sourceCards(list){return list.map(s=>`<article class="source-card">${chip(`[${s.id}] ${s.scope}`,"neutral")}<h3>${esc(s.title)}</h3><p>${esc(s.notes)}</p>${s.url?`<a href="${safeLink(s.url)}" target="_blank" rel="noopener noreferrer">打开原始来源 ↗</a>`:`<button class="text-button" data-local-source="115">本机资料定位 ↗</button>`}</article>`).join("");}
function sources(){return heading("EVIDENCE / VERSIONS","证据与版本","这里能区分事实、分析、假设以及仍未闭环的数据。官方链接可打开；本机原件未上传，不伪装成受控团队附件。")+
 `<div class="local-sources">${localFiles.map((f,i)=>`<article><strong>${f.name}</strong><p>${f.note}</p><button class="text-button" data-local-file="${i}">查看本机定位 / 复制路径 ↗</button></article>`).join("")}</div>
 <section class="data-contract"><div class="chip-row">${chip("内容 v10","neutral")}${chip("市场 2026-09","neutral")}${chip("阅读界面 v3 / 指标快照 S0-v1","neutral")}</div><h3 style="margin-top:12px">本次实际可用的数据与限制</h3>${bullets(D.meta.notes)}<details class="reading-details"><summary>展开两批来源与计算契约</summary><div class="expanded-copy"><p>${esc(D.meta.source)}。本次没有重新读原Excel，复用既有完整提取快照；174条源序列、3,176月行经唯一性验证。</p><p>167条九月发现记录通过同一九月Stats原行号连接月度序列，并逐项核对名称、发行商、下载原值。全部167条匹配；174候选另7条保留在本批中，不相加或当独立App数。</p><p>仅在月度174候选中的7条：${D.products.filter(p=>p.memberships.includes("monthly174")&&!p.memberships.includes("discovery167")).map(p=>`${esc(p.name)}（${esc(p.publisher)}；${esc(p.sourceSet)}）`).join("；")}。这些是原批次保留的邻近／别名／关键词候选，不自动加进167九月发现集。</p><p>源值排序按原数，显示才四舍五入。同值同顺位并跳号1、2、2、4；缺失无顺位，真实0保留。筛选后只显示筛选内顺位。</p><p>近3月平均MAU只有三个连续完整同口径月均有效才算；目前完整月定义未验收，因此不给正式三月均值。月环比仅在相邻两月有值且前月非0时展示源值变化；不可算不补0。</p><p>Revenue与ARPU只保留源字段，币种、净毛、单位与IAA/DTC覆盖待核，不标美元总营收。公司披露、WAU、累计安装不填入这份MAU表。</p></div></details></section>
 <section class="section">${sectionHead("CONTENT MODEL","六种对象分开维护","S0为文件快照模型；未创建企业微信智能表格或多人编辑后台。")}
 <div class="model-grid"><article><strong>研究目录</strong><p>1专题 / 4章，沿最终PPT骨架编排</p></article><article><strong>产品</strong><p>174候选对象，5款平级档案</p></article><article><strong>知识卡</strong><p>${C.chapters.flatMap(c=>c.units).length}单元，默认与展开层共用</p></article><article><strong>证据</strong><p>${C.sources.length}条选用引用，沿用v10编号</p></article><article><strong>指标</strong><p>3,176月行，源行与缺失均保留</p></article><article><strong>资产与版本</strong><p>7张布局预览 + 原PPT39页与13视频；原件保留</p></article></div></section>
 <section class="section">${sectionHead("REFERENCE INDEX","按原编号回查来源","此处为S0选用引用，不是原稿126条来源的完整迁移。")}
 <label class="global-search" style="margin:0 0 18px"><input id="sourceSearch" type="search" placeholder="搜索来源：King、Hold、Golf、Naavik…" aria-label="筛选来源"></label><div class="source-list" id="sourceList">${sourceCards(C.sources)}</div></section>`;}
function sparkline(p,metric="mau"){
 const all=D.months,ps=all.map(m=>point(p,m)),vs=ps.map(m=>m[metric]).filter(num);
 if(!vs.length)return '<p class="muted">未取得本项源值，不用0补图。</p>';
 const max=Math.max(...vs)||1,W=680,H=190,L=57,R=13,T=16,B=31,plotH=H-T-B;
 const X=i=>L+i/(all.length-1)*(W-L-R),Y=v=>T+(1-v/max)*plotH;
 let seg=[],segments=[];ps.forEach((x,i)=>{if(num(x[metric]))seg.push([X(i),Y(x[metric])]);else if(seg.length){segments.push(seg);seg=[];}});if(seg.length)segments.push(seg);
 const tick=[0,.5,1].map(v=>`<line x1="${L}" y1="${Y(v*max)}" x2="${W-R}" y2="${Y(v*max)}" stroke="#293248" stroke-width="1"/><text x="${L-8}" y="${Y(v*max)+3}" text-anchor="end" fill="#a2a9bd" font-size="10" font-family="Consolas,monospace">${compact(v*max)}</text>`).join("");
 return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(p.name)} ${metric==="mau"?"MAU":"下载"}源值走势，缺失不连接">${tick}${segments.map(s=>`<polyline points="${s.map(v=>v.join(",")).join(" ")}" fill="none" stroke="#a39aff" stroke-width="2"/>${s.map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2.6" fill="#c0b7ff"/>`).join("")}`).join("")}${[0,6,12,20].map(i=>`<text x="${X(i)}" y="${H-6}" text-anchor="${i===0?"start":i===20?"end":"middle"}" fill="#a2a9bd" font-size="10" font-family="Consolas,monospace">${all[i]}</text>`).join("")}</svg>`;
}
function beginModal(title,body,entity){
 const dialog=$("#detailDialog");
 if(!dialog.open)modalReturnHash=location.hash||"#overview";
 $("#detailTitle").textContent=title;$("#detailBody").innerHTML=body;
 modalReturnEntity=entity;
 if(!dialog.open)dialog.showModal();dialog.scrollTop=0;
}
function showProduct(id,deep=true){
 const p=productById(id);if(!p)return toast("此记录未在当前快照中找到");
 const month=currentRoute==="market"?M.month:"2026-09",x=point(p,month);
 const body=`<div class="chip-row">${chip(p.branch,"neutral")}${p.profileKey?chip(["harvest","candy","disney"].includes(p.profileKey)?"本期主讲":"扩展档案"):""}${chip("源App映射待核","gold")}</div><p>${esc(p.publisher)} · ${esc(p.sourceSet)}</p><div class="stat-strip"><article class="stat-card"><div class="number">${compact(x.mau)}</div><p class="stat-label">${month} 月活MAU源值</p><small>精确值 ${exact(x.mau)}</small></article><article class="stat-card"><div class="number">${compact(x.downloads)}</div><p class="stat-label">${month} 下载次数源值</p><small>精确值 ${exact(x.downloads)}</small></article></div>
 <h3>月度走势与源值</h3><div class="segmented" style="width:max-content;margin-bottom:10px"><button class="active" data-trend="mau" data-trend-id="${id}">MAU</button><button data-trend="downloads" data-trend-id="${id}">下载</button></div><div class="mini-trend" id="productTrend">${sparkline(p)}</div><p style="font-size:10px">2025-01—2026-09源月份 · 缺失不连接、不补0；早期无行不等于0。三完整月未验收，暂不发布正式三月平均MAU。</p>
 <details class="reading-details"><summary>打开 ${p.months.length} 个月的精确源值与原行</summary><div class="table-scroll"><table class="month-table"><thead><tr><th>源月</th><th class="numeric">MAU</th><th class="numeric">下载</th><th class="numeric">Revenue源值</th><th class="numeric">ARPU源值</th><th>Stats原行</th></tr></thead><tbody>${[...p.months].reverse().map(m=>`<tr><td>${m.month}</td><td class="numeric">${exact(m.mau)}</td><td class="numeric">${exact(m.downloads)}</td><td class="numeric">${exact(m.revenue)}</td><td class="numeric">${exact(m.arpu)}</td><td class="numeric">${m.statsRow??"未定位"}</td></tr>`).join("")}</tbody></table></div><p style="font-size:10px">Revenue／ARPU币种、单位、净毛及IAA/DTC覆盖未核。以上不标美元，不当总营收。</p></details>
 <h3>身份、口径与研究覆盖</h3><dl class="kv-grid"><div><dt>官方／研究定位名</dt><dd>${esc(p.identity.officialName||"未逐包定位")}</dd></div><div><dt>源发行商 / 官方定位主体</dt><dd>${esc(p.publisher)} / ${esc(p.identity.officialPublisher||"待核")}</dd></div><div><dt>平台 / 地区</dt><dd>平台待确认 / Global（源标签）</dd></div><div><dt>来源与发布状态</dt><dd>Mobile Source导出快照 / 本地只读</dd></div><div><dt>规则</dt><dd>${esc(p.coverage.rules)}</dd></div><div><dt>实机</dt><dd>${esc(p.coverage.play)}</dd></div><div><dt>经济 / 深拆</dt><dd>${esc(p.coverage.economy)}；${esc(p.coverage.deep)}</dd></div><div><dt>九月连接 / 月批范围</dt><dd>${p.discovery?"以相同Stats原行连接九月发现集":"不在九月167发现集"}；${p.memberships.includes("monthly174")?"月度174候选":"未接月度批"}</dd></div></dl><p>${esc(p.identity.notes)}</p><p><b>纳入理由：</b>${esc(p.reason)} <b>初筛依据：</b>${esc(p.basis)}</p><p>源Release ${esc(p.sourceRelease||"未提取")} 是源字段，不直接替代官方全球发布日、规则发明日或首个测试日。</p>
 ${p.profileKey?`<button class="btn secondary small" data-profile="${p.profileKey}">查看玩法与产品档案 →</button>`:""}<h3>定位入口</h3>${p.links.length?p.links.map(u=>`<a class="source-link" href="${safeLink(u)}" target="_blank" rel="noopener noreferrer">${esc(u)} ↗</a>`).join(""):"<p>未定位官文或准确商店包。保留候选，不用近名产品补规则。</p>"}<button class="text-button" data-copy-link="product/${p.id}">复制本记录定位链接 ↗</button>`;
 beginModal(p.name,body,{type:"product",id});
 if(deep)history.replaceState(null,"",`#product/${id}`);
}
function showProfile(key,deep=true){
 const p=profileByKey(key);if(!p)return;
 const data=D.products.find(d=>d.profileKey===key);
 beginModal(p.name,`<div class="chip-row">${chip(p.subtitle,"neutral")}</div><p>${esc(p.summary)}</p>${V?.profiles[key]?V.picture("assets/"+V.profiles[key].board,V.profiles[key].legend,V.profiles[key].pins)+V.flow(V.profiles[key].flow):""}<details class="visual-deep"><summary>局内：动作、工具与后果 <span>展开 ＋</span></summary><div class="expanded-copy">${bullets(p.core)}</div></details><details class="visual-deep"><summary>局外：成果与下一局 <span>展开 ＋</span></summary><div class="expanded-copy">${bullets(p.meta)}</div></details><details class="visual-deep"><summary>版本限制与如何否决 <span>展开 ＋</span></summary><div class="expanded-copy">${bullets(p.limits)}</div></details>${key==="disney"?'<figure class="evidence-figure"><img src="assets/disney-scene-preview.jpg" alt="Disney场景任务界面，可见进度1/6与消耗1颗星" loading="lazy"><figcaption>同事截图：这个场景任务消耗1星、进度1/6可见。不外推其他场景成本或倍率多星。[115]</figcaption></figure>':""}${refs(p.refs)}<div class="hero-actions">${data?`<button class="btn secondary small" data-product="${data.id}">查看月度数据 / 身份 →</button>`:""}${key==="candy"?'<a class="btn small" href="#candy" data-navigate-close>Candy分层深拆 →</a>':""}</div>`,{type:"profile",key});
 if(deep)history.replaceState(null,"",`#profile/${key}`);
}
function showTerm(id){
 const t=K.terms.find(t=>t.id===id);if(!t)return;
 beginModal(t.en+" · "+t.cn,K.termBody(t.id),{type:"term",id:t.id});
}
function showSource(id,deep=true){
 const s=sourceById(id);if(!s)return toast("该原编号未选入S0，请回查完整v10主稿");
 const previous=modalReturnEntity&&["product","profile","term"].includes(modalReturnEntity.type)?modalReturnEntity:null;
 beginModal(`[${s.id}] ${s.title}`,`${chip(s.scope,"neutral")}<p>${esc(s.notes)}</p>${s.url?`<a class="btn secondary small" href="${safeLink(s.url)}" target="_blank" rel="noopener noreferrer">打开原始来源 ↗</a><p class="source-link">${esc(s.url)}</p>`:'<p>内部报告没有上传，网页未获得受控附件权限。可在本机复制原件路径定位。</p><button class="btn secondary small" data-local-source="115">查看本机资料位置 ↗</button>'}<p>沿用v10来源编号与当时核验范围；本次未将外部链接的更新状态重新验证为最新事实。</p>${previous?`<button class="text-button" data-modal-return="${previous.type}" data-return-id="${esc(previous.id||previous.key)}">← 返回刚才的${previous.type==="product"?"产品数据":previous.type==="term"?"术语解释":"产品档案"}</button>`:""}`,{type:"source",id});
 if(deep)history.replaceState(null,"",`#source/${id}`);
}
function localSource(i){
 const f=localFiles[i];if(!f)return;
 beginModal(f.name,`<p>${f.note}</p><p>原件仅位于当前电脑，尚未上传或验证团队权限。复制路径后在本机打开；公网阅读版不会默认携带这些原件。</p><p style="overflow-wrap:anywhere;font-family:var(--mono);font-size:11px">${esc(f.path)}</p><button class="btn secondary small" data-copy-text="${esc(f.path)}">复制完整本机路径</button>`,{type:"local"});
}
function boundary(){beginModal("S0的数据与发布边界",`${bullets(D.meta.notes)}<p>已完成代表阅读页与数据快照。未完成原Excel本次重读、全部原件迁移、会员权限、多人编辑、实时同步及正式三月排名验收。</p><p>michael已允许此前提议的阅读摘要、指标源值与两张代表图公开。当前新增截图与PPT视频用于本地布局预览；未默认扩展为全部原件公开。前端口令不能保护附件或数据。</p>`,{type:"boundary"});}
function openSearch(){const dialog=$("#searchDialog");dialog.showModal();$("#globalSearch").value="";searchResults("");$("#globalSearch").focus();}
function searchResults(q){
 q=q.trim().toLowerCase();
 if(q==="局外合成")q="局间";
 if(!q){$("#searchResults").innerHTML=`<p class="secondary" style="font-size:12px;padding:10px 0">按产品或问题找内容，例如：</p>${["Hold","Fairway","语义归类","局外合成"].map(t=>`<button class="search-result" data-search-suggest="${t}"><strong>${t}</strong><small>查看本期相关产品与学习单元</small></button>`).join("")}`;return;}
 const hits=K?K.search(q):[];
 C.chapters.forEach(c=>c.units.forEach(u=>{if(u.id!=="rules-s0-overview"&&[u.title,u.summary,...(u.points||[]),...(u.detail||[])].join(" ").toLowerCase().includes(q))hits.push({type:"unit",title:u.title,sub:`${titles[c.id]} · ${u.kind}`,route:`${c.id}/${u.id}`});}));
 D.products.filter(p=>[p.name,p.publisher,p.branch,p.identity.officialName].join(" ").toLowerCase().includes(q)).forEach(p=>hits.push({type:"product",id:p.id,title:p.name,sub:`产品源值 · ${p.publisher} · ${p.branch}`}));
 C.sources.filter(s=>[s.title,s.notes,s.scope].join(" ").toLowerCase().includes(q)).forEach(s=>hits.push({type:"source",id:s.id,title:`[${s.id}] ${s.title}`,sub:s.scope}));
 const visible=[...hits.filter(h=>h.type==="unit").slice(0,12),...hits.filter(h=>h.type==="product").slice(0,12),...hits.filter(h=>h.type==="source").slice(0,6)];
 $("#searchResults").innerHTML=hits.length?`<p class="scope-note" style="margin:0 0 10px">${hits.length}条匹配，分组显示${visible.length}条；没有搜索未导入原件。</p>`+visible.map(h=>`<button class="search-result" data-search-result="${h.type}" data-result-id="${esc(h.id||h.route)}"><strong>${esc(h.title)}</strong><small>${esc(h.sub)}</small></button>`).join(""):'<div class="empty-state">当前快照没有匹配内容。可换名称、发行商或机制关键词。</div>';
}
function closeDetail(){
 const dialog=$("#detailDialog");if(dialog.open)dialog.close();
}
function route(){
 if($("#detailDialog").open){modalReturnHash="";$("#detailDialog").close();}
 const [raw="overview",extra] = location.hash.slice(1).split("/");
 if(raw==="candy"){location.replace("#game/candy");return;}
 currentRoute=titles[raw]?raw:raw==="product"?"market":raw==="profile"?"products":raw==="source"?"sources":"overview";
 const routeTitle=raw==="classic"?(K.games.find(g=>g.id===extra)?.name||titles.classic):titles[currentRoute];
 $("#breadcrumbPage").textContent=routeTitle;document.title=`${routeTitle} · Solitaire · 休闲玩法研究库`;
 const parentOf={classic:"rules",glossary:"rules",game:"products",new:"changes",idea:"opportunities"};const rulesNav=!!parentOf[raw];
 $$(".nav-link").forEach(a=>{a.classList.toggle("active",(a.dataset.route===currentRoute||(rulesNav&&a.dataset.route===parentOf[raw])));if((a.dataset.route===currentRoute||(rulesNav&&a.dataset.route===parentOf[raw])))a.setAttribute("aria-current","page");else a.removeAttribute("aria-current");});
 $("#main").innerHTML=currentRoute==="overview"?overview():currentRoute==="market"?market():currentRoute==="candy"?candy():currentRoute==="compare"?compare():currentRoute==="sources"?sources():currentRoute==="layout"?V.layout():currentRoute==="classic"?K.page(extra):currentRoute==="game"?(extra!=="candy"&&window.RESEARCH_GAME_PAGES&&window.RESEARCH_GAME_PAGES.ALL[extra]?window.RESEARCH_GAME_PAGES.page(extra):DEEP.gamePage(extra,{holdHTML})):currentRoute==="new"&&window.RESEARCH_NEW_PAGES&&window.RESEARCH_NEW_PAGES.page(extra)?window.RESEARCH_NEW_PAGES.page(extra):currentRoute==="new"?DEEP.planPage("new",extra):currentRoute==="idea"&&window.RESEARCH_IDEAS?window.RESEARCH_IDEAS.page(extra):currentRoute==="idea"?DEEP.planPage("idea",extra):currentRoute==="glossary"?K.glossary():chapter(currentRoute);
 $$("[data-sub]").forEach(a=>a.classList.toggle("selected",a.dataset.sub===raw+"/"+extra));
 $$("[data-rule-nav]").forEach(a=>a.classList.toggle("selected",raw==="glossary"?a.dataset.ruleNav==="glossary":raw==="classic"&&a.dataset.ruleNav===extra));
 if(currentRoute==="market")renderMarketResults();
 if(currentRoute==="candy"&&V)$("#holdDemo").innerHTML=holdHTML();
 if(["classic","game","new","idea"].includes(raw)){window.scrollTo(0,0);requestAnimationFrame(()=>$("#main").focus({preventScroll:true}));}
 if(raw==="product"&&extra)showProduct(extra,false);
 else if(raw==="profile"&&extra)showProfile(extra,false);
 else if(raw==="source"&&extra)showSource(extra,false);
 else if(raw==="glossary"&&extra){const target=document.getElementById("term-"+extra);if(target){const d=$("details",target);if(d)d.open=true;requestAnimationFrame(()=>target.scrollIntoView({block:"start"}));}}
 else if(!["classic","game","new","idea"].includes(raw)&&extra){const target=document.getElementById(extra);if(target){const detail=$("details",target);if(detail)detail.open=true;requestAnimationFrame(()=>target.scrollIntoView({block:"start"}));}}
 else {window.scrollTo(0,0);requestAnimationFrame(()=>$("#main").focus({preventScroll:true}));}
 toggleNav(false);
}
function toggleNav(open){$("#sidebar").classList.toggle("open",open);$("#navMask").classList.toggle("visible",open);$("#menuToggle").setAttribute("aria-expanded",String(open));}
async function copy(text){try{await navigator.clipboard.writeText(text);toast("已复制");}catch(e){beginModal("复制内容",`<p>当前浏览器不允许直接写剪贴板。可选择下面内容手动复制。</p><textarea style="width:100%;min-height:80px;background:#101725;color:var(--text);border:1px solid var(--line);padding:12px" readonly>${esc(text)}</textarea>`,{type:"copy"});}}
function copyLink(path){return copy(location.href.split("#")[0]+"#"+path);}

document.addEventListener("click",e=>{
 const b=e.target.closest("button,a,[data-term]");if(!b)return;
 if(b.dataset.scroll){e.preventDefault();document.getElementById(b.dataset.scroll)?.scrollIntoView({behavior:"smooth",block:"start"});return;}
 if(DASH&&DASH.onClick(e.target))return;
 if(b.dataset.term){showTerm(b.dataset.term);return;}
 if(b.hasAttribute("data-classic-next")||b.hasAttribute("data-classic-prev")){const id=b.dataset.classicNext||b.dataset.classicPrev,panel=$("#classicDemo"),step=Number(panel.dataset.step),next=b.hasAttribute("data-classic-next")?(step+1)%K.steps[id]:Math.max(0,step-1);panel.dataset.step=next;panel.innerHTML=K.demo(id,next);const control=b.hasAttribute("data-classic-next")?"data-classic-next":"data-classic-prev";const focusTarget=panel.querySelector(`[${control}]`);if(focusTarget&&!focusTarget.disabled)focusTarget.focus({preventScroll:true});else panel.querySelector("[data-classic-next]")?.focus({preventScroll:true});return;}
 if(b.dataset.image){beginModal("截图放大",`<figure class="zoom-figure"><img src="${esc(V.resource(b.dataset.image))}" alt="${esc(b.dataset.caption)}"><figcaption>${esc(b.dataset.caption)}</figcaption></figure><p>原画面保留。编号只作UI定位，不代替机制动作或同条件实测。</p>`,{type:"image"});return;}
 if(b.dataset.viewaxis){$("#visualCompare").innerHTML=V.comparePanel(b.dataset.viewaxis);$$('[data-viewaxis]').forEach(x=>x.classList.toggle("active",x===b));return;}
 if(b.dataset.close){document.getElementById(b.dataset.close).close();return;}
 if(b.dataset.product){if($("#searchDialog").open)$("#searchDialog").close();showProduct(b.dataset.product);return;}
 if(b.dataset.profile){showProfile(b.dataset.profile);return;}
 if(b.dataset.source){showSource(b.dataset.source);return;}
 if(b.dataset.modalReturn){if(b.dataset.modalReturn==="product")showProduct(b.dataset.returnId);else if(b.dataset.modalReturn==="term")showTerm(b.dataset.returnId);else showProfile(b.dataset.returnId);return;}
 if(b.dataset.leader){leaderMetric=b.dataset.leader;$("#leaders").innerHTML=leaderHTML();return;}
 if(b.id==="nextHold"){holdStep=(holdStep+1)%4;$("#holdDemo").innerHTML=holdHTML();$("#nextHold").focus();return;}
 if(b.dataset.trend){const p=productById(b.dataset.trendId);$("#productTrend").innerHTML=sparkline(p,b.dataset.trend);$$("[data-trend]").forEach(x=>x.classList.toggle("active",x===b));return;}
 if(b.dataset.copyLink){copyLink(b.dataset.copyLink);return;}
 if(b.dataset.copyText){copy(b.dataset.copyText);return;}
 if(b.dataset.localFile){localSource(Number(b.dataset.localFile));return;}
 if(b.dataset.localSource){const path="本地资料/汇报&分享/tripeaks-四款竞品体验分析.html";beginModal("同事实机报告 · 本机定位",`<p>内部HTML与截图，仅代表该版本与账号。未上传到团队或公网。</p><p style="overflow-wrap:anywhere">${esc(path)}</p><button class="btn secondary small" data-copy-text="${esc(path)}">复制本机路径</button>`,{type:"local"});return;}
 if(b.dataset.searchSuggest){$("#globalSearch").value=b.dataset.searchSuggest;searchResults(b.dataset.searchSuggest);return;}
 if(b.dataset.searchResult){$("#searchDialog").close();if(b.dataset.searchResult==="product")showProduct(b.dataset.resultId);else if(b.dataset.searchResult==="source")showSource(b.dataset.resultId);else location.hash=b.dataset.resultId;return;}
 if(b.hasAttribute("data-navigate-close")){modalReturnHash="";closeDetail();return;}
 if(b.id==="prevPage"||b.id==="nextPage"){M.page+=b.id==="prevPage"?-1:1;renderMarketResults();return;}
 if(b.id==="mauSort"||b.id==="downloadSort"){const metric=b.id==="mauSort"?"mau":"downloads";M.order=M.metric===metric?(M.order==="desc"?"asc":"desc"):"desc";M.metric=metric;M.page=1;renderMarketResults();return;}
 if(b.id==="resetFilters"){Object.assign(M,{scope:"discovery167",month:"2026-09",q:"",branch:"all",coverage:"all",metric:"mau",order:"desc",page:1});$("#main").innerHTML=market();renderMarketResults();return;}
});
document.addEventListener("input",e=>{
 if(e.target.id==="productSearch"){M.q=e.target.value;M.page=1;renderMarketResults();}
 if(e.target.id==="globalSearch")searchResults(e.target.value);
 if(e.target.id==="termSearch"){$("#termCards").innerHTML=K.termCards(e.target.value);const n=$$(".glossary-card").length;$("#termCount").textContent=n+"个匹配术语";}
 if(e.target.id==="sourceSearch"){const q=e.target.value.toLowerCase();const list=C.sources.filter(s=>[s.title,s.notes,s.scope].join(" ").toLowerCase().includes(q));$("#sourceList").innerHTML=list.length?sourceCards(list):'<p class="empty-state">没有匹配来源。未选用的原编号仍保留在v10原稿。</p>';}
});
document.addEventListener("change",e=>{
 if(DASH&&DASH.onChange(e.target))return;
 const map={scopeFilter:"scope",monthFilter:"month",branchFilter:"branch",coverageFilter:"coverage"};const key=map[e.target.id];if(!key)return;
 M[key]=e.target.value;M.page=1;
 if(key==="month"&&M.month!=="2026-09"&&["discovery167","source136"].includes(M.scope)){M.scope="monthly174";$("#scopeFilter").value=M.scope;toast("已切到月度候选集；九月发现集只对应2026-09");}
 if(key==="scope"&&["discovery167","source136"].includes(M.scope)){M.month="2026-09";$("#monthFilter").value=M.month;}
 renderMarketResults();
});
$("#openSearch").addEventListener("click",openSearch);$("#globalSearch").addEventListener("keydown",e=>{if(e.key==="Enter")$("#searchResults .search-result")?.click();});
$("#footerBoundary").addEventListener("click",boundary);$("#menuToggle").addEventListener("click",()=>toggleNav(!$("#sidebar").classList.contains("open")));$("#navMask").addEventListener("click",()=>toggleNav(false));
$("#detailDialog").addEventListener("close",()=>{if($("#detailDialog").open)return;if(modalReturnHash&&!/^#(product|profile|source)\//.test(modalReturnHash))history.replaceState(null,"",modalReturnHash);else if(modalReturnHash)history.replaceState(null,"",`#${currentRoute}`);modalReturnHash="";modalReturnEntity=null;});
["#detailDialog","#searchDialog"].forEach(s=>$(s).addEventListener("click",e=>{if(e.target===$(s)){const r=$(s).getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$(s).close();}}));
document.addEventListener("keydown",e=>{if((e.key==="Enter"||e.key===" ")&&e.target.matches("[data-term]")){e.preventDefault();e.target.dispatchEvent(new MouseEvent("click",{bubbles:true}));return;}if(e.key==="/"&&!/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)&&!$("#detailDialog").open){e.preventDefault();if(!$("#searchDialog").open)openSearch();}if(e.key==="Escape"){e.preventDefault();if($("#searchDialog").open)$("#searchDialog").close();else if($("#detailDialog").open)closeDetail();toggleNav(false);}});
window.addEventListener("hashchange",route);
window.RESEARCH_APP = {ranks,point,marketItems,previousMonth};
route();
})();
