"use strict";
/* v4 深拆层：专题概览、产品分页、新品分页、机会分页。事实带原编号；录屏观察与分析判断分开标注。 */
window.RESEARCH_DEEP=(()=>{
const D=window.RESEARCH_DATA,C=window.RESEARCH_CONTENT,K=window.RESEARCH_CLASSIC,G=window.RESEARCH_DASH;
const esc=s=>String(s??"").replace(/[&<>"']/g,x=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[x]));
const media=f=>(window.RESEARCH_MEDIA_BASE||"")+f;
const ref=ids=>ids?.length?`<span class="ref-inline">${ids.map(n=>`<button class="ref-button" data-source="${n}">[${n}]</button>`).join("")}</span>`:"";
const tag=(t,c="")=>`<span class="dtag ${c}">${esc(t)}</span>`;
const KIND={fact:["官方/来源","fact"],obs:["录屏/截图观察","obs"],ana:["分析判断","ana"],hyp:["待验证假设","hyp"]};
const kind=k=>tag(KIND[k][0],KIND[k][1]);
function clip(c){return `<figure class="clip"><div class="clip-frame ${c.portrait?"portrait":""}"><video controls preload="none" playsinline poster="${media(c.poster)}" aria-label="${esc(c.title)}"><source src="${media(c.src)}" type="video/mp4"></video></div><figcaption><b>${esc(c.title)}</b>${c.note?`<span>${esc(c.note)}</span>`:""}${c.marks?`<ol class="clip-marks">${c.marks.map(([t,x])=>`<li><time>${esc(t)}</time>${esc(x)}</li>`).join("")}</ol>`:""}</figcaption></figure>`;}
function flowLoop(nodes){return `<div class="loop">${nodes.map((n,i)=>`<div class="loop-node ${n.k||""}"><small>${String(i+1).padStart(2,"0")} · ${esc(n.zone)}</small><b>${esc(n.t)}</b><span>${esc(n.d)}</span></div>`).join('<span class="loop-arrow" aria-hidden="true">→</span>')}<div class="loop-back"><span>↺ ${esc(nodes.back||"回到下一局")}</span></div></div>`;}
function sectionNav(list){return `<nav class="page-toc" aria-label="本页目录">${list.map(([id,t],i)=>`<a href="#" data-scroll="${id}"><span>${String(i+1).padStart(2,"0")}</span>${esc(t)}</a>`).join("")}</nav>`;}
const sec=(id,no,kicker,title,lead,body)=>`<section class="deep-sec" id="${id}"><header class="deep-head"><span class="deep-no">${no}</span><div><span class="overline">${esc(kicker)}</span><h2>${title}</h2>${lead?`<p>${lead}</p>`:""}</div></header>${body}</section>`;

/* ================= 产品：Candy（完整样板） ================= */
const candy={
 id:"candy",name:"Candy Crush Solitaire",studio:"King",launch:"2025-02-06 全球上线",dataId:"MS0675",ppt:9,role:"重点样本 · 局内机制代表",
 thesis:"在TriPeaks的±1骨架上，只加了一格Hold Slot，就把“出牌顺序”这件隐性的事，变成了玩家可以看见、可以操作的“存与放”。",
 highlights:[
  {k:"主看点",t:"Hold Slot：一格暂存，两个基准",d:"弃牌顶存入空槽，旧弃牌重新露出；当前牌与槽内牌都能被±1匹配。是五款里唯一把“规划”做成显性按钮的局内机制。",refs:[27]},
  {k:"局外",t:"明信片 + 周联赛双主线",d:"通关Energy推进旅行明信片；星星参与Weekly League排名，多了一条“和别人比”的回访理由。",refs:[25,115]},
  {k:"表现",t:"克制的Candy品牌视觉",d:"糖果角色与星光粒子确认奖励，但比Disney素、比Tiki干净，把注意力留给槽位判断。",refs:[115]}
 ],
 clips:[
  {src:"presentation/media/media8.mp4",poster:"presentation/media/poster-09-1.jpg",title:"局内Hold实录 · 13秒",note:"看弃牌位右侧的黄色虚线槽：存牌后旧弃牌重新露出。",marks:[["0–4s","以弃牌4为基准连续接走开放牌，连击计数上涨"],["4–8s","存入一张弃牌后，下层旧弃牌重新成为可匹配基准"],["8–13s","继续沿新基准接牌；槽内牌仍保留，可在后面使用"]]},
  {src:"media/candy-v12.mp4",poster:"media/candy-v12.jpg",title:"补充实录 · 12秒",note:"另一关的Hold使用与Rewards进度，用于观察槽位占用后的取舍。",marks:[["0–3s","开局：弃牌位与空Hold槽并排"],["3–8s","把当前牌放入槽，弃牌历史中的旧牌回到台前"],["8–12s","接牌推进，右上Rewards计数增加"]]}
 ],
 loop:Object.assign([
  {zone:"入场",t:"Coins / Lives",d:"额外操作、Lives与Boosters消耗Coins",k:"cost"},
  {zone:"局内",t:"±1接牌 + Hold",d:"当前牌与槽内牌双基准"},
  {zone:"卡局",t:"工具救局",d:"Undo、Fish、加牌等"},
  {zone:"结算",t:"Energy + 星星",d:"关内卡包需获胜后结算",k:"gain"},
  {zone:"局外",t:"明信片 / 相册 / 周联赛",d:"场景装饰、Card Sets、名次"}
 ],{back:"完成明信片得金币、万能牌与拼图，补给下一局"}),
 hold:{
  why:[
   {k:"fact",t:"规则只改了一处：基准从1个变成最多2个",d:"官方：弃牌顶放入空槽，前一张弃牌重新暴露；之后可围绕当前弃牌或槽内牌匹配。官方例子：存3露K，可接2/4或Q/A。",refs:[27]},
   {k:"fact",t:"它能解决“重复点数”的死局",d:"官方示例：弃牌顶Q、台面两张K。接走一张K后把它存槽，Q重新露出，第二张K再次可接。普通TriPeaks里这第二张K只能等翻Stock。",refs:[27]},
   {k:"ana",t:"真正新增的是“机会成本”",d:"只有一格：现在存，等于放弃后面某个更关键时刻的存；现在不存，可能断链去翻Stock。玩家第一次需要为“未来的一手”预留资源。",refs:[]},
   {k:"ana",t:"把隐性规划变成显性操作",d:"经典TriPeaks的深度藏在“先接6还是8”的心算里；Hold把它外化成一个按钮，新手也能感到“我做了一个聪明决定”，高手则用它拉长连击。",refs:[115]}
  ],
  cost:[
   ["认知负担","新手要同时盯当前弃牌、槽内牌和被重露的旧弃牌三处"],
   ["教学成本","需要专门引导与关卡铺垫，否则槽位被当成“撤回”或“抽牌”"],
   ["关卡设计","若多数关卡用不到第二基准，按钮只是装饰；若太依赖，又会抬高门槛"],
   ["难度体感","同事体验认为单局难度在四款中偏高（账号体感，非实测）"]
  ],
  verify:"在含两条有效路线的同一牌序下，比较“有槽/无槽”两组：玩家能否预测存牌后的基准、是否主动为后手留槽、连击长度与求助工具次数是否变化；若只是通关率上升而没人能说清为什么，应把它降级为救局工具而非策略机制。"
 },
 timeline:[
  ["早期","Hold Slot教学","把当前牌移入槽以清更多牌",115],
  ["Lv4","加牌特殊牌","清除后Stock +3（该账号观察）",115],
  ["Lv7","万能牌","可匹配任意点数",115],
  ["Lv9","奖励关卡","通关一次性发放大量金币",115],
  ["开局工具","Color Bomb / UFO","Color Bomb匹配后清全部明牌并推进Streak Meter；UFO处理难匹配牌与巧克力/甘草障碍",28],
  ["局内工具","Lollipop Hammer / Undo / Fish","Fish为通配：选定任意牌收走（不同于Disney Wild替换基准）",28]
 ],
 meta:[
  {t:"明信片（主线）",d:"通关获Energy→打开Postcard任务→消耗Energy装饰巴黎、纽约等旅行场景→完成一张明信片=一章，奖励金币、万能牌、拼图。Energy是场景任务资源，不是入场体力。",refs:[25,115]},
  {t:"相册（收集）",d:"关卡、活动或商店获得Card Packs→收集Cards与Sets→完成奖励。关内卡包需获胜后结算，见到不等于保留。",refs:[26]},
  {t:"周联赛（竞争）",d:"首页Weekly Leagues按星星排名——四款同事样本中唯一显式的竞争线，给“技巧拉开差距”一个公开展示位。",refs:[115]},
  {t:"牌面封面",d:"图鉴可更换牌背封面（Regular / Seasonal），把收集成果带回牌桌外观。",refs:[115]}
 ],
 economy:{
  sources:[["通关金币","每局结算"],["每4小时领取","该账号一次+3,000"],["Lv9奖励关","一次性大额"],["明信片完成","金币/万能牌/拼图"],["每日任务","周期入口"]],
  sinks:[["入场 / Lives","Coins页列用途"],["Undo","局内工具"],["万能牌 / Fish","跨关系救局"],["加牌","扩展供给"]],
  note:"同事体感：Candy领币频率最低（4小时），但大额补给密集，前5关连击易得，整体“无金币压力”；与Disney“每小时领币却持续紧张”对照，说明决定体感的不是领币频率，而是产出能否覆盖救局消耗。Bet Up（提高投入与奖励）仅部分玩家测试，不并入基础经济。",
  refs:[31,32,115]
 },
 senses:[
  {t:"美术",d:"明显的Candy Crush风格：糖果角色、高识别度包装；画面比Tiki/Harvest简洁、比Disney复杂一点。"},
  {t:"动效",d:"以星光与白色粒子为主，克制但清晰地确认“接上了”“得到了”。"},
  {t:"音效",d:"翻牌声偏写实；整体反馈通道不抢戏，把注意力留给槽位判断与排行榜名次。"},
  {t:"品牌/IP",d:"Candy Crush是全球知名三消品牌；但它能否跨玩法带来情感价值，现有材料无法证明。收入较低也不能单归因于Hold或品牌不适配。",refs:[8,16]}
 ],
 verdict:{
  good:["五款中唯一新增“可学的局内策略”：用一个按钮把规划显性化","Hold与周联赛互相成全：技巧差距有地方被看见","经济体感宽松，失败后更容易“再来一局”"],
  cost:["学习门槛与单局难度上升，可能劝退只想快速连消的玩家","视听与Meta相对克制，题材吸引力弱于Disney IP","9月MAU 84.4万、较2025-02窗口峰值240.5万明显回落（源值），机制吸引力能否支撑长线仍待观察"],
  open:["困难关是否以熟练用槽为前提？","满槽后能否交换/取回？官方未写，不补规则","广告频率与Lives入场的账号差异"]
 },
 refs:[25,26,27,28,29,31,32,115]
};
const plans={
 harvest:{media:[{src:"presentation/media/media7.mp4",poster:"presentation/media/poster-08-1.jpg",title:"农场→牌桌"},{src:"media/harvest-v11.mp4",poster:"media/harvest-v11.jpg",title:"移动牌关卡 · 补充V11"}],name:"Solitaire Grand Harvest",studio:"Supertreat / Playtika",dataId:"MS0624",ppt:8,role:"重点样本 · 局外Meta代表",thesis:"把“再打一关”接到“农场里又有东西熟了”：多容器局外、连击产金币与音阶反馈，把资源压力消化在循环里。",clips:["农场→牌桌（13秒）","补充：横排移动牌关卡（12秒）"],mods:["数据条：9月MAU 108.4万 / 下载25.1万 + 21个月走势","最突出：局外农场——种收、建造、宠物、相册多容器并行；Credits/Gems用途分账（2023 Grand Farm与2026 MyFarm分版本）","局内特殊牌时间线：老鼠/芝士Lv8、切片器Lv21、风车Lv30、顺序牌Lv32、野生掉落Lv41——规则写成农场“世界因果”","经济：连击产金币、骨头喂Sam换道具、Lucky Wheel；2023倍率/续购涨价作历史结构","视听：Zen风吉他+鸟鸣，点击音阶递进“1-2-3-4-5-6”，音效本身就是连击奖励","判断：美术相对简陋但节奏与反馈补足；Playtika社交博彩式经济的痕迹"]},
 disney:{media:[{src:"presentation/media/media9.mp4",poster:"presentation/media/poster-10-1.jpg",title:"场景复原与Memory Lane"},{src:"media/disney-v10.mp4",poster:"media/disney-v10.jpg",title:"局内连击与金币 · 补充V10"}],name:"Disney Solitaire",studio:"SuperPlay / Playtika",dataId:"MS0219",ppt:10,role:"重点样本 · IP与场景代表",thesis:"把每一次通关换成一颗星，再把星星换成一段可辨认的迪士尼电影场景：IP既是买量理由，也是长期目标的内容本身。",clips:["场景复原与Memory Lane（18秒）","补充：局内连击（11秒）","补充：Tinker Bell关卡与金币反馈（12秒）"],mods:["数据条：9月MAU 440.6万 / 下载77.7万；美区iOS免费榜连续103天Top10（观察窗）","最突出：IP×场景——Memory Lane按电影组织章节，单场景6步复原，一星一步","局内：Runner牌每步变点数（Lv45）、拼图卡服务活动（Lv21）、Wild替换基准、Restock五张","经济：前两章金币紧缺；Lv90后X1/X2/X4倍率——入场与奖励同升，一关仍只得一星","买量：IP角色直接作广告核心内容，真人出镜/实机二创/可玩广告并行","视听：3D欧美卡通、牌桌可读性最稳定；BGM与场景演出缓冲资源压力"]},
 tiki:{name:"Tiki Solitaire TriPeaks",studio:"Scopely（原GSN）",dataId:"MS1973",ppt:20,role:"补充样本 · 社交目标代表",thesis:"个人清牌积分自动进入俱乐部目标；Volcano的Tribute还会反过来改变“下一关去打哪一关”。",clips:["暂无录屏：建议补录Tribute关卡定位→清盘→贡献"],mods:["数据条：9月MAU 12.0万 / 下载4.6万","最突出：Club Points/Perks/Tributes把个人操作转为共同进度；Golden Tribute=5个普通Tribute","局内：Hold Card仅部分关卡/Perk、Double Stack双抽牌堆；绳索、鲨鱼吃小鱼等海岛障碍与专用道具","判星：GOAL/STREAK/SPEED三维三星可复刷；+30s等道具与判星咬合","经济：小玩法密集送资源（Poi's Treasure、Amazing Wheel、Jackpot）——“获得感机器”","视听：高饱和海岛风，第一眼偏乱但奖励动效从不缺席"]},
 fairway:{name:"Fairway Solitaire",studio:"Big Fish / BFG",dataId:"MS3075",ppt:21,role:"补充样本 · 成绩单位代表",thesis:"同样±1接牌，但按“一洞”结算、按“整场”评价：一洞没清完也能进下一洞，失败容忍度被重新组织。",clips:["暂无录屏：建议补录“开始一洞→用球杆→残牌结束→下一洞→整场成绩”"],mods:["数据条：9月MAU 2.1万 / 下载0.2万（规模小，但机制价值独立）","最突出：球洞par与整场成绩——2012评测与2026商店分版本呈现","局内：球杆作替代基准、rough/sand/rain hazards、shuffle/preview","局外：球场巡回、邮票收集、Country Club团队周目标","经济：Golf Bucks（2012）；现版“no lives or limits”不等于工具免费","证据密度提示：无同事实机，凡未核项写“待核”"]}
};
const newPlans={
 associations:{media:[{src:"presentation/media/media10.mp4",portrait:true,poster:"presentation/media/poster-12-1.jpg",title:"语义归类实录"}],name:"Solitaire Associations Journey",studio:"Hitapps",dataId:"MS0035",gp:"https://play.google.com/store/apps/details?id=com.hitappsgames.wordsolitaire&hl=en",clip:"（7.5秒，中文界面）",fusion:"Solitaire × Sort（语义归类）",obs:["录屏可见：顶部4个类别槽（如“鱼类3/8”“电器2/4”），下方4列含暗牌与词卡；左上“移动”从25递减到20","把“乾衣機”放入“电器”后计数3/4，下方露出带王冠的“地图”——它本身是新类别卡，需要先占一个类别槽才能开新组","“沙丁鱼”从翻牌堆直接归入“鱼类”（4/8）：翻牌堆既是供给也是选择"],mods:["数据条：9月MAU 1162.6万（样本第一）/ 下载373.8万；Sensor Tower美区WAU近400万旁证","合法动作对照：±1点数关系 → 语义从属关系（成员卡→类别）","决策拆解：知道答案≠拿得到牌；类别槽有限，先开哪一类？步数预算怎么花？","失败归因：词义/文化歧义 vs 路径阻塞 vs 步数耗尽，三种必须分开","同类产品：Word Solitaire: Categories、Picture Associations等","为什么能到千万级：零规则门槛（会认字就会玩）+ 题库内容可无限扩张（分析）"]},
 makeit10:{media:[{src:"presentation/media/media11.mp4",portrait:true,poster:"presentation/media/poster-12-2.jpg",title:"凑10实录"}],name:"Make It 10: Solitaire Puzzle",studio:"Unico Studio",dataId:null,gp:"https://play.google.com/store/apps/details?id=com.unicostudio.makeit10&hl=en",clip:"（6秒）",fusion:"Pyramid变种 × 暂存位",obs:["录屏可见：5列暗牌+底部明牌，Moves从32递减；下方3个暂存位与Stock（19张）","9+1、5+5两两凑10清除，清除后上方暗牌翻开（8♣、9♦等）","从Stock抽出的牌先落入暂存位（3、3、5），之后7与暂存位的3凑10清除——暂存位既是缓冲也是失败压力"],mods:["数据：当前快照未收录（不填0）","规则对照：经典Pyramid凑13、K单消 → 凑10、J/Q/K同类配对","决策拆解：同一张6可配两张4时，先消哪张决定揭开哪列；何时抽牌、暂存位留几格","与Solitaire 10 Match同类对照，不判谁先谁后","失败预算：Moves与暂存位双重上限"]},
 fusion:{media:[{src:"presentation/media/media12.mp4",portrait:true,poster:"presentation/media/poster-13-1.jpg",title:"同点连锁合成实录"}],name:"Solitaire Fusion: Match Story",studio:"Jollify Games",dataId:null,gp:"https://play.google.com/store/apps/details?id=com.JollifyGames.SolitaireFusion&hl=en",clip:"（8秒，竖屏）",fusion:"Solitaire × Merge（局内同点合成）",obs:["录屏可见：顶部TARGET“5×1、10×1”，中间一排7个槽位、两列递减牌串（4-3-2-A、9-8-7-6）","把一张A落到4-3-2-A列尾后，整列连锁坍缩成一张5并飞入目标位（+金币）——推断为“同点相合升一级、可沿递减串连锁”","随后9-8-7-6列与6相合，连锁成10，完成第二个目标；底部有UNDO、MAGIC CARD、+1 ADD SLOT道具"],mods:["数据：当前快照未收录","规则推断（基于8秒录屏，待更长录像确认）：同点两张合成高一级；预先搭好的递减串会被连锁吞并","决策拆解：搭串（Klondike式整理）是蓄力，落下关键牌是引爆——“整理”与“合成”是同一局的两段","融合强度：局内、双向（合成改变牌列与可用槽位）——四款中改动Solitaire本质最深","与Merge Kingdom对照：同叫Merge，一个在牌桌内、一个在局外"]},
 mergekingdom:{media:[{src:"presentation/media/media13.mp4",poster:"presentation/media/poster-13-2.jpg",title:"牌局→花园Merge-3"}],name:"Solitaire: Merge Kingdom",studio:"FUNJOY",dataId:null,gp:"https://play.google.com/store/apps/details?id=com.solitairemanor.secrets&hl=en",clip:"（15秒，横屏）",fusion:"TriPeaks主局 × 局外Merge-3",obs:["录屏可见：牌局结算宝箱 → 教学“Merge three items to obtain an upgraded one!” → 花园棋盘","花园里三个同级花卉合成高一级，右侧绿色按钮显示可用次数“4”","局内仍是±1，合成发生在牌局之外的另一块棋盘"],mods:["数据：当前快照未收录","两个循环：TriPeaks产出 → 合成材料/次数 → 花园装修；需核资源是否回流牌局","对照Grand Harvest：同样“局外有第二个可玩系统”，但这里的局外本身是成熟玩法（Merge-3）","风险：两套操作切换的割裂；Merge玩家与接龙玩家是否同一批人"]},
 others:{name:"其他新品与边界样本",studio:"多款",dataId:null,gp:"",clip:"无统一录屏",fusion:"名单页",obs:[],mods:["Word Solitaire: Categories（AZUR）· Solitaire Picture Associations（TheAppGuruz）· Solitaire 10 Match（Jinli）","Solitaire Out: Color Flow（NEPTUNE）· Solitaire Pop: Pair Match（Magic one）","Solitaire Clash（AviaGames，Klondike赛事）· Solitaire World Tour: Klondike（oneWheat，轻旅行）","Jigsolitaire（Gamincat）· Picture Blast Solitaire（Gismart）——图像拼合边界","Solitaire TriPeaks Journey（Ghost Studio，Merge Events活动对照）","每款：开发商、Google Play链接、改了哪一层（局内/局间/赛事）、一句玩法拆解、数据快照是否收录"]}
};
const ideaPlans={
 conveyor:{name:"机会A · 循环传送带 × ±1 归堆",src:"优先验证",mods:[]},
 treasure:{name:"机会B · 取宝物即过关",src:"换过关目标",mods:[]},
 more:{name:"机会C · 其他候选思路",src:"候补思路",mods:[]}
};
/* ---------- 渲染：产品页 ---------- */
function holdBlock(api){const h=candy.hold;return `<div class="hold-deep"><div class="hold-demo-wrap"><div class="hold-demo-card" id="holdDemo">${api.holdHTML()}</div><p class="hold-demo-note">构造规则示意，非实录：演示“初始4时3、5都合法 → 接3后5不合法 → 存3重露4 → 5恢复合法”。</p></div><div class="why-list">${h.why.map(w=>`<article>${kind(w.k)}<h4>${esc(w.t)}</h4><p>${esc(w.d)}${ref(w.refs)}</p></article>`).join("")}</div></div>
 <div class="cost-grid">${h.cost.map(([t,d])=>`<div><b>${esc(t)}</b><span>${esc(d)}</span></div>`).join("")}</div>
 <div class="verify-box">${kind("hyp")}<b>怎样验证它真的“更有策略”</b><p>${esc(h.verify)}</p></div>
 <details class="visual-deep"><summary>与Tiki Hold、Disney Wild、Fish的区别 <span>展开 ＋</span></summary><table class="mini-table"><thead><tr><th>机制</th><th>动作</th><th>改变了什么</th></tr></thead><tbody><tr><td>Candy Hold Slot</td><td>弃牌顶入空槽，旧弃牌重露</td><td>同时存在两个可匹配基准${ref([27])}</td></tr><tr><td>Tiki Hold Card</td><td>保存一张牌、替换当前牌、需要时换回；仅部分关卡/Perk</td><td>保存与交换，不重露旧弃牌${ref([34])}</td></tr><tr><td>Disney Wild</td><td>替换当前基准，可接任意牌</td><td>一次跨关系匹配，不保留旧牌${ref([22])}</td></tr><tr><td>Candy Fish</td><td>选定任意牌收走</td><td>直接清除目标牌，不改变基准规则${ref([28])}</td></tr></tbody></table></details>`;}
function gamePage(id,api){
 if(id!=="candy")return planPage("game",id);
 const g=candy,toc=[["g-top","一句话看懂"],["g-clips","实机录屏"],["g-loop","一局与下一局"],["g-hold","深拆：Hold Slot"],["g-level","关卡节奏与道具"],["g-meta","局外Meta"],["g-eco","经济与节奏"],["g-sense","美术·动效·音效·品牌"],["g-verdict","分析师判断"]];
 return `<div class="classic-breadcrumb"><a href="#products">产品拆解</a><span>/</span>${esc(g.name)}</div>
 <header class="game-hero" id="g-top"><div class="gh-copy"><div class="gh-tags">${tag(g.role,"role")}${tag(g.studio)}${tag(g.launch)}</div><h1>${esc(g.name)}</h1><p class="gh-thesis">${esc(g.thesis)}</p><div class="gh-switch">${gameSwitch(id)}</div></div><div class="gh-data">${G.productStrip(g.dataId)}</div></header>
 ${sectionNav(toc)}
 <div class="highlight-row">${g.highlights.map((h,i)=>`<article class="${i===0?"main":""}"><span class="overline">${esc(h.k)}</span><h3>${esc(h.t)}</h3><p>${esc(h.d)}${ref(h.refs)}</p></article>`).join("")}</div>
 ${sec("g-clips","01","RECORDING / 先看再读","两段实录：Hold在真实牌局里怎么出现","录屏只证明画面中可见的动作；时间点标注是阅读提示，不是完整规则。",`<div class="clip-grid n2">${g.clips.map(clip).join("")}</div>`)}
 ${sec("g-loop","02","CORE LOOP","一局与下一局：资源往哪里流","局内只多了一个槽；局外是“明信片 + 相册 + 周联赛”三条线并行。",flowLoop(g.loop))}
 ${sec("g-hold","03","DEEP DIVE / 最有特点的设计","Hold Slot：一格暂存，为什么能改变策略深度","先动手看规则，再看它新增了什么选择、付出了什么代价、怎样证伪。",holdBlock(api))}
 ${sec("g-level","04","LEVEL PACING","关卡节奏、特殊牌与道具","道具按“改变可达性 / 修改接牌关系 / 撤回错误”三种作用分组，而不是都算“买步数”。",`<div class="timeline">${g.timeline.map(([lv,t,d,r])=>`<div class="tl-item"><span class="tl-lv">${esc(lv)}</span><div><b>${esc(t)}</b><p>${esc(d)}${ref([r])}</p></div></div>`).join("")}</div><p class="sec-foot">${kind("obs")} Lv节点来自同事2026-08-31单一账号体验，不代表所有版本与账号。</p>`)}
 ${sec("g-meta","05","META","局外：收集与竞争双主线","四款同事样本里，只有Candy在收集之外显式加入了“和别人比”。",`<div class="meta-grid">${g.meta.map(m=>`<article><h4>${esc(m.t)}</h4><p>${esc(m.d)}${ref(m.refs)}</p></article>`).join("")}</div>`)}
 ${sec("g-eco","06","ECONOMY","经济与节奏：产出能否覆盖救局","",`<div class="eco"><div class="eco-col"><h4>金币产出</h4>${g.economy.sources.map(([a,b])=>`<div class="eco-item gain"><b>${esc(a)}</b><span>${esc(b)}</span></div>`).join("")}</div><div class="eco-pool"><b>金币池</b><span>Coins</span></div><div class="eco-col"><h4>金币消耗</h4>${g.economy.sinks.map(([a,b])=>`<div class="eco-item cost"><b>${esc(a)}</b><span>${esc(b)}</span></div>`).join("")}</div></div><p class="eco-note">${kind("ana")} ${esc(g.economy.note)}${ref(g.economy.refs)}</p>`)}
 ${sec("g-sense","07","ART · MOTION · SOUND · BRAND","美术、动效、音效与品牌","",`<div class="sense-grid">${g.senses.map(s=>`<article><h4>${esc(s.t)}</h4><p>${esc(s.d)}${ref(s.refs||[115])}</p></article>`).join("")}</div>`)}
 ${sec("g-verdict","08","ANALYST VERDICT","分析师判断：优势、代价与待验证","这是基于规则、录屏与同事体验的分析，不是留存或收入因果结论。",`<div class="verdict"><div class="v-good"><h4>做得好的</h4><ul>${g.verdict.good.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div><div class="v-cost"><h4>代价与风险</h4><ul>${g.verdict.cost.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div><div class="v-open"><h4>仍待验证</h4><ul>${g.verdict.open.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div></div><div class="ref-row"><span>本页来源</span>${g.refs.map(n=>`<button class="ref-button" data-source="${n}">[${n}]</button>`).join("")}</div>`)}
 <div class="chapter-end"><div><strong>下一款：Disney Solitaire</strong><p>同样±1，Disney把成果做成可辨认的电影场景。</p></div><a class="btn secondary small" href="#game/disney">继续 →</a></div>`;
}
const GAME_ORDER=[["harvest","Grand Harvest"],["candy","Candy"],["disney","Disney"],["tiki","Tiki"],["fairway","Fairway"]];
function gameSwitch(id){return GAME_ORDER.map(([k,n])=>`<a class="${k===id?"active":""}" href="#game/${k}">${n}${["tiki","fairway"].includes(k)?"<small>补充</small>":""}</a>`).join("");}
/* ---------- 规划页（待确认后填充） ---------- */
function planPage(type,id){
 const P=type==="game"?plans[id]:type==="new"?newPlans[id]:ideaPlans[id];
 if(!P)return `<p>未找到页面。<a href="#overview">返回概览</a></p>`;
 const back=type==="game"?["#products","产品拆解"]:type==="new"?["#changes","新品变化"]:["#opportunities","机会检验"];
 const strip=type!=="idea"&&P.dataId!==undefined?(P.dataId?G.productStrip(P.dataId):`<div class="data-strip missing"><b>当前数据快照未收录该产品</b><span>不填0、不用同名产品代填；如需数据，需补导出。</span></div>`):"";
 return `<div class="classic-breadcrumb"><a href="${back[0]}">${back[1]}</a><span>/</span>${esc(P.name)}</div>
 <div class="plan-banner"><b>页面规划预览</b><span>本页结构与要点已定稿为提纲，待你确认整体版式（参照已完成的Candy页）后填充完整分析。</span>${type==="game"?'<a class="text-button" href="#game/candy">看已完成样板：Candy →</a>':""}</div>
 <header class="game-hero plan"><div class="gh-copy"><div class="gh-tags">${P.role?tag(P.role,"role"):""}${P.studio?tag(P.studio):""}${P.fusion?tag(P.fusion,"role"):""}${P.src?tag(P.src):""}</div><h1>${esc(P.name)}</h1>${P.thesis?`<p class="gh-thesis">${esc(P.thesis)}</p>`:""}${type==="game"?`<div class="gh-switch">${gameSwitch(id)}</div>`:""}${P.gp?`<a class="text-button" href="${P.gp}" target="_blank" rel="noopener noreferrer">Google Play ↗</a>`:""}</div><div class="gh-data">${strip}</div></header>
 ${P.media?`<div class="clip-grid n${Math.min(2,P.media.length)}" style="margin-top:14px">${P.media.map(clip).join("")}</div>`:""}
 ${P.clips||P.clip?`<div class="plan-block"><h3>录屏素材</h3><ul>${(P.clips||[P.clip]).map(c=>`<li>${esc(c)}</li>`).join("")}</ul></div>`:""}
 ${P.obs?.length?`<div class="plan-block obs"><h3>${kind("obs")} 我对录屏的逐帧观察（已核）</h3><ol>${P.obs.map(o=>`<li>${esc(o)}</li>`).join("")}</ol></div>`:""}
 <div class="plan-block"><h3>计划模块</h3><ol>${P.mods.map(m=>`<li>${esc(m)}</li>`).join("")}</ol></div>`;
}
/* ---------- 章节入口卡（插在各章顶部） ---------- */
function chapterCards(route){
 if(route==="products")return `<div class="sub-cards">${GAME_ORDER.map(([k,n])=>{const d=k==="candy"?candy:plans[k],p=D.products.find(x=>x.id===d.dataId),x=p?G.point(p,"2026-09"):{};return `<a class="sub-card ${k==="candy"?"done":""}" href="#game/${k}"><span class="sc-state">${k==="candy"?"已完成样板":"规划中"}</span><b>${esc(d.name)}</b><small>${esc(d.role)}</small><span class="sc-kpi">MAU ${G.wan(x.mau)} · 下载 ${G.wan(x.downloads)}</span></a>`;}).join("")}</div>`;
 if(route==="changes")return `<div class="sub-cards">${Object.entries(newPlans).map(([k,d])=>`<a class="sub-card" href="#new/${k}"><span class="sc-state">玩法拆解</span><b>${esc(d.name)}</b><small>${esc(d.fusion)}</small><span class="sc-kpi">${esc(d.studio)}</span></a>`).join("")}</div>`;
 if(route==="opportunities")return `<div class="sub-cards">${Object.entries(ideaPlans).map(([k,d])=>`<a class="sub-card" href="#idea/${k}"><span class="sc-state">规则+示意</span><b>${esc(d.name)}</b><small>${esc(d.src)}</small></a>`).join("")}</div>`;
 return "";
}
/* ---------- 专题概览 ---------- */
function overview(api){
 const disc=D.products.filter(p=>p.memberships.includes("discovery167"));
 const pick=id=>D.products.find(p=>p.id===id),sep=(id,m)=>G.point(pick(id),"2026-09")[m];
 const story=[
  {no:"01",route:"rules",q:"Solitaire是什么？",a:"一个规则家族，不是一种算法。四款经典在“整理”，移动端主流TriPeaks在“接走”。",subs:[["#classic/tripeaks","TriPeaks"],["#classic/klondike","Klondike"],["#classic/freecell","FreeCell"],["#classic/spider","Spider"],["#classic/pyramid","Pyramid"],["#glossary","术语"]]},
  {no:"02",route:"products",q:"同样±1，产品为什么不同？",a:"共享“接牌+撤回+万能牌+加牌”骨架；差异在局内机制、局外Meta与IP包装。",subs:GAME_ORDER.map(([k,n])=>["#game/"+k,n])},
  {no:"03",route:"changes",q:"除了TriPeaks还有什么？",a:"语义归类、凑10、局内合成、局外Merge——变化发生在不同层级。",subs:[["#new/associations","Associations"],["#new/makeit10","Make It 10"],["#new/fusion","Fusion"],["#new/mergekingdom","Merge Kingdom"],["#new/others","其他新品"]]},
  {no:"04",route:"opportunities",q:"还能怎么创新？",a:"保留简单操作，只改一处：换过关目标，或接入动态Sort。",subs:[["#idea/conveyor","传送带×±1"],["#idea/treasure","取宝物过关"],["#idea/more","其他思路"]]}
 ];
 return `<section class="ov-hero"><div class="ov-copy"><span class="overline">CASUAL GAME RESEARCH · 第01期</span><h1>Solitaire</h1><h2>一套老纸牌规则，<br>怎样长成今天的移动产品？</h2><p>沿四个问题读完一条故事线；任何时候都能跳去数据看板、单款产品或来源查证。</p><div class="hero-actions"><a class="btn" href="#rules">从第一章开始 →</a><a class="btn secondary" href="#market">数据看板</a></div></div>
 <div class="ov-kpis"><div><small>9月扩展发现集</small><b>167</b><em>条记录 · 非独立App数</em></div><div><small>样本MAU第一 · 语义归类</small><b>${G.wan(sep("MS0035","mau"))}</b><em>Solitaire Associations Journey</em></div><div><small>±1头部 · Disney</small><b>${G.wan(sep("MS0219","mau"))}</b><em>9月MAU源值</em></div><div><small>研究深拆</small><b>5 + 4</b><em>款±1产品 + 款新品</em></div></div></section>
 <section class="section"><div class="section-heading"><div><span class="label">STORYLINE</span><h2>四个问题，一条故事线</h2><p>每章先给结论，再进入分页细读。</p></div></div>
 <div class="story">${story.map(s=>`<article class="story-step"><a class="ss-main" href="#${s.route}"><span class="ss-no">${s.no}</span><span class="ss-q">${esc(s.q)}</span><span class="ss-a">${esc(s.a)}</span></a><div class="ss-subs">${s.subs.map(([h,t])=>`<a href="${h}">${esc(t)}</a>`).join("")}</div></article>`).join('<span class="story-arrow" aria-hidden="true">→</span>')}</div></section>
 <section class="section"><div class="section-heading"><div><span class="label">MARKET SNAPSHOT</span><h2>规模速览：月活与下载</h2><p>9月扩展发现集源值；完整走势、分组结构与下钻在数据看板。</p></div><a class="text-button" href="#market">打开数据看板 →</a></div>
 <div class="ov-market"><div id="leaders" class="leader-layout">${api.leaderHTML()}</div><div class="ov-trend"><h3>研究样本 MAU 走势</h3>${G.lines(["MS0035","MS0219","MS0624","MS0675"].map((id,i)=>({p:pick(id),name:pick(id).name.replace("Solitaire ","").replace(" Solitaire",""),color:["#e7b46a","#a99bff","#6fd0b6","#e58aa8"][i]})),{metric:"mau",W:520,H:220})}</div></div></section>
 <section class="section"><div class="section-heading"><div><span class="label">HOW TO USE</span><h2>三种用法</h2></div></div><div class="task-entry"><a href="#rules"><span>01</span><div><b>系统学习</b><small>按四章顺序，从规则读到机会</small></div><i>→</i></a><a href="#market"><span>02</span><div><b>快速查取</b><small>数据看板、单款产品、术语、来源</small></div><i>→</i></a><a href="#glossary"><span>03</span><div><b>术语速查</b><small>18 个术语，中英可搜</small></div><i>→</i></a></div></section>
 <details class="preview-note"><summary>本版（v4）改动与边界</summary><p>v4：新增TriPeaks规则页与五种规则实录、数据看板；五款产品按同一模板深拆（Tiki用同事截图，Fairway无实机素材已标注）；四款新品逐款玩法拆解与名单页；机会检验按传送带→取宝物→其他排序，附规则说明书与分步示意。数据为Mobile Source导出源值（平台覆盖与完整月待确认）。</p></details>`;
}
return {overview,gamePage,planPage,chapterCards,candy,plans,newPlans,ideaPlans,GAME_ORDER};
})();
