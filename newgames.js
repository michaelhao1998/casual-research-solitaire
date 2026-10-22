"use strict";
/* v4 第三章：新品逐款玩法拆解。证据分级：官方/录屏观察/推断/待核；规则示意均为构造示意。 */
window.RESEARCH_NEW_PAGES=(()=>{
const D=window.RESEARCH_DATA,G=window.RESEARCH_DASH;
const esc=s=>String(s??"").replace(/[&<>"']/g,x=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[x]));
const media=f=>(window.RESEARCH_MEDIA_BASE||"")+f;
const KIND={fact:["官方/来源","fact"],obs:["录屏观察","obs"],ana:["分析判断","ana"],hyp:["推断/待核","hyp"]};
const tag=(t,c="")=>`<span class="dtag ${c}">${esc(t)}</span>`;
const kind=k=>tag(KIND[k][0],KIND[k][1]);
const sec=(id,no,kicker,title,lead,body)=>`<section class="deep-sec" id="${id}"><header class="deep-head"><span class="deep-no">${no}</span><div><span class="overline">${esc(kicker)}</span><h2>${title}</h2>${lead?`<p>${lead}</p>`:""}</div></header>${body}</section>`;
const toc=list=>`<nav class="page-toc" aria-label="本页目录">${list.map(([id,t],i)=>`<a href="#" data-scroll="${id}"><span>${String(i+1).padStart(2,"0")}</span>${esc(t)}</a>`).join("")}</nav>`;
const clip=c=>`<figure class="clip"><div class="clip-frame ${c.portrait?"portrait":""}"><video controls preload="none" playsinline poster="${media(c.poster)}" aria-label="${esc(c.title)}"><source src="${media(c.src)}" type="video/mp4"></video></div><figcaption><b>${esc(c.title)}</b>${c.note?`<span>${esc(c.note)}</span>`:""}<ol class="clip-marks">${c.marks.map(([t,x])=>`<li><time>${esc(t)}</time>${esc(x)}</li>`).join("")}</ol></figcaption></figure>`;
/* 牌：c=r/b/g/n 颜色；st=ok/no/dim/back/empty */
const pc=(v,c="n",st="",extra="")=>`<span class="pc ${c} ${st}">${v===""?"":`<b>${esc(v)}</b>`}${extra}</span>`;
const missing=`<div class="data-strip missing"><b>当前数据快照未收录该产品</b><span>不填0、不用同名产品代填；如需规模数据需补导出。</span></div>`;

/* ================= 1 · Associations ================= */
const associations={
 name:"Solitaire Associations Journey",studio:"Hitapps",dataId:"MS0035",fusion:"Solitaire × Sort · 语义归类",
 gp:"https://play.google.com/store/apps/details?id=com.hitappsgames.wordsolitaire&hl=en",
 thesis:"把“点数相差1”换成“它属于哪一类”：判断依据从数字变成常识，零规则门槛；但牌桌仍有遮挡、类别位有限、步数有限——知道答案，还得拿得到牌。",
 high:[["改了什么","匹配依据：±1 → 语义从属","成员卡归入它所属的类别；类别本身也是一张牌，要先占位才能开组。"],["爽点","“这个我知道”","识别正确的瞬间就是奖励，不需要先学规则；题库可以无限扩张。"],["代价","公平感取决于题目","词义、文化与翻译歧义会让失败不可归因于玩家规划。"]],
 clip:{src:"presentation/media/media10.mp4",poster:"presentation/media/poster-12-1.jpg",portrait:true,title:"第5关实录 · 原PPT P12 · 7.5秒（中文界面）",note:"看三件事：类别位上的 n/m 计数、带王冠的类别卡、左上“移动”数字。",marks:[["0–1s","第5关，移动25；顶部4个类别位，左上牌库翻出“木材”"],["1–3s","移开“住宅”后，“乾衣機”归入电器类（计数3/4）；原位置露出带王冠的“地图”"],["3–5s","翻牌库，“沙丁鱼”从翻出位直接归入鱼类（4/8）"],["5–7s","继续归类，移动降到20"]]},
 spec:[
  ["牌桌","4列：上层暗牌、底层明牌（词卡或图卡）；只有明牌可操作","obs"],
  ["类别区","顶部一排类别位，每位显示“类别名 + 已收/应收”（如电器3/4、鱼类4/8）；类别位数量随关卡变化","obs"],
  ["类别卡","带王冠标记的牌是“类别”本身，必须放入一个空类别位才能开启该组","obs"],
  ["合法动作","把成员卡放入其所属、且已开启的类别位，计数+1；明牌可在列间移动以腾出位置（录屏可见“住宅”被移开）","obs"],
  ["供给","左上牌库 + 翻出位；翻出的牌可直接归类","obs"],
  ["预算","“移动”步数：录屏中25→20，随操作递减","obs"],
  ["胜负","推断：所有类别收满即过关；步数耗尽且未完成即失败（官方未逐条核对）","hyp"],
  ["道具","底部3个按钮：提示、撤回、第三个卡牌道具（用途待核），均带次数角标","obs"]
 ],
 demo:()=>`<div class="rd"><div class="rd-row"><div class="cat"><small>类别位</small><b>电器</b><em>2/4 → 3/4</em></div><span class="rd-op">←</span>${pc("乾衣機","n","ok w")}<span class="rd-note">成员卡归入已开启的类别，计数+1</span></div>
 <div class="rd-row"><div class="cat empty"><small>空类别位</small><b>—</b></div><span class="rd-op">←</span>${pc("地图","n","crown w")}<span class="rd-note">王冠 = 类别卡：先占一个空位，才能开“地图”组</span></div>
 <div class="rd-row"><div class="cat"><small>类别位</small><b>鱼类</b><em>3/8</em></div><span class="rd-op no">✕</span>${pc("木材","n","no w")}<span class="rd-note">不属于该类：放不进去，只能等它的类别开启</span></div></div>`,
 compare:[["判断依据","点数相差1（不看花色）","语义从属：成员 → 类别"],["基准","一张弃牌顶","多个类别位并行"],["卡位","覆盖：压住的牌不能动","覆盖 + 类别位上限"],["供给","Stock逐张翻","牌库 + 翻出位"],["完成条件","清空牌桌","收满所有类别（推断）"],["预算","Stock张数","移动步数"]],
 joys:[
  ["识别即奖励","判断依据是玩家已有的常识","“这个我知道”——不用学规则就能做对第一步","ana"],
  ["凑齐的满足","类别位 n/m 计数逐格推进","每归一张都有可见进度，收满一组有完结感","obs"],
  ["揭开新类别","王冠类别卡藏在暗牌下","挖出“地图”的瞬间既是惊喜，也是新的待办","obs"],
  ["内容可无限扩张","题库=关卡内容","换一组词就是新关，内容成本远低于美术关卡","ana"]
 ],
 decide:["先开哪一类：类别位有限，开错类别会占住位置","先归类，还是先腾位置：挡住关键牌的明牌要不要先挪","何时翻牌库：翻出的牌可能用不上，又白耗一步","步数怎么花：移动是唯一预算，挪位也算一步"],
 fail:[["知识歧义","“乾衣機”算电器还是家具？词义、文化、繁简翻译不同","不可归因于规划，是公平感风险；需题库校对"],["路径阻塞","需要的牌压在暗牌下、类别位被占满","可归因：玩家能指出“我开错了类别”"],["步数耗尽","挪位与翻牌消耗过多","可归因，但需要剩余步数始终醒目"]],
 meta:"录屏可见金币（684）与道具次数角标；局外系统、付费点与广告频率未核，不写结论。",
 verdict:{good:["规则门槛几乎为零：会认字就会玩","把“认答案”和“整理牌桌”接成一个动作，避免变成纯答题","内容生产可规模化，支持长线关卡供给"],cost:["题目歧义直接伤公平感，且随语言版本放大","高手的规划优势可能被“认不认识这个词”掩盖","与传统Solitaire用户重叠度待核"],open:["类别收满后类别位是否释放？","列间移动是否有叠放限制？","9月MAU 1162.6万中，有多少来自语义玩法本身、多少来自买量？"]},
 refs:[]
};

/* ================= 2 · Make It 10 ================= */
const makeit10={
 name:"Make It 10: Solitaire Puzzle",studio:"Unico Studio",dataId:null,fusion:"Pyramid变种 · 凑10 + 暂存位",
 gp:"https://play.google.com/store/apps/details?id=com.unicostudio.makeit10&hl=en",
 thesis:"不再围着一张底牌接链，而是任取两张可用牌凑成10一起消掉；抽来的牌先进入3格暂存位——暂存位既是缓冲，也是失败压力。",
 high:[["改了什么","无基准 → 两两配对","任意两张可用牌，点数和为10即可消除；J/Q/K与同类配对。"],["爽点","心算秒懂 + 一次消两张","10以内加法零门槛，每次消除带“10”字爆点。"],["代价","暂存位与步数双上限","抽牌一次进3张，暂存位很快被占满，周转空间成为主要压力。"]],
 clip:{src:"presentation/media/media11.mp4",poster:"presentation/media/poster-12-2.jpg",portrait:true,title:"第3关实录 · 原PPT P12 · 6秒",note:"看底排明牌、底部3个暂存位、右下牌库数字与顶部Moves。",marks:[["0s","Moves 32；5列暗牌，底排明牌5、4、9、5、1；牌库19"],["1s","9+1凑10清除，上方翻出8与9"],["2–3s","5+5清除，Moves 30"],["4s","点牌库：3、3、5依次落入3个暂存位，牌库19→16"],["5s","底排7与暂存位中的3凑10清除，露出6，Moves 28"]]},
 spec:[
  ["牌桌","5列：上层暗牌，每列最底一张为明牌","obs"],
  ["可用牌","各列最底明牌 + 暂存位中的牌","obs"],
  ["合法动作","两张可用牌点数和=10则一起清除（1+9、5+5、7+3…）；J/Q/K各与同类配对","fact"],
  ["揭牌","清除后，该列上方暗牌翻开成为新明牌","obs"],
  ["供给","点击牌库：录屏中一次抽出3张，依次进入3个暂存位（19→16）","obs"],
  ["预算","Moves：32→28，消除与抽牌均消耗","obs"],
  ["胜负","推断：清空牌桌即过关；Moves耗尽失败。暂存位满是否立即失败——待核（原稿已提示不能默认）","hyp"],
  ["道具","左下两个按等级解锁的道具 + 一个Free道具","obs"]
 ],
 demo:()=>`<div class="rd"><div class="rd-row">${pc("9","r","ok")}<span class="rd-op">+</span>${pc("1","n","ok")}<span class="rd-op">=</span><span class="rd-sum">10</span><span class="rd-note">两张可用牌和为10：一起清除</span></div>
 <div class="rd-row">${pc("7","r","ok")}<span class="rd-op">+</span>${pc("3","n","ok bench")}<span class="rd-op">=</span><span class="rd-sum">10</span><span class="rd-note">暂存位里的牌同样可用——抽来的牌靠它“盘活”</span></div>
 <div class="rd-row">${pc("J","n","ok")}<span class="rd-op">+</span>${pc("J","r","ok")}<span class="rd-op">=</span><span class="rd-sum">同类</span><span class="rd-note">J/Q/K不参与加法，与同类配对</span></div>
 <div class="rd-row">${pc("6","n","no")}<span class="rd-op">+</span>${pc("3","r","no")}<span class="rd-op no">≠</span><span class="rd-sum no">9</span><span class="rd-note">和不为10：不能消，只能等或抽牌</span></div></div>`,
 compare:[["判断依据","与弃牌顶相差1","两张可用牌和为10"],["基准","一张弃牌顶","无基准，任意两张"],["每次消除","1张","2张"],["供给","Stock逐张翻到弃牌位","牌库一次3张进暂存位"],["缓冲","无","3格暂存位"],["预算","Stock张数","Moves + 暂存位"]],
 joys:[["心算秒懂","10以内加法","看到9就找1：判断零延迟，节奏快","ana"],["一次消两张","配对清除 + 翻开上层","清屏速度比±1接龙更快，连续揭牌有推进感","obs"],["盘活","暂存位里的牌后续可用","抽来的“废牌”在后面凑上10，是一种翻盘感","obs"],["多解的小选择","同一张牌可配多个对象","选哪张决定翻开哪一列，有轻度规划","ana"]],
 decide:["同一张6可配两张4：先消哪张，决定翻开哪一列","何时抽牌：一次进3张，抽早了会占满暂存位","暂存位留几格：留空间给后面的关键牌","Moves 怎么花：消除和抽牌同价"],
 fail:[["暂存位堵满","抽进来的3张都配不上","可归因：抽牌时机过早"],["Moves耗尽","揭牌路线绕远","可归因：选错了配对对象"],["牌序运气","关键牌压在最深层","部分不可控，需关卡保证可解"]],
 meta:"录屏可见金币（790）、关卡号与底部Banner广告；局外系统与付费点未核。",
 verdict:{good:["把“找关系”简化成加法，判断成本比±1更低","两两消除提升清屏速度，适合短会话","暂存位把运气转成可管理的周转空间"],cost:["规划深度有限：多数时候只有一两个可配对象","Pyramid本就有Stock，凑10也非首创；差异化主要在暂存位","不在当前数据快照，规模无法判断"],open:["暂存位满是否即失败？","J/Q/K配对是否占用Moves？","与Solitaire 10 Match（Jinli）的规则差异"]}
};

/* ================= 3 · Fusion ================= */
const fusion={
 name:"Solitaire Fusion: Match Story",studio:"Jollify Games",dataId:null,fusion:"Solitaire × Merge · 局内同点合成",
 gp:"https://play.google.com/store/apps/details?id=com.JollifyGames.SolitaireFusion&hl=en",
 thesis:"牌不再只是被“接走”，而是会“变成新的牌”：同点两张合成高一级，并沿预先搭好的递减串连锁——先搭串是蓄力，落下关键牌是引爆。",
 high:[["改了什么","接走 → 合成产生新牌","目标从“清空”变成“做出目标点数”，牌桌在每次合成后都会变形。"],["爽点","一张牌引爆整串","4-3-2-A 落下一张A，连锁坍缩成5——多米诺式连锁。"],["代价","规则需要推断","8秒录屏只能看到结果，完整数值规则仍需长录像确认。"]],
 clip:{src:"presentation/media/media12.mp4",poster:"presentation/media/poster-13-1.jpg",portrait:true,title:"连锁合成实录 · 原PPT P13 · 8秒（竖屏）",note:"看顶部TARGET、中部一排7个槽位、下方递减牌串，以及合成后飞入目标的那张牌。",marks:[["0–1s","TARGET：5×1、10×1；中部7个槽位，两列递减串（4-3-2-A、9-8-7-6）"],["2–3s","拖动牌在槽位间调整位置"],["4s","一张A落到4-3-2-A列尾：整串连锁坍缩成一张5，+金币"],["5s","5飞入TARGET，第一个目标完成（+5金币）"],["6–7s","一张6落到9-8-7-6列尾，连锁成10，完成第二个目标"]]},
 spec:[
  ["目标区","顶部TARGET：要求做出的点数与数量（录屏为5×1、10×1）","obs"],
  ["槽位","中部一排7个槽位，可放置单牌或牌串","obs"],
  ["牌串","递减排列的牌列（如4-3-2-A），列尾为最小点数","obs"],
  ["合成规则","同点两张合成为点数+1的一张；新牌若与上一张同点，继续合成（连锁）","hyp"],
  ["推断依据","4-3-2-A 加一张A最终得到5：A+A→2→与2合成3→与3合成4→与4合成5。若规则是“相加”，A+A=2之后会得到4，无法与3继续合成，结果对不上","ana"],
  ["完成目标","合成出的牌等于目标点数时自动飞入TARGET并给金币","obs"],
  ["道具","UNDO、MAGIC CARD、+1 ADD SLOT（加一个槽位），各带次数","obs"],
  ["胜负","推断：TARGET全部完成即过关；槽位占满且无可合成则失败——待核","hyp"]
 ],
 demo:()=>`<div class="rd"><div class="rd-row chain"><div class="rd-col">${pc("4","r")}${pc("3","n")}${pc("2","r")}${pc("A","n")}</div><span class="rd-op">←</span>${pc("A","r","ok")}<span class="rd-note">落下一张A到串尾</span></div>
 <div class="rd-chain">${[["A+A","2"],["2+2","3"],["3+3","4"],["4+4","5"]].map(([a,b],i)=>`<div class="rd-step"><small>${String(i+1).padStart(2,"0")}</small><span>${a}</span><b>→ ${b}</b></div>`).join('<i>›</i>')}<div class="rd-step goal"><small>TARGET</small><span>5×1</span><b>完成 ✓</b></div></div>
 <p class="rd-foot">构造示意：按“同点合成+1、沿串连锁”的推断规则还原录屏 4s 处的结果。</p></div>`,
 compare:[["一次操作的结果","移走一张牌","产生一张新牌"],["牌桌变化","只减少","合成后变形、可能连锁"],["完成条件","清空牌桌","做出目标点数"],["规划对象","接牌顺序","搭串（蓄力）+ 引爆时机"],["资源","Stock","槽位（可用道具+1）"],["融合深度","—","局内、双向：合成改变牌列与可用槽位"]],
 joys:[["连锁引爆","一张牌沿递减串连续合成","多米诺式的“一下全倒”，是本作最核心的爽点","obs"],["数字变大","每次合成点数+1，目标点亮","2048同源的成长感：看着数字往上走","ana"],["蓄力-引爆节奏","先搭串、再落关键牌","把等待变成准备：搭得越长，引爆越爽","ana"],["目标飞入","达成目标牌自动飞走+金币","每个目标都有明确的完成仪式","obs"]],
 decide:["先合什么：同一张牌放在哪一串，决定后面能连几级","搭多长的串：串越长收益越大，但占用槽位越久","关键牌留给谁：A只有几张，给哪一串引爆","何时用+1槽位：救局还是扩大连锁"],
 fail:[["槽位占满","牌没处放、也无同点可合","可归因：搭串过多、过早"],["缺关键牌","需要的点数迟迟不来","部分不可控，需供牌设计保证"],["规则误判","以为能合、实际不能","若合成规则不直观，失败会被感知为“不公平”"]],
 meta:"录屏可见金币（1166）与每次完成目标的金币奖励；局外系统与回流未核。",
 verdict:{good:["四款新品中改动Solitaire本质最深：从“移走”变成“生成”","连锁合成提供极强的单次爽点，短视频买量友好","把Klondike式“整理递减串”变成蓄力，老玩法有了新用途"],cost:["规则只能靠录屏推断，教学成本可能高","合成结果可预测性决定公平感：一旦算不清就像随机","不在当前数据快照，体量未知，只作机制样本"],open:["合成是否只能在串尾发生？","不同花色/颜色是否影响合成？","目标点数与关卡难度如何配置？"]}
};

/* ================= 4 · Merge Kingdom ================= */
const mergekingdom={
 name:"Solitaire: Merge Kingdom",studio:"FUNJOY",dataId:null,fusion:"TriPeaks主局 × 局外Merge-3",
 gp:"https://play.google.com/store/apps/details?id=com.solitairemanor.secrets&hl=en",
 thesis:"牌局本身仍是TriPeaks ±1；变化在“一局之后”：结算后进入一块花园棋盘，用三合一的Merge-3升级物品、修复家园——一局之后还有另一套可玩的内容。",
 high:[["改了什么","局内不动，局外加一套Merge-3","与Grand Harvest同属“局外第二系统”，但这里的局外本身是成熟玩法。"],["爽点","打完还能“整理”","三个同级合成一个高级，是另一种清屏满足。"],["代价","两套操作切换","资源是否双向回流未证；两类玩家是否同一批人待验证。"]],
 clip:{src:"presentation/media/media13.mp4",poster:"presentation/media/poster-13-2.jpg",title:"牌局结算 → 花园Merge-3 · 原PPT P13 · 15秒（横屏）",note:"看三个环节：结算宝箱与金币、Merge-3教学、花园棋盘上的合成与右下绿色按钮的数字。",marks:[["0–1s","“YOU DID IT!”结算宝箱，金币+1,049"],["2–3s","教学：“Merge three items to obtain an upgraded one!”"],["4–5s","进入花园棋盘，点击宝箱（TAP!）产出物品"],["6–14s","三个同级花卉合成高一级；右下绿色按钮显示“4”"],["15s","金币余额 6,206 → 6,306（+100，来源待核）"]]},
 spec:[
  ["主局","TriPeaks：±1接牌（官方描述；本段录屏只覆盖结算）","fact"],
  ["结算","过关得宝箱与金币（录屏+1,049）","obs"],
  ["局外棋盘","斜视角花园网格，散布花卉等物品","obs"],
  ["合成规则","三个同级物品合成一个高一级物品（教学原文）","obs"],
  ["生成","点击宝箱产出新物品（TAP!提示）","obs"],
  ["次数/能量","右下绿色按钮显示“4”，推断为可用次数或生成次数——待核","hyp"],
  ["回流","合成产物是否回到牌局（道具/加牌）未见证据，不写双向循环","hyp"]
 ],
 demo:()=>`<div class="rd loop2"><div class="lp"><small>循环①</small><b>TriPeaks 牌局</b><span>±1 接牌、清台</span></div><span class="rd-op">→</span><div class="lp gain"><small>产出</small><b>宝箱 + 金币</b><span>录屏 +1,049</span></div><span class="rd-op">→</span><div class="lp"><small>循环②</small><b>花园 Merge-3</b><span>3 个同级 → 1 个高级</span></div><span class="rd-op">→</span><div class="lp gain"><small>目标</small><b>家园修复</b><span>装修推进</span></div>
 <div class="lp-back">↺ 合成产物是否回到牌局？——<b>待核</b>：只有录到资源回流，才能称为双向循环</div></div>
 <div class="rd"><div class="rd-row">${["🌷","🌷","🌷"].map(x=>`<span class="pc n ok"><b>${x}</b></span>`).join('<span class="rd-op">+</span>')}<span class="rd-op">→</span><span class="pc n ok big"><b>💐</b></span><span class="rd-note">Merge-3：三个同级合成一个高级（教学原文）</span></div></div>`,
 compare:[["局内规则","±1接牌","±1接牌（不变）"],["一局之后","进入下一关","进入花园Merge-3棋盘"],["长期目标","关卡推进","家园修复 + 物品图鉴"],["第二系统","—","成熟玩法（Merge-3）"],["与Harvest对照","—","同为局外第二系统；Harvest是农场经营，这里是合成"],["融合深度","—","局外、单向（回流待核）"]],
 joys:[["打完还有事做","结算后直接进入另一块棋盘","一局的结束变成另一种玩法的开始","obs"],["三合一的整理感","同级物品三个合一","把散乱物品理整齐，是与接龙不同的满足","obs"],["家园被修好","合成推进装修","可见的长期成果，类似Disney的场景复原","ana"]],
 decide:["牌局内：与TriPeaks一致（先接哪张、何时翻Stock）","棋盘上：先合哪一组、是否攒到更多再合（是否有5合2奖励——待核）","资源分配：金币用于牌局道具还是棋盘（待核）"],
 fail:[["牌局失败","Stock耗尽无可接牌","与TriPeaks一致，可归因"],["棋盘无失败","Merge棋盘录屏未见失败条件","局外以“推进慢”替代“失败”"]],
 meta:"本页的“局外”就是主看点：见上方双循环示意。",
 verdict:{good:["不碰熟悉的±1，降低老玩家迁移成本","局外用成熟Merge-3，内容与操作都现成","给每局结算一个“去做别的事”的出口"],cost:["两套操作来回切换，节奏割裂","接龙用户与Merge用户是否同一批人未证","不在当前数据快照，体量未知"],open:["合成产物是否回流牌局？","绿色按钮“4”代表什么资源？","不进入花园，主局能否持续推进？"]}
};

const ALL={associations,makeit10,fusion,mergekingdom};
const ORDER=[["associations","Associations"],["makeit10","Make It 10"],["fusion","Fusion"],["mergekingdom","Merge Kingdom"],["others","其他新品"]];
const sw=id=>`<div class="gh-switch">${ORDER.map(([k,n])=>`<a class="${k===id?"active":""}" href="#new/${k}">${n}</a>`).join("")}</div>`;

function page(id){
 if(id==="others")return others();
 const g=ALL[id];if(!g)return null;
 const i=ORDER.findIndex(x=>x[0]===id),nx=ORDER[i+1];
 return `<div class="classic-breadcrumb"><a href="#changes">新品变化</a><span>/</span>${esc(g.name)}</div>
 <header class="game-hero"><div class="gh-copy"><div class="gh-tags">${tag(g.fusion,"role")}${tag(g.studio)}</div><h1>${esc(g.name)}</h1><p class="gh-thesis">${esc(g.thesis)}</p>${sw(id)}<a class="text-button" href="${g.gp}" target="_blank" rel="noopener noreferrer">Google Play ↗</a></div><div class="gh-data">${g.dataId?G.productStrip(g.dataId):missing}</div></header>
 ${toc([["n-see","实机录屏"],["n-rule","规则拆解"],["n-demo","规则示意"],["n-vs","与TriPeaks对照"],["n-joy","爽点"],["n-dec","决策与失败"],["n-ver","分析判断"]])}
 <div class="highlight-row">${g.high.map(([k,t,d],j)=>`<article class="${j===0?"main":""}"><span class="overline">${esc(k)}</span><h3>${esc(t)}</h3><p>${esc(d)}</p></article>`).join("")}</div>
 ${sec("n-see","01","RECORDING","实机录屏：先看再读","时间点是阅读提示；录屏只能证明画面里发生了什么。",`<div class="clip-grid n1">${clip(g.clip)}</div>`)}
 ${sec("n-rule","02","RULE SPEC","规则拆解：组件、动作、供给与胜负","每条标注依据：录屏观察 / 官方 / 推断待核。推断不写成定论。",`<table class="spec"><thead><tr><th>模块</th><th>规则</th><th>依据</th></tr></thead><tbody>${g.spec.map(([a,b,k])=>`<tr><td>${esc(a)}</td><td>${esc(b)}</td><td>${kind(k)}</td></tr>`).join("")}</tbody></table>`)}
 ${sec("n-demo","03","HOW IT WORKS","规则示意：一个动作看懂合法与不合法","构造示意，非实录截图。",g.demo())}
 ${sec("n-vs","04","VS TRIPEAKS","与TriPeaks对照：到底改了哪一层","",`<table class="mini-table vs"><thead><tr><th>维度</th><th>TriPeaks</th><th>${esc(g.name.split(":")[0])}</th></tr></thead><tbody>${g.compare.map(([a,b,c])=>`<tr><td>${esc(a)}</td><td>${esc(b)}</td><td><b>${esc(c)}</b></td></tr>`).join("")}</tbody></table>`)}
 ${sec("n-joy","05","FUN","爽点拆解：机制 → 玩家感受","",`<div class="joy-grid">${g.joys.map(([t,m,f,k],j)=>`<article><span class="joy-no">${String(j+1).padStart(2,"0")}</span><h4>${esc(t)}</h4><dl><dt>机制来源</dt><dd>${esc(m)}</dd><dt>玩家感受</dt><dd>${esc(f)}</dd></dl>${kind(k)}</article>`).join("")}</div>`)}
 ${sec("n-dec","06","DECISION & FAILURE","玩家在想什么，又会怎么输","失败必须能被玩家指出原因；不可归因的失败要单独标出。",`<div class="dec-wrap"><div class="dec"><h4>每一步的取舍</h4><ol>${g.decide.map(x=>`<li>${esc(x)}</li>`).join("")}</ol></div><table class="mini-table"><thead><tr><th>失败类型</th><th>发生情形</th><th>能否归因</th></tr></thead><tbody>${g.fail.map(([a,b,c])=>`<tr><td>${esc(a)}</td><td>${esc(b)}</td><td>${esc(c)}</td></tr>`).join("")}</tbody></table></div><p class="sec-foot">${kind("obs")} 局外与商业化：${esc(g.meta)}</p>`)}
 ${sec("n-ver","07","ANALYST VERDICT","分析判断","基于规则与录屏的机制分析，不是留存或收入的因果结论。",`<div class="verdict"><div class="v-good"><h4>做得好的</h4><ul>${g.verdict.good.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div><div class="v-cost"><h4>代价与风险</h4><ul>${g.verdict.cost.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div><div class="v-open"><h4>仍待验证</h4><ul>${g.verdict.open.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div></div>`)}
 ${nx?`<div class="chapter-end"><div><strong>下一款：${esc(nx[1])}</strong><p>${nx[0]==="others"?"其余新品与边界样本名单。":"继续看另一种融合位置。"}</p></div><a class="btn secondary small" href="#new/${nx[0]}">继续 →</a></div>`:""}`;
}

/* ================= 其他新品：数据驱动名单 ================= */
function others(){
 const GROUPS=[
  {k:"sem",t:"语义归类：判断依据换成常识",layer:"局内 · 匹配关系",d:"与Associations同构：词卡/图卡归入所属类别，类别位与步数构成牌桌压力。差异多在题库（词语/图片/邮票）与类别位规则。",m:["语义／词语归类","语义/词语归类","相邻：词/图语义","相邻：词语语义","相邻：图片语义","图像类别归组","词语构造/牌桌"]},
  {k:"math",t:"算术配对：判断依据换成加法/方程",layer:"局内 · 匹配关系",d:"与Make It 10同族：两张牌凑出目标和（10）或满足方程即消除；Pyramid凑13的现代化变体。",m:["数学/方程归类","算术配对/凑10"]},
  {k:"sort",t:"颜色/排序：接近动态Sort的边界样本",layer:"局内 · 归堆方式",d:"按颜色或序列归组、配对消除，部分带有限侧轨——是第四章“传送带×±1”的直接参考方向。",m:["颜色归类","堆叠/排序变体","边界：颜色/数值＋有限侧轨","配对/图像归组"]},
  {k:"jig",t:"图像拼合：接龙动作服务拼图",layer:"局内 · 完成目标",d:"牌桌动作不变或简化，目标变成拼出一张完整图片；以Jigsaw标签上架，规模不计入传统纸牌。",m:["图像拼合"]},
  {k:"meta",t:"局间包装：规则不动，加旅行/收集",layer:"局外 · 长期目标",d:"Klondike/TriPeaks原规则，局外接旅行或日记收集；与第二章五款产品的Meta思路同类。",m:["Klondike＋轻旅行","TriPeaks＋旅行"]}
 ];
 const deep=/Associations Journey|Fusion: Match Story|Make It 10|Merge Kingdom/;
 const rows=[];
 for(const p of D.products){if(p.sourceSet!=="扩展机制"||deep.test(p.name))continue;const x=G.point(p,"2026-09");rows.push({name:p.name,pub:p.publisher,branch:p.branch,mau:x.mau,dl:x.downloads,links:p.links||[],inData:true});}
 for(const u of D.unmatchedResearch||[]){if(deep.test(u.name))continue;rows.push({name:u.name,pub:u.publisher,branch:u.branch,links:u.links||[],inData:false});}
 const gp=r=>{const off=r.links.filter(u=>/play\.google/.test(u));return off.length?off.map(u=>`<a href="${esc(u)}" target="_blank" rel="noopener noreferrer">Google Play ↗</a>`).join(" "):`<a class="muted-link" href="https://play.google.com/store/search?q=${encodeURIComponent(r.name)}&c=apps" target="_blank" rel="noopener noreferrer">商店搜索 ↗</a>`;};
 const num=v=>typeof v==="number"&&isFinite(v);
 const used=new Set();
 const html=GROUPS.map((g,i)=>{const list=rows.filter(r=>g.m.includes(r.branch));list.forEach(r=>used.add(r));if(!list.length)return "";list.sort((x,y)=>(num(y.mau)?y.mau:-1)-(num(x.mau)?x.mau:-1));
  return sec("o-"+i,String(i+1).padStart(2,"0"),g.layer,esc(g.t)+` <small class="cnt">${list.length}款</small>`,esc(g.d),`<table class="mini-table list"><thead><tr><th>产品</th><th>发行商</th><th>9月MAU</th><th>9月下载</th><th>商店</th></tr></thead><tbody>${list.map(r=>`<tr><td><b>${esc(r.name)}</b></td><td>${esc(r.pub)}</td><td>${r.inData&&num(r.mau)?G.wan(r.mau):"未收录"}</td><td>${r.inData&&num(r.dl)?G.wan(r.dl):"未收录"}</td><td>${gp(r)}</td></tr>`).join("")}</tbody></table>`);}).join("");
 const total=used.size;
 return `<div class="classic-breadcrumb"><a href="#changes">新品变化</a><span>/</span>其他新品与边界样本</div>
 <header class="game-hero"><div class="gh-copy"><div class="gh-tags">${tag("名单页","role")}${tag(total+" 款")}</div><h1>其他新品与边界样本</h1><p class="gh-thesis">未单列深拆的Solitaire扩展玩法，按“改了哪一层”分为5组；每组先给一句话玩法，再列产品。前面4款深拆已排除，麻将配对类为邻近赛道，不列入。</p>${sw("others")}</div><div class="gh-data"><div class="data-strip"><b>口径</b><span>规模为Mobile Source 9月源值，未收录写“未收录”不填0；“Google Play ↗”为数据表已核链接，“商店搜索 ↗”为按名称检索入口，需人工确认是否同一App。分组为名称/商店标签初筛，未逐款实机。</span></div></div></header>
 ${html}`;
}
return {page,ALL};
})();
