"use strict";
/* v4 产品深拆：四款按Candy同一模板填充。事实/观察/判断分离；无同事实机处标待核。 */
window.RESEARCH_GAME_PAGES=(()=>{
const D=window.RESEARCH_DATA,G=window.RESEARCH_DASH;
const esc=s=>String(s??"").replace(/[&<>"']/g,x=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[x]));
const KIND={fact:["官方/来源","fact"],obs:["录屏/截图观察","obs"],ana:["分析判断","ana"],hyp:["待验证假设","hyp"]};
const tag=(t,c="")=>`<span class="dtag ${c}">${esc(t)}</span>`;
const kind=k=>tag(KIND[k][0],KIND[k][1]);
const media=f=>(window.RESEARCH_MEDIA_BASE||"")+f;
const ref=ids=>ids?.length?`<span class="ref-inline">${ids.map(n=>`<button class="ref-button" data-source="${n}">[${n}]</button>`).join("")}</span>`:"";
const clip=c=>`<figure class="clip"><div class="clip-frame ${c.portrait?"portrait":""}"><video controls preload="none" playsinline poster="${media(c.poster)}" aria-label="${esc(c.title)}"><source src="${media(c.src)}" type="video/mp4"></video></div><figcaption><b>${esc(c.title)}</b>${c.note?`<span>${esc(c.note)}</span>`:""}${c.marks?`<ol class="clip-marks">${c.marks.map(([t,x])=>`<li><time>${esc(t)}</time>${esc(x)}</li>`).join("")}</ol>`:""}</figcaption></figure>`;
const shot=s=>`<figure class="clip shot"><div class="clip-frame"><img src="${media(s.src)}" alt="${esc(s.title)}" loading="lazy"></div><figcaption><b>${esc(s.title)}</b>${s.note?`<span>${esc(s.note)}</span>`:""}</figcaption></figure>`;
const flowLoop=(nodes,back)=>`<div class="loop">${nodes.map((n,i)=>`<div class="loop-node ${n.k||""}"><small>${String(i+1).padStart(2,"0")} · ${esc(n.zone)}</small><b>${esc(n.t)}</b><span>${esc(n.d)}</span></div>`).join('<span class="loop-arrow" aria-hidden="true">→</span>')}<div class="loop-back"><span>↺ ${esc(back)}</span></div></div>`;
const sec=(id,no,kicker,title,lead,body)=>`<section class="deep-sec" id="${id}"><header class="deep-head"><span class="deep-no">${no}</span><div><span class="overline">${esc(kicker)}</span><h2>${title}</h2>${lead?`<p>${lead}</p>`:""}</div></header>${body}</section>`;
const toc=list=>`<nav class="page-toc" aria-label="本页目录">${list.map(([id,t],i)=>`<a href="#" data-scroll="${id}"><span>${String(i+1).padStart(2,"0")}</span>${esc(t)}</a>`).join("")}</nav>`;

/* ========== 1 · Grand Harvest ========== */
const harvest={
 id:"harvest",name:"Solitaire Grand Harvest",studio:"Supertreat / Playtika",launch:"2017 上线 · Playtika 发行",dataId:"MS0624",role:"重点样本 · 局外Meta代表",
 thesis:"把“再打一关”接到“农场里又有东西熟了”：多容器局外、连击产金币与音阶反馈，把资源压力消化在循环里，而不是压在单局难度上。",
 highlights:[
  {k:"主看点",t:"农场不是奖励页，是第二个循环",d:"种收、建造、宠物、相册四条线并行；牌桌产出直接变成农场动作，农场又反过来给牌桌道具。"},
  {k:"局内",t:"特殊牌写成“世界因果”",d:"老鼠偷芝士、切片器、风车、顺序牌——机制不是抽象图标，而是农场里说得通的事件。"},
  {k:"表现",t:"音阶即连击计数器",d:"点击音效逐级升高（1-2-3-4-5-6），玩家不用看UI就知道自己连到第几张。"}
 ],
 clips:[
  {src:"presentation/media/media7.mp4",poster:"presentation/media/poster-08-1.jpg",title:"农场→牌桌 · 13秒",note:"看进入关卡时的镜头推进：从农场地图直接切到牌桌，中间没有独立大厅。"},
  {src:"media/harvest-v11.mp4",poster:"media/harvest-v11.jpg",title:"横排移动牌关卡 · 补充 · 12秒",note:"同一款产品里另一种牌阵：不是金字塔，而是可左右移动的横排序列。",marks:[["0–4s","牌阵为多层横排，牌只向左右两侧移动"],["4–8s","接牌后整排补位，露出下层新牌"],["8–12s","连击音阶随接牌升高"]]},
  {src:"media/harvest-mouse.mp4",poster:"media/harvest-mouse.jpg",title:"老鼠牌与芝士牌 · 本轮补充 · 12秒",note:"牌阵两侧的木洞里蹲着老鼠，中间可见芝士色目标牌——老鼠是“占位障碍”，不是可接牌。",marks:[["0–3s","金字塔牌阵：两侧砖洞里各有一只老鼠，中间A/K可接牌"],["3–8s","接走可接牌后老鼠位置不变，仍占住该格；被压住的牌不翻开"],["8–12s","老鼠所在格只能靠特定道具或关卡规则处理（待更完整录像确认）"]]},
  {src:"media/harvest-wild.mp4",poster:"media/harvest-wild.jpg",title:"风车/万能牌入口 · 本轮补充 · 12秒",note:"右下角“WILD”按钮是本局可用的万能牌入口，与Lv30解锁的风车道具同名不同物——两者要分开记。",marks:[["0–4s","牌桌右下出现金框WILD按钮，旁边标价，表示可用次数/消耗"],["4–8s","牌阵中K、Q、J、5、4横向排开，可接范围被压缩"],["8–12s","点击WILD后进入选牌状态（录屏到此，后续未录）"]]},
  {src:"media/harvest-farm.mp4",poster:"media/harvest-farm.jpg",title:"局外农场地图 · 本轮补充 · 12秒",note:"农场主界面：地块、作物成熟标记、建筑与底部功能入口并列——同一屏里同时存在多种“可做的事”。",marks:[["0–4s","全景农场：地块成熟度用图标标记，红色谷仓为建造入口"],["4–8s","地图可拖动，路边散落可收集物"],["8–12s","底部导航：任务、商店、相册、活动并列"]]}
 ],
 loop:[
  {zone:"入场",t:"Credits 入场",d:"每局消耗金币；不足时用Gems或等待补给"},
  {zone:"局内",t:"±1接牌 + 特殊牌",d:"老鼠/芝士、切片器、风车、顺序牌"},
  {zone:"卡局",t:"道具救局",d:"万能牌WILD、加牌、洗牌"},
  {zone:"结算",t:"金币 + 星星 + 骨头",d:"连击长度直接决定金币量",k:"gain"},
  {zone:"局外",t:"农场四容器",d:"种收 / 建造 / 宠物Sam / 相册"},
  {zone:"回流",t:"农场产出道具",d:"作物与建造给下一局的道具与Buff",k:"gain"}
 ],
 mech:[
  {k:"fact",t:"特殊牌按等级逐个解锁，且都长在农场的世界观里",d:"Lv8老鼠/芝士、Lv21切片器、Lv30风车、Lv32顺序牌、Lv41野生掉落（同事单账号2026-08-31体验）。",refs:[115]},
  {k:"obs",t:"本轮补充录屏：老鼠是占位，不是可接牌",d:"牌阵两侧砖洞里的老鼠始终占住所在格，接牌不会让它消失；被它压住的牌不翻开。这一点与“老鼠偷芝士”的官方叙事要分开看：叙事解释来源，规则只表现为占位。",refs:[]},
  {k:"ana",t:"为什么这套特殊牌比抽象图标更耐读",d:"玩家不需要记“这是障碍牌”，只需要理解“农场里有老鼠，它占着那块地”。规则与题材同构，教学成本被叙事承担了。",refs:[]},
  {k:"ana",t:"代价：机制数量堆叠，单局可读性下降",d:"到Lv41时一局里可能同时出现4种以上特殊牌加道具栏；对老玩家是内容量，对新玩家是识别负担。",refs:[]}
 ],
 cost:[
  ["识别负担","同屏特殊牌与道具过多，新手难以判断哪张能接"],
  ["数值依赖","连击产金币意味着高手与新手收益差距被放大"],
  ["版本漂移","2023 Grand Farm 与 2026 MyFarm 的建造结构不同，旧截图不能直接当现状"],
  ["证据边界","老鼠/风车的完整规则需更长录像，本轮只到“可见动作”"]
 ],
 verify:"用同一牌序做两组：A组有老鼠占位、B组同位置为空。看玩家是否在3秒内意识到“这张接不了”、是否误点、以及误点后的道具使用率；若误点率高于10%，说明占位表达不够（视觉需强化，而非加教学弹窗）。",
 timeline:[
  ["Lv8","老鼠 / 芝士","老鼠占位、芝士作为目标物，二者共同构成“农场事件”","115"],
  ["Lv21","卡牌切片器","把一张牌切成两张可接牌，改变供给而非基准","115"],
  ["Lv30","风车道具","官方叙事为风吹散牌列；与右下WILD按钮不是同一物","115"],
  ["Lv32","顺序牌","按固定顺序接牌，把自由选择变成路径题","115"],
  ["Lv41","野生掉落","接牌后随机掉落额外资源，拉长连击收益","115"]
 ],
 meta:[
  {t:"种植与收获（主线）",d:"地块按真实时间成熟，收获产出金币与道具；成熟即提醒，是最主要的回访钩子。",refs:[115]},
  {t:"建造",d:"谷仓、栅栏、装饰按材料逐级建造；2023为Grand Farm结构，2026界面为MyFarm，二者不可混用。"},
  {t:"宠物Sam",d:"用骨头喂养换道具，把局内连击产物（骨头）转成局外关系资产。",refs:[115]},
  {t:"相册与章节",d:"收集卡面推进相册，与关卡章节并行，给“收集”一条独立于农场的线。"}
 ],
 eco:{sources:[["连击金币","连击越长单局产出越高"],["地块收获","按时间成熟，回访即领"],["Lucky Wheel","周期抽奖"],["相册完成","成套奖励"]],sinks:[["Credits入场","每局固定消耗"],["道具购买","WILD/加牌/洗牌"],["农场建造","材料与金币双消耗"],["宠物喂养","骨头换道具"]],note:"与Candy“领币频率低但大额补给密”相反，Harvest把产出绑在连击上：打得好才有钱，打不好要靠等待。这让“技术”直接等于“经济效率”，也把失败的成本推给了时间。",refs:[31,115]},
 senses:[{t:"美术",d:"低饱和农场插画，牌面与背景对比度一般；优点是世界观统一，缺点是牌的可读性不如Disney。"},{t:"动效",d:"收获、建造、连击各有独立动效，密度高但时长控制得住。"},{t:"音效",d:"Zen风吉他+鸟鸣；点击音阶1-2-3-4-5-6递进，音效本身就是连击计数器。"},{t:"品牌/IP",d:"无外部IP，靠“农场”这一通用题材自建世界观；买量素材以农场画面为主，牌桌为辅。"}],
 verdict:{good:["局外不是奖励页而是第二个循环，回访理由与牌桌解耦","特殊牌与题材同构，教学成本被叙事吸收","音阶反馈把“连击”变成可听的进度，几乎零学习成本"],cost:["机制堆到Lv41后单局识别负担明显","经济把收益绑在连击上，新手挫败成本高","美术相对简陋，靠节奏补足；Playtika社交博彩式经济的痕迹明显"],open:["老鼠是否只能被特定道具清除？本轮录屏未覆盖","风车道具与WILD按钮的消耗是否共用同一资源","2026 MyFarm与2023 Grand Farm的建造资源是否可换算"]},
 refs:[31,115]
};

/* ========== 2 · Disney ========== */
const disney={
 id:"disney",name:"Disney Solitaire",studio:"SuperPlay / Playtika",launch:"2023 上线 · Playtika 发行",dataId:"MS0219",role:"重点样本 · IP与场景代表",
 thesis:"把每一次通关换成一颗星，再把星星换成一段可辨认的迪士尼电影场景：IP既是买量理由，也是长期目标的内容本身。",
 highlights:[
  {k:"主看点",t:"场景复原：一星一步，六步一景",d:"Memory Lane按电影组织章节，单场景6步复原，每步只吃一颗星——进度条短、反馈密。"},
  {k:"局内",t:"Wild替换基准，Restock五张",d:"Wild不是万能牌堆，而是把当前基准换成任意点数；Restock一次补五张，改变供给节奏。"},
  {k:"经济",t:"倍率与入场同升",d:"Lv90后X1/X2/X4：投入与奖励一起放大，但一关仍只得一星——用风险换速度，不换进度。"}
 ],
 clips:[
  {src:"presentation/media/media9.mp4",poster:"presentation/media/poster-10-1.jpg",title:"场景复原与Memory Lane · 18秒",note:"看星星如何从牌桌飞进场景：一次只推进一格。"},
  {src:"media/disney-v09.mp4",poster:"media/disney-v09.jpg",title:"局内连击 · 补充 · 11秒",note:"连击条与金币结算的关系。"},
  {src:"media/disney-v10.mp4",poster:"media/disney-v10.jpg",title:"Tinker Bell关卡与金币反馈 · 补充 · 12秒",note:"IP角色出现在牌桌侧，承担提示与情绪反馈，不改变规则。"}
 ],
 loop:[
  {zone:"入场",t:"Coins / Lives",d:"每小时领币，但仍持续紧张"},
  {zone:"局内",t:"±1 + Wild + Restock",d:"Runner牌每步变点数（Lv45）"},
  {zone:"卡局",t:"道具救局",d:"Undo、加牌、Wild"},
  {zone:"结算",t:"星星（1星/关）",d:"通关只给一颗，与表现无关",k:"gain"},
  {zone:"局外",t:"Memory Lane",d:"6步复原一个电影场景"},
  {zone:"回流",t:"场景解锁",d:"新场景=新章节入口与买量素材",k:"gain"}
 ],
 mech:[
  {k:"fact",t:"一关一星，星星只兑换“步数”",d:"单场景6步复原，每步消耗一颗星；星星数量=可推进的场景格数。",refs:[22]},
  {k:"obs",t:"场景不是背景，是奖励本体",d:"录屏中复原动作有独立演出：角色入场、道具归位、镜头拉近，长度明显长于普通结算。"},
  {k:"ana",t:"为什么“一星一步”比“三星评价”更适合IP产品",d:"三星评价服务的是技巧比较，一星一步服务的是内容消费。Disney要的是“我想看下一个场景”，而不是“我想打满三星”。",refs:[]},
  {k:"ana",t:"风险：内容生产速度成为天花板",d:"每个场景都要美术与演出，产能决定长线；一旦场景更新慢于玩家推进速度，IP就会从动力变成“已看完”。"}
 ],
 cost:[["内容成本","每个场景都要独立美术与演出，产能是硬约束"],["难度体感","前两章金币紧缺，Lv90后倍率又把波动放大"],["IP依赖","没有IP的场景线难以复用；换皮等于重建内容"],["可读性","3D演出与牌桌同屏，注意力被分走"]],
 verify:"同一批新玩家，A组看场景演出、B组跳过演出。比较7日内场景推进步数与次日回访：若跳过组推进更快但回访更低，说明场景确实是回访理由而非装饰；若两组无差异，则场景只是结算动画。",
 timeline:[
  ["Lv21","拼图卡","服务活动的收集卡，不改变±1规则","115"],
  ["Lv45","Runner牌","每步自动变点数，逼玩家重新计算可接范围","115"],
  ["Lv90+","X1/X2/X4倍率","入场与奖励同升，一关仍只一星","115"],
  ["常驻","Wild","替换当前基准，可接任意牌","22"],
  ["常驻","Restock","一次补五张，改变供给而非基准","22"]
 ],
 meta:[
  {t:"Memory Lane（主线）",d:"按电影组织章节，一星一步复原场景；完成一段解锁下一段。",refs:[22]},
  {t:"活动与拼图",d:"拼图卡按活动发放，给周期目标一条独立线。"},
  {t:"每日签到与社交引导",d:"签到给资源，社交引导拉好友；两者都是回访钩子而非玩法。"}
 ],
 eco:{sources:[["每小时领币","周期补给，额度有限"],["通关金币","按剩余牌与连击结算"],["活动奖励","拼图与限时任务"],["倍率局","X2/X4投入更高、回报更高"]],sinks:[["入场/Lives","每局消耗"],["道具","Undo、加牌、Wild"],["倍率局入场","主动加注"],["场景加速","用资源换推进"]],note:"Disney是“每小时都能领，但仍然紧”的典型：领币频率高，救局单价也高。对照Candy“4小时领一次却不缺”，说明体感由产出/消耗比决定，不由频率决定。",refs:[31,32]},
 senses:[{t:"美术",d:"3D欧美卡通，牌桌与场景共用一套光；五款中牌面可读性最稳定。"},{t:"动效",d:"场景复原是主演出，长度可控；牌桌动效相对克制，避免与演出抢注意力。"},{t:"音效",d:"电影配乐切片，情绪引导强；连击音效不如Harvest的递进清晰。"},{t:"品牌/IP",d:"IP直接作买量核心：真人出镜、实机二创、可玩广告并行；IP也是内容本体。"}],
 verdict:{good:["把“通关”换成“看下一段故事”，目标与内容合一","一星一步，进度条短、反馈密，适合碎片时间","牌桌可读性最稳，3D演出不干扰判断"],cost:["内容产能决定天花板，场景更新一旦变慢就失去动力","前两章金币紧张，新手容易在理解规则前先感到缺钱","9月MAU 440.6万但仍依赖持续买量维持曝光"],open:["场景复原的6步是否随章节变化？","X倍率局是否影响星星产出？","IP授权期限对长线内容规划的影响"]},
 refs:[22,31,32,115]
};

/* ========== 3 · Tiki ========== */
const tiki={
 id:"tiki",name:"Tiki Solitaire TriPeaks",studio:"Scopely（原GSN）",launch:"2011 上线 · Scopely 发行",dataId:"MS1973",role:"补充样本 · 社交目标代表",shotMode:true,
 thesis:"个人清牌积分自动进入俱乐部目标；Volcano的Tribute还会反过来改变“下一关去打哪一关”——社交不是聊天，而是目标结构。",
 highlights:[
  {k:"主看点",t:"俱乐部目标：个人操作变成共同进度",d:"清牌得分计入Club Points，Perks按俱乐部等级发放；Golden Tribute=5个普通Tribute。"},
  {k:"局内",t:"Hold Card只在部分关卡",d:"保存一张牌、替换当前牌、需要时换回；不是全局机制，而是关卡/Perk授权。"},
  {k:"判星",t:"GOAL/STREAK/SPEED 三维三星",d:"三星可复刷，+30s等道具与判星咬合——时间既是压力也是可购买资源。"}
 ],
 shotMode:true,
 shots:[
  {src:"media/shots/tiki-第10关绳索牌.jpg",title:"第10关 · 绳索牌","note":"绳索把相邻牌绑在一起：接走一张，另一张才解开。占位与解锁的组合，比单纯叠层更“看得见”。"},
  {src:"media/shots/tiki-第19关大鱼吃小鱼牌.jpg",title:"第19关 · 大鱼吃小鱼","note":"鱼牌按大小互相吞食，小型鱼被吞后该格失效；同样是“占位”，但因果比老鼠更直观。"},
  {src:"media/shots/tiki-第1关连击奖励.jpg",title:"第1关 · 连击奖励","note":"连击倍率在牌桌右侧累积，结算时一次性放大——与Harvest的音阶是同一目的的不同表达。"},
  {src:"media/shots/tiki-局外活动.jpg",title:"局外 · 活动中心","note":"Poi's Treasure、Amazing Wheel、Jackpot并列：多个小玩法同时开，用“每天都有可领”替代单一主线。"}
 ],
 loop:[
  {zone:"入场",t:"Coins / 关卡解锁",d:"地图式关卡推进"},
  {zone:"局内",t:"±1 + 绳索/鱼/障碍",d:"障碍决定哪张能接"},
  {zone:"卡局",t:"+30s / 道具",d:"时间可购买"},
  {zone:"结算",t:"三星 + Club Points",d:"积分进入俱乐部",k:"gain"},
  {zone:"局外",t:"俱乐部 / Tribute",d:"共同目标与下一关路径"},
  {zone:"回流",t:"Perks",d:"俱乐部等级给全局加成",k:"gain"}
 ],
 mech:[
  {k:"fact",t:"Club Points把个人分数变成集体进度",d:"清牌得分计入俱乐部目标；Golden Tribute等价5个普通Tribute。",refs:[34]},
  {k:"obs",t:"Hold Card并非全局可用",d:"截图中Hold出现在部分关卡与Perk中，不是每局都有；与Candy“每局都有槽”是两种设计哲学。"},
  {k:"ana",t:"社交目标的作用是“给别人一个理由等你”",d:"俱乐部周目标让玩家不是为自己清牌，而是为集体补进度；这比排行榜多一层义务感。"},
  {k:"ana",t:"代价：第一眼偏乱",d:"高饱和海岛风+多入口活动中心，新玩家需要在多个系统间建立优先级。"}
 ],
 cost:[["视觉密度","高饱和+多入口，第一眼偏乱"],["机制割裂","Hold只在部分关卡，玩家难以形成稳定预期"],["时间商品化","+30s把失败直接标价，容易被视为付费墙"],["规模","9月MAU 12.0万，社交结构未能抵消品类老化"]],
 verify:"把同一批新玩家分成“有俱乐部”和“无俱乐部”两组，比较7日与14日回访，并记录他们是否能说出俱乐部目标的具体数字。若说不出但回访更高，说明起作用的是归属感而非目标结构。",
 timeline:[
  ["早期","Hold Card","保存/换回一张牌，仅部分关卡授权","34"],
  ["早期","Double Stack","双抽牌堆，供给翻倍但选择变复杂","34"],
  ["第10关","绳索牌","相邻牌绑定，接一张解一张","115"],
  ["第19关","大鱼吃小鱼","鱼牌按大小吞食，被吞格失效","115"],
  ["常驻","GOAL/STREAK/SPEED","三维三星，可复刷","34"]
 ],
 meta:[
  {t:"俱乐部",d:"Club Points / Perks / Tribute三层：贡献、加成、路径。",refs:[34]},
  {t:"Tribute与Volcano",d:"Tribute决定“下一关打哪一关”，把局外选择变成路径规划。"},
  {t:"活动中心",d:"Poi's Treasure、Amazing Wheel、Jackpot并列，用密度换回访。"}
 ],
 eco:{sources:[["关卡结算","按剩余牌与连击"],["活动小玩法","Poi's Treasure / Wheel / Jackpot"],["俱乐部Perks","等级加成"],["每日登录","周期补给"]],sinks:[["+30s","时间即商品"],["道具","洗牌/加牌/万能"],["关卡入场","金币"],["活动门票","部分活动需消耗"]],note:"Tiki的经济是“获得感机器”：小玩法密集送资源，让玩家一直有东西可点。代价是资源贬值——送得越勤，单次奖励的分量越轻。",refs:[34]},
 senses:[{t:"美术",d:"高饱和海岛风，元素多、对比强；识别度高但信息噪声大。"},{t:"动效",d:"奖励动效从不缺席，几乎每次操作都有反馈。"},{t:"音效",d:"海岛打击乐，节奏快，与“连续点击”的操作节奏一致。"},{t:"品牌/IP",d:"自建Tiki世界观，无外部IP；靠活动与俱乐部维持社群。"}],
 verdict:{good:["把社交做成目标结构，而不是聊天入口","三星可复刷，给熟练玩家二次目标","活动密度高，回访理由充足"],cost:["视觉与系统密度都在劝退新手","Hold非全局，机制预期不稳定","规模已小，社交结构未能逆转品类老化"],open:["Club Points的分配是否按贡献加权？","Tribute路径是否可被玩家主动选择？","+30s的定价与关卡难度是否联动"]},
 refs:[34,115]
};

/* ========== 4 · Fairway ========== */
const fairway={
 id:"fairway",name:"Fairway Solitaire",studio:"Big Fish / BFG",launch:"2007 起多版本 · 现由Big Fish运营",dataId:"MS3075",role:"补充样本 · 成绩单位代表",shotMode:true,
 thesis:"同样±1接牌，但按“一洞”结算、按“整场”评价：一洞没清完也能进下一洞，失败容忍度被重新组织。",
 highlights:[
  {k:"主看点",t:"成绩单位从“关”换成“洞”",d:"一洞=一局，par=标准杆；没清完不等于失败，只是这一洞超杆。"},
  {k:"局内",t:"球杆当替代基准",d:"球杆可替代当前牌接任意牌，等价于一次性Wild；rough/sand/rain按地形改变可接范围。"},
  {k:"边界",t:"无同事实机录屏",d:"本页机制依据2012评测与2026商店描述，凡未实测处标“待核”，不做画面推断。"}
 ],
 shotMode:true,
 shots:[],
 clips:[],
 noShot:"Fairway 目前没有同事实机截图与录屏，本页以文字与规则结构为主；配图待补（待补录：开始一洞→用球杆→残牌结束→下一洞→整场成绩）。",
 loop:[
  {zone:"入场",t:"选球场",d:"巡回赛结构，按球场组织洞"},
  {zone:"局内",t:"±1 + 球杆 + 地形",d:"rough/sand/rain改变可接范围"},
  {zone:"结算",t:"本洞杆数 vs par",d:"超杆不算失败，只记成绩",k:"gain"},
  {zone:"下一洞",t:"继续下一洞",d:"残牌保留为记忆点而非惩罚"},
  {zone:"整场",t:"18洞总成绩",d:"按整场评价，不按单洞判死"},
  {zone:"局外",t:"球场巡回 / 邮票 / Country Club",d:"收集与团队周目标",k:"gain"}
 ],
 mech:[
  {k:"fact",t:"par是评价单位，不是通关条件",d:"一洞以标准杆为基准记成绩；未清完的牌计入杆数，而不是判负（依2012评测与商店描述，待实机核）。"},
  {k:"ana",t:"为什么“洞”比“关”更适合长线",d:"关卡制的失败是二元的（过/不过），洞制把失败连续化（-1/par/+2）。连续分数让玩家愿意打“不好的一洞”，因为它只影响整场平均。"},
  {k:"ana",t:"球杆=一次性Wild，但代价可见",d:"球杆有限且明码标价，玩家每次使用都在做“这张牌值不值一根杆”的换算。"},
  {k:"hyp",t:"现版“no lives or limits”不等于工具免费",d:"商店文案强调无体力限制，但球杆与洗牌是否仍需购买，需实机确认后写入。"}
 ],
 cost:[["证据缺口","无同事实机，规则细节依赖旧评测"],["版本漂移","2012与2026的球杆/地形规则可能不同"],["规模","9月MAU 2.1万，商业参考价值低于机制参考价值"],["门槛","高尔夫术语（par/rough/sand）对非球迷是额外学习成本"]],
 verify:"补录一段完整洞：记录球杆使用次数、残牌数量与最终杆数，验证“残牌计入杆数”而非判负；再对比同关卡制产品的重开率，看连续分数是否降低挫败退出。",
 timeline:[
  ["2007","初代Fairway","±1接牌 + 高尔夫包装","—"],
  ["2012","Fairway Solitaire Blast","加入爆炸与连击，节奏加快","—"],
  ["现版","球场巡回","邮票收集、Country Club周目标","—"],
  ["待核","球杆/地形细则","rough/sand/rain的具体数值未实测","—"]
 ],
 meta:[
  {t:"球场巡回",d:"按球场推进，一球场多洞；推进感来自“打完这场”。"},
  {t:"邮票收集",d:"收集品挂在洞成绩上，给复刷理由。"},
  {t:"Country Club",d:"团队周目标，与Tiki俱乐部同构。"}
 ],
 eco:{sources:[["洞结算","按杆数与剩余牌"],["整场奖励","18洞总成绩"],["邮票/成就","收集里程碑"],["每日","周期补给"]],sinks:[["球杆","替代基准，明码消耗"],["洗牌/预览","改变供给与信息"],["球场解锁","推进门票"]],note:"无同事实机，具体单价与产出比不写入；仅记录“工具明码消耗”这一结构特征。",refs:[31]},
 senses:[{t:"美术",d:"球场实景化背景，牌面清晰；2012版偏卡通，现版更写实（依商店截图，待核）。"},{t:"动效",d:"以球飞行与落点为主，强调“这一杆”的结果。"},{t:"音效",d:"环境音+击球声，节奏比前三款慢。"},{t:"品牌/IP",d:"Big Fish自有品牌，无外部IP；靠“高尔夫+纸牌”这一组合做差异。"}],
 verdict:{good:["把失败连续化，长线挫败感低","球杆与地形让±1产生“场地感”","整场评价给复刷一个非二元的理由"],cost:["规模小，商业样本价值有限","无同事实机，多处规则待核","高尔夫术语抬高非球迷的理解成本"],open:["残牌如何折算杆数？","现版球杆是否仍需购买？","Country Club目标是否影响单洞难度"]},
 refs:[31]
};

const ALL={harvest,disney,tiki,fairway};

function page(id){
 const g=ALL[id];if(!g)return null;
 const nameOf={harvest:"Grand Harvest",candy:"Candy",disney:"Disney",tiki:"Tiki",fairway:"Fairway"};
 const nav=[["harvest","Grand Harvest"],["candy","Candy"],["disney","Disney"],["tiki","Tiki"],["fairway","Fairway"]];
 const sw=nav.map(([k,n])=>`<a class="${k===id?"active":""}" href="#game/${k}">${n}${["tiki","fairway"].includes(k)?"<small>补充</small>":""}</a>`).join("");
 const L=[["g-top","一句话看懂"],["g-see","实机素材"],["g-loop","一局与下一局"],["g-mech","机制拆解"],["g-level","关卡与道具"],["g-meta","局外Meta"],["g-eco","经济与节奏"],["g-sense","美术·动效·音效"],["g-verdict","分析师判断"]];
 const next={harvest:["candy","Candy","Candy把“存与放”做成一个按钮。"],candy:["disney","Disney","Disney把成果做成可辨认的电影场景。"],disney:["tiki","Tiki","Tiki把个人分数变成俱乐部进度。"],tiki:["fairway","Fairway","Fairway把“关”换成“洞”，失败连续化。"],fairway:["harvest","Grand Harvest","回到Harvest：局外循环最完整的样本。"]}[id];
 return `<div class="classic-breadcrumb"><a href="#products">产品拆解</a><span>/</span>${esc(g.name)}</div>
 <header class="game-hero" id="g-top"><div class="gh-copy"><div class="gh-tags">${tag(g.role,"role")}${tag(g.studio)}${g.launch?tag(g.launch):""}</div><h1>${esc(g.name)}</h1><p class="gh-thesis">${esc(g.thesis)}</p><div class="gh-switch">${sw}</div></div><div class="gh-data">${G.productStrip(g.dataId)}</div></header>
 ${toc(L)}
 <div class="highlight-row">${g.highlights.map((h,i)=>`<article class="${i===0?"main":""}"><span class="overline">${esc(h.k)}</span><h3>${esc(h.t)}</h3><p>${esc(h.d)}${ref(h.refs)}</p></article>`).join("")}</div>
 ${sec("g-see","01","RECORDING / SCREENSHOT","实机素材：先看再读","录屏与截图只证明画面中可见的动作；时间点标注是阅读提示，不是完整规则。",`${g.clips?.length?`<div class="clip-grid n${Math.min(2,g.clips.length)}">${g.clips.map(clip).join("")}</div>`:""}${g.shots?.length?`<div class="shot-grid n${Math.min(2,g.shots.length)}">${g.shots.map(shot).join("")}</div>`:""}${g.noShot?`<div class="evidence-gap">${kind("hyp")}<p>${esc(g.noShot)}</p></div>`:""}`)}
 ${sec("g-loop","02","CORE LOOP","一局与下一局：资源往哪里流","",flowLoop(g.loop,g.loopBack||"回到下一局"))}
 ${sec("g-mech","03","DEEP DIVE","机制拆解：它到底改了什么","先看事实，再看代价与怎样证伪。",`<div class="why-list wide">${g.mech.map(w=>`<article>${kind(w.k)}<h4>${esc(w.t)}</h4><p>${esc(w.d)}${ref(w.refs)}</p></article>`).join("")}</div><div class="cost-grid">${g.cost.map(([t,d])=>`<div><b>${esc(t)}</b><span>${esc(d)}</span></div>`).join("")}</div><div class="verify-box">${kind("hyp")}<b>怎样验证</b><p>${esc(g.verify)}</p></div>`)}
 ${sec("g-level","04","LEVEL PACING","关卡与道具：能力是逐级长出来的","",`<div class="timeline">${g.timeline.map(([lv,t,d,r])=>`<div class="tl-item"><span class="tl-lv">${esc(lv)}</span><div><b>${esc(t)}</b><p>${esc(d)}${r&&r!=="—"?ref([r]):""}</p></div></div>`).join("")}</div><p class="sec-foot">${kind("obs")} 节点来自同事单账号体验或商店/评测描述，不代表所有版本与账号。</p>`)}
 ${sec("g-meta","05","META","局外：把“再来一局”接到别的地方","",`<div class="meta-grid">${g.meta.map(m=>`<article><h4>${esc(m.t)}</h4><p>${esc(m.d)}${ref(m.refs)}</p></article>`).join("")}</div>`)}
 ${sec("g-eco","06","ECONOMY","经济与节奏：产出能否覆盖救局","",`<div class="eco"><div class="eco-col"><h4>产出</h4>${g.eco.sources.map(([a,b])=>`<div class="eco-item gain"><b>${esc(a)}</b><span>${esc(b)}</span></div>`).join("")}</div><div class="eco-pool"><b>资源池</b><span>Coins</span></div><div class="eco-col"><h4>消耗</h4>${g.eco.sinks.map(([a,b])=>`<div class="eco-item cost"><b>${esc(a)}</b><span>${esc(b)}</span></div>`).join("")}</div></div><p class="eco-note">${kind("ana")} ${esc(g.eco.note)}${ref(g.eco.refs)}</p>`)}
 ${sec("g-sense","07","ART · MOTION · SOUND","美术、动效、音效与品牌","",`<div class="sense-grid">${g.senses.map(s=>`<article><h4>${esc(s.t)}</h4><p>${esc(s.d)}</p></article>`).join("")}</div>`)}
 ${sec("g-verdict","08","ANALYST VERDICT","分析师判断：优势、代价与待验证","这是基于规则、录屏与同事体验的分析，不是留存或收入因果结论。",`<div class="verdict"><div class="v-good"><h4>做得好的</h4><ul>${g.verdict.good.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div><div class="v-cost"><h4>代价与风险</h4><ul>${g.verdict.cost.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div><div class="v-open"><h4>仍待验证</h4><ul>${g.verdict.open.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div></div><div class="ref-row"><span>本页来源</span>${g.refs.map(n=>`<button class="ref-button" data-source="${n}">[${n}]</button>`).join("")}</div>`)}
 <div class="chapter-end"><div><strong>下一款：${esc(next[1])}</strong><p>${esc(next[2])}</p></div><a class="btn secondary small" href="#game/${next[0]}">继续 →</a></div>`;
}
return {page,ALL};
})();
