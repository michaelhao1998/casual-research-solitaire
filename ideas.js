"use strict";
/* v4 第四章：机会检验。A传送带置首。规则按“组件/动作/判定/胜负/边界”写成可交付口径；示意图统一5:7牌比例，标注全部放进图例。 */
window.RESEARCH_IDEAS=(()=>{
const esc=s=>String(s??"").replace(/[&<>"']/g,x=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[x]));
const KIND={fact:["核心规则","fact"],ana:["分析判断","ana"],hyp:["待验证","hyp"],cfg:["原型默认值","obs"]};
const tag=(t,c="")=>`<span class="dtag ${c}">${esc(t)}</span>`;
const kind=k=>tag(KIND[k][0],KIND[k][1]);
const sec=(id,no,kicker,title,lead,body)=>`<section class="deep-sec" id="${id}"><header class="deep-head"><span class="deep-no">${no}</span><div><span class="overline">${esc(kicker)}</span><h2>${title}</h2>${lead?`<p>${lead}</p>`:""}</div></header>${body}</section>`;
const toc=list=>`<nav class="page-toc" aria-label="本页目录">${list.map(([id,t],i)=>`<a href="#" data-scroll="${id}"><span>${String(i+1).padStart(2,"0")}</span>${esc(t)}</a>`).join("")}</nav>`;
const COL={r:"#e8798b",b:"#7ea6f0",g:"#67c9a0",y:"#e3c07f",p:"#a99bff",n:"#d7deec",line:"#3a4560",mute:"#8a95ad",text:"#d7deec"};
const FONT='font-family="IBM Plex Mono,Microsoft YaHei,monospace"';

/* SVG 牌：统一 5:7 比例 */
function svgCard(x,y,w,label,c,opt={}){const h=Math.round(w*1.4),col=COL[c]||COL.text,stroke=opt.stroke||(opt.back?COL.line:col),sw=opt.sw||1.6;
 if(opt.back)return `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${w*.12}" fill="#141b2a" stroke="${stroke}" stroke-width="${sw}"/><rect x="${x+5}" y="${y+5}" width="${w-10}" height="${h-10}" rx="${w*.08}" fill="none" stroke="#273049" stroke-width="1"/>${opt.star?`<text x="${x+w/2}" y="${y+24}" text-anchor="middle" font-size="${Math.round(w*.42)}" fill="${COL.y}">★</text>`:""}</g>`;
 return `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${w*.12}" fill="#121926" stroke="${stroke}" stroke-width="${sw}"/><text x="${x+w/2}" y="${y+h*.62}" text-anchor="middle" ${FONT} font-size="${Math.round(w*.46)}" font-weight="600" fill="${col}">${label}</text></g>`;}
const marker=(x,y,n,c=COL.y)=>`<g><circle cx="${x}" cy="${y}" r="11" fill="#0f1520" stroke="${c}" stroke-width="1.5"/><text x="${x}" y="${y+4}" text-anchor="middle" ${FONT} font-size="12" font-weight="600" fill="${c}">${n}</text></g>`;
const defs=`<defs>${[["ay",COL.y],["ap",COL.p],["am",COL.mute]].map(([id,c])=>`<marker id="${id}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="${c}"/></marker>`).join("")}</defs>`;
const legend=(x,y,items,title="读图顺序")=>`<g><text x="${x}" y="${y}" ${FONT} font-size="11.5" fill="${COL.mute}" letter-spacing="1">${title}</text>${items.map(([n,a,b,c],i)=>`${marker(x+11,y+30+i*58,n,c||(n==="✕"?COL.r:COL.y))}<text x="${x+32}" y="${y+28+i*58}" font-size="13" fill="${COL.text}" font-weight="600">${a}</text><text x="${x+32}" y="${y+47+i*58}" font-size="11.5" fill="${COL.mute}">${b}</text>`).join("")}</g>`;

/* ===== 图A：传送带结构图 ===== */
function conveyorAnatomy(){
 const cw=44,pw=56,L=210,R=630,TY=216,BY=356,RAD=70;
 const piles=[["r","4","红堆"],["b","7","蓝堆"],["g","2","绿堆"]],px=[260,420,580];
 let s=`<svg class="diagram" viewBox="0 0 1000 580" role="img" aria-label="传送带×±1结构图：出牌区投放到循环传送带，带子经过同色堆时按±1自动判定">${defs}`;
 s+=`<text x="150" y="22" ${FONT} font-size="11.5" fill="${COL.p}" letter-spacing="1">A · 归堆区（3 堆，各认一种颜色）</text>`;
 piles.forEach(([c,v,n],i)=>{s+=svgCard(px[i]-pw/2,36,pw,v,c,{sw:2});s+=`<text x="${px[i]}" y="${36+78+20}" text-anchor="middle" font-size="12" fill="${COL[c]}">${n} · 堆顶 ${v}</text>`;});
 const path=`M${L} ${TY} H${R} A${RAD} ${RAD} 0 0 1 ${R} ${BY} H${L} A${RAD} ${RAD} 0 0 1 ${L} ${TY} Z`;
 s+=`<path d="${path}" fill="none" stroke="#182033" stroke-width="76" stroke-linejoin="round"/><path d="${path}" fill="none" stroke="${COL.line}" stroke-width="1.2" stroke-dasharray="2 7"/>`;
 s+=`<path d="M${R+RAD} ${TY+30} V${BY-56}" stroke="${COL.mute}" stroke-width="1.8" marker-end="url(#am)"/><path d="M${L-RAD} ${BY-30} V${TY+30}" stroke="${COL.mute}" stroke-width="1.8" marker-end="url(#am)"/>`;
 s+=`<text x="${(L+R)/2}" y="${(TY+BY)/2-2}" text-anchor="middle" font-size="13" fill="${COL.text}">B · 循环传送带（顺时针）</text><text x="${(L+R)/2}" y="${(TY+BY)/2+18}" text-anchor="middle" ${FONT} font-size="11.5" fill="${COL.mute}">容量 6 · 当前占位 2 / 6</text>`;
 const cy=TY-31;
 s+=svgCard(px[0]-cw/2,cy,cw,"5","r",{stroke:COL.y,sw:2.4});
 s+=svgCard(px[1]+44-cw/2,cy,cw,"9","b");
 px.forEach(x=>{s+=`<line x1="${x}" y1="142" x2="${x}" y2="${cy-8}" stroke="${COL.line}" stroke-width="1" stroke-dasharray="3 4"/>`;});
 s+=`<path d="M${px[0]} ${cy-6} V146" stroke="${COL.y}" stroke-width="2.2" marker-end="url(#ay)"/>`;
 s+=`<text x="150" y="452" ${FONT} font-size="11.5" fill="${COL.p}" letter-spacing="1">C · 出牌区（每列只有最上面一张可点）</text>`;
 const cols=[["r","6"],["g","8"],["b","3"],["r","9"]],sx=[260,360,460,560],sw=46;
 cols.forEach(([c,v],i)=>{const x=sx[i]-sw/2;s+=svgCard(x,468,sw,"","",{back:true});s+=svgCard(x,484,sw,v,c,i===0?{stroke:COL.p,sw:2.6}:{});});
 s+=`<path d="M${sx[0]-30} 498 C 196 492, 188 452, 196 ${BY+44}" fill="none" stroke="${COL.p}" stroke-width="2" stroke-dasharray="5 4" marker-end="url(#ap)"/>`;
 s+=`<text x="150" y="${BY+70}" font-size="11.5" fill="${COL.p}">入口</text>`;
 s+=marker(sx[0]+36,490,"1")+marker(R+RAD,BY-30,"2")+marker(px[0]+36,cy+10,"3")+marker(px[1]+80,cy+10,"✕",COL.r)+marker((L+R)/2+118,(TY+BY)/2+14,"4");
 s+=legend(790,34,[["1","点一张可用牌","它从入口进入传送带"],["2","带子顺时针转动","依次经过红、蓝、绿三堆"],["3","经过同色堆时判定","点数 = 堆顶 ±1 → 自动落堆"],["✕","判定不通过","继续绕圈，占用一个带位"],["4","带满 6 张且绕一圈","无任何落堆 → 本局失败"]]);
 s+=`<text x="790" y="356" font-size="11.5" fill="${COL.mute}">图中示例</text><text x="790" y="378" font-size="11.5" fill="${COL.text}">红5 → 红堆4：同色、差1，落堆</text><text x="790" y="398" font-size="11.5" fill="${COL.text}">蓝9 → 蓝堆7：差2，继续绕圈</text><text x="790" y="418" font-size="11.5" fill="${COL.p}">下一张该放红6：红堆变5后可接</text>`;
 return s+`</svg>`;
}

/* ===== HTML 分步状态图 ===== */
const hc=(c,v,st="")=>`<span class="hc ${c} ${st}">${v}</span>`;
function frame(no,title,piles,belt,cap,src,note,st=""){
 const slots=Array.from({length:cap},(_,i)=>belt[i]?hc(belt[i][0],belt[i][1],belt[i][2]||""):`<span class="hc empty"></span>`).join("");
 return `<article class="sb ${st}"><header><span>${no}</span><b>${title}</b></header>
 <div class="sb-row"><small>归堆区</small><div class="sb-piles">${piles.map(([c,v,s2])=>`<div class="sb-pile">${hc(c,v,s2||"")}<em>${{r:"红",b:"蓝",g:"绿"}[c]}堆</em></div>`).join("")}</div></div>
 <div class="sb-row"><small>传送带 ${belt.filter(Boolean).length}/${cap}</small><div class="sb-belt">${slots}</div></div>
 ${src?`<div class="sb-row"><small>出牌区</small><div class="sb-src">${src.map(([c,v,s3])=>hc(c,v,s3||"")).join("")}</div></div>`:""}
 <p>${note}</p></article>`;}
function conveyorSteps(){
 return `<div class="sb-grid">
 ${frame("01","初始状态",[["r","4"],["b","7"],["g","2"]],[["r","5","hot"],["b","9"]],6,[["r","6","pick"],["g","8"]],"带上已有红5、蓝9（占位 2/6）；出牌区可点红6、绿8。")}
 ${frame("02","带子转过红堆",[["r","5","up"],["b","7"],["g","2"]],[["b","9"]],6,[["r","6","pick"],["g","8"]],"红5 与红堆顶 4 同色、差 1 → 自动落堆，红堆顶变为 5；带上剩 1/6。")}
 ${frame("03","放红6：连锁接上",[["r","6","up"],["b","7"],["g","2"]],[["b","9"]],6,[["g","8"]],"红6 上带后经过红堆，与堆顶 5 差 1 → 落堆。顺序对了，带位不增加。","good")}
 ${frame("03′","对照：若先放绿8",[["r","5"],["b","7"],["g","2"]],[["b","9"],["g","8","bad"]],6,[["r","6"]],"绿8 与绿堆顶 2 差 6，只能绕圈：带位 1/6 → 2/6，缓冲少了一格。","bad")}
 </div>`;}
function failSteps(){
 const b=n=>Array.from({length:n},(_,i)=>[["b","9"],["g","8"],["b","3"],["g","6"],["r","1"],["b","K"]][i]);
 return `<div class="sb-grid n3">
 ${frame("A","安全：0–4 格",[["r","6"],["b","7"],["g","2"]],b(4),6,null,"带上还有 2 格缓冲，可以继续投放。")}
 ${frame("B","预警：第 5 格",[["r","6"],["b","7"],["g","2"]],b(5),6,null,"带子与出牌区边框变黄，提示“只剩 1 格”。预警长在物件上，不弹窗。","warn")}
 ${frame("C","失败：6/6 且绕一圈无落堆",[["r","6"],["b","7"],["g","2"]],b(6),6,null,"无法投放，且带上每张牌都经过本色堆却接不上 → 判负；结算高亮“最后一张占位的牌”。","bad")}
 </div>`;}

/* ===== 图B：取宝物（标准TriPeaks 28张几何：3/6/9/10，每张压住下排两张的各一半） ===== */
function treasureBoard(){
 const w=44,dx=50,x0=72,h=Math.round(w*1.4),ry=[40,74,108,142];
 const r4=i=>x0+i*dx,r3=i=>x0+dx/2+i*dx,r2=(p,j)=>x0+dx+(3*p+j)*dx,r1=p=>x0+1.5*dx+3*p*dx;
 const T1=2,T2=[0,1],T3=4;
 let s=`<svg class="diagram" viewBox="0 0 1000 344" role="img" aria-label="取宝物过关示意：TriPeaks 28张牌阵，三张宝物牌埋在不同深度">${defs}`;
 s+=`<text x="${x0-22}" y="22" ${FONT} font-size="11.5" fill="${COL.p}" letter-spacing="1">标准 TriPeaks 牌阵 · 28 张 · 金色★ = 宝物牌</text>`;
 for(let p=0;p<3;p++)s+=svgCard(r1(p)-w/2,ry[0],w,"","",{back:true,star:p===T1,stroke:p===T1?COL.y:undefined,sw:p===T1?2.2:1.6});
 for(let p=0;p<3;p++)for(let j=0;j<2;j++){const st=p===T2[0]&&j===T2[1];s+=svgCard(r2(p,j)-w/2,ry[1],w,"","",{back:true,star:st,stroke:st?COL.y:undefined,sw:st?2.2:1.6});}
 for(let i=0;i<9;i++)s+=svgCard(r3(i)-w/2,ry[2],w,"","",{back:true,star:i===T3,stroke:i===T3?COL.y:undefined,sw:i===T3?2.2:1.6});
 const open=["6","Q","9","4","8","9","J","3","5","10"];
 open.forEach((v,i)=>{const cover=i===T3||i===T3+1;s+=svgCard(r4(i)-w/2,ry[3],w,v,"n",cover?{stroke:COL.p,sw:2.6}:{});});
 s+=`<text x="${(r4(T3)+r4(T3+1))/2}" y="${ry[3]+h+20}" text-anchor="middle" font-size="11.5" fill="${COL.p}">先清这两张</text>`;
 const sy=ry[3]+h+44;
 s+=svgCard(x0+40,sy+4,w,"","",{back:true})+svgCard(x0+46,sy,w,"","",{back:true});
 s+=`<text x="${x0+68}" y="${sy+h+20}" text-anchor="middle" font-size="12" fill="${COL.mute}">Stock 剩 23</text>`;
 s+=svgCard(x0+140,sy,w,"7","y",{sw:2.2});
 s+=`<text x="${x0+162}" y="${sy+h+20}" text-anchor="middle" font-size="12" fill="${COL.mute}">弃牌顶 7</text>`;
 s+=`<rect x="${x0+240}" y="${sy+2}" width="190" height="58" rx="10" fill="#141b2a" stroke="${COL.line}"/><text x="${x0+256}" y="${sy+26}" font-size="13" fill="${COL.text}" font-weight="600">宝物进度 ★ 0 / 3</text><text x="${x0+256}" y="${sy+46}" font-size="11.5" fill="${COL.mute}">取齐即过关，剩牌可留桌</text>`;
 s+=legend(640,34,[["★","宝物牌（金色描边）","3 张，分在三座峰的不同深度"],["◆","先清的牌（紫色描边）","8、9 压住最浅的宝物：7→8→9 可连接",COL.p],["↥","越靠峰顶越深","峰顶★要拆完整座峰，适合留到后段",COL.mute],["✓","取得","宝物被接到弃牌位即 +1，3/3 立即过关"]],"图例");
 return s+`</svg>`;
}

/* ======================= 页面：A 传送带 ======================= */
function conveyorPage(){
 return `<div class="classic-breadcrumb"><a href="#opportunities">机会检验</a><span>/</span>机会A · 传送带 × ±1</div>
 <header class="game-hero"><div class="gh-copy"><div class="gh-tags">${tag("优先验证 · 第一位","role")}${tag("动态Sort × Solitaire")}</div><h1>循环传送带 × ±1 归堆</h1><p class="gh-thesis">把动态Sort的“投放顺序”与Solitaire的“±1接龙”接在一起：玩家只决定先放哪张牌，归堆由带子自动判定。顺序放对会连锁归堆，放早了就占住带上的位置。</p>
 <div class="gh-switch"><a class="active" href="#idea/conveyor">A · 传送带</a><a href="#idea/treasure">B · 取宝物</a><a href="#idea/more">C · 其他</a></div></div>
 <div class="gh-data"><div class="data-strip"><b>一句话规则</b><span>同色、且与堆顶相差 1，才能归堆；接不上的牌留在带上绕圈占位。带子堵死即输，全部归堆即赢。</span></div></div></header>
 ${toc([["c-view","结构图"],["c-spec","规则说明书"],["c-step","一回合分步"],["c-fail","失败与预警"],["c-param","关卡参数"],["c-dec","新增决策"],["c-var","两个版本"],["c-risk","风险与否决"],["c-test","最小验证"]])}
 ${sec("c-view","01","ANATOMY","结构图：三个区域，一条判定规则","按序号阅读；文字说明集中在右侧图例，图上只保留牌、带子与箭头。",`<figure class="idea-fig">${conveyorAnatomy()}<figcaption>构造示意，非实录；堆顶、带上牌与占位数为示例。参考产品 Solitaire Out: Color Flow 原版不按±1，±1为本研究的融合设想。</figcaption></figure>`)}
 ${sec("c-spec","02","RULE SPEC","规则说明书","按程序可实现的口径写；“原型默认值”是为第一版原型拍板的取值，可在参数表中调整。",`<table class="spec"><thead><tr><th>模块</th><th>规则</th><th>来源</th></tr></thead><tbody>
 <tr><td>牌</td><td>只有「颜色」「点数」两个属性；颜色 3 种（红/蓝/绿），点数 A–K</td><td>${kind("cfg")}</td></tr>
 <tr><td>归堆区</td><td>3 堆，每堆只接收一种颜色；开局各有一张起始堆顶（关卡配置）</td><td>${kind("fact")}</td></tr>
 <tr><td>归堆条件</td><td>颜色相同 且 点数 = 堆顶 ± 1；落堆后该牌成为新堆顶</td><td>${kind("fact")}</td></tr>
 <tr><td>传送带</td><td>环形，容量 6；带上的牌顺时针依次经过红、蓝、绿三堆，经过时自动判定</td><td>${kind("cfg")}</td></tr>
 <tr><td>出牌区</td><td>若干列牌，每列只有最上面一张可点，点走后下一张翻开</td><td>${kind("cfg")}</td></tr>
 <tr><td>玩家动作</td><td>唯一动作：点一张可用牌，投放到传送带入口；入口被占时不能投放</td><td>${kind("cfg")}</td></tr>
 <tr><td>连锁</td><td>堆顶改变后，带上已有的牌下次经过时按新堆顶重新判定（红5落堆后，红6即可接上）</td><td>${kind("fact")}</td></tr>
 <tr><td>胜利</td><td>出牌区与传送带上的牌全部归堆</td><td>${kind("fact")}</td></tr>
 <tr><td>失败</td><td>带上 6/6 已满，且每张牌经过本色堆一次后仍无落堆（堵死）</td><td>${kind("cfg")}</td></tr>
 <tr><td>边界：K↔A</td><td>第一版不衔接（K 只接 Q，A 只接 2），降低心算负担；衔接作为参数保留</td><td>${kind("cfg")}</td></tr>
 <tr><td>边界：升降</td><td>同一堆可升可降（4 → 5 → 4 均合法），与 TriPeaks 一致</td><td>${kind("cfg")}</td></tr>
 </tbody></table>`)}
 ${sec("c-step","03","STEP BY STEP","一回合分步：顺序为什么重要","同一个局面、两种投放顺序。01→02→03 是正确顺序；03′ 展示放错的代价。",conveyorSteps())}
 ${sec("c-fail","04","FAILURE","失败与预警：输的时候要能指出原因","失败只有一种：带子堵死。第 5 格出现预警，给玩家一次纠正机会。",failSteps()+`<p class="sec-foot">${kind("ana")} 失败判定写成“绕一圈仍无落堆”而不是“带满即输”：带满但下一张就能落堆时不应判负，否则玩家会觉得被系统抢先。</p>`)}
 ${sec("c-param","05","LEVEL PARAMS","关卡参数：可直接交给关卡与数值","第一版建议值偏宽松，先验证“顺序”是否被理解，再收紧。",`<table class="mini-table"><thead><tr><th>参数</th><th>第一版建议</th><th>调大 →</th><th>调小 →</th></tr></thead><tbody>
 <tr><td>传送带容量</td><td>6</td><td>容错高，顺序不重要</td><td>堵带快，压力大</td></tr>
 <tr><td>颜色数 / 堆数</td><td>3</td><td>判断变复杂</td><td>接近纯±1，深度下降</td></tr>
 <tr><td>出牌区列数</td><td>4</td><td>可选牌多，规划空间大</td><td>选择少，偏运气</td></tr>
 <tr><td>总牌数</td><td>24–30</td><td>单局更长</td><td>适合教学关</td></tr>
 <tr><td>暗牌比例</td><td>每列仅顶张明牌</td><td>信息少，偏运气</td><td>全明牌，偏解谜</td></tr>
 <tr><td>带速（仅实时版）</td><td>4 秒/圈</td><td>节奏慢，可思考</td><td>手速压力</td></tr>
 <tr><td>K↔A 衔接</td><td>关</td><td>链更长，心算更难</td><td>—</td></tr></tbody></table>`)}
 ${sec("c-dec","06","DECISION","相比原版，玩家多了什么决策","TriPeaks 只问“下一张接哪张”；这里多出三个问题。",`<div class="why-list wide">
 <article>${kind("ana")}<h4>先放哪张：顺序决定连锁</h4><p>红6 必须等红5 先落堆；先放红6 只会让它在带上绕圈。玩家要倒推“哪张能让下一张接上”。</p></article>
 <article>${kind("ana")}<h4>放还是等：带位就是预算</h4><p>6 个带位等于 6 次“放早了”的额度。每放一张不能立即落堆的牌，都在消耗缓冲。</p></article>
 <article>${kind("ana")}<h4>挖哪一列：揭牌换信息</h4><p>出牌区每列只露一张；先点哪列决定下一张翻出什么，保留 TriPeaks 的揭牌乐趣。</p></article>
 <article>${kind("hyp")}<h4>待验证：会不会退化成“能落就放”</h4><p>若多数局面只有一张可立即落堆的牌，决策就消失了。关卡需保证至少两张可选、且结果不同。</p></article></div>`)}
 ${sec("c-var","07","VARIANTS","两个版本：只差“谁推动时间”","第一版建议无计时、慢速；先做 B1 验证策略价值，再做 B2 验证节奏感。",`<table class="mini-table"><thead><tr><th>版本</th><th>传送带何时转动</th><th>压力来源</th><th>要测的问题</th></tr></thead><tbody>
 <tr><td><b>B1 回合制</b></td><td>每投放一张，带子转一整圈并结算所有落堆，然后停下等待</td><td>带位预算</td><td>玩家是否会倒推顺序？失败能否被指出？</td></tr>
 <tr><td><b>B2 实时</b></td><td>持续转动（建议 4 秒/圈），入口空时随时可投</td><td>带位 + 时间</td><td>等待与堵带会不会压过连锁的爽感？</td></tr></tbody></table>`)}
 ${sec("c-risk","08","RISK","风险与否决条件","先写清楚放弃条件，避免方向变成“必须成立”。",`<div class="cost-grid">
 <div><b>爽感被等待打断</b><span>B2 中带子空转、玩家无事可做；空转时长占比 &gt; 30% 视为节奏失败</span></div>
 <div><b>判断退化</b><span>玩家只盯带位不看点数，±1 失去意义</span></div>
 <div><b>规则叠加门槛</b><span>颜色 + 点数 + 环形空间三层同时理解；教学需拆成 3 关</span></div>
 <div><b>否决线</b><span>失败后能指出“哪张放早了”的测试者 &lt; 60%，则本方向否决</span></div></div>`)}
 ${sec("c-test","09","TEST","最小验证（纸面原型即可）","",`<div class="verify-box">${kind("hyp")}<b>两周内可完成的对照测试</b><p>同一副牌序做两组，各 12 人：A 组为 B1 回合制传送带，B 组为同牌序的静态 TriPeaks。记录：① 投放前出现 &gt;1.5 秒停顿、比较两张牌的比例；② 失败后能否指出“放早的那张”；③ 主动重开率；④ 单局连锁落堆最长长度。①② 达标再做 B2 实时版。</p></div>`)}
 <div class="chapter-end"><div><strong>下一篇：取宝物过关</strong><p>不改供给，只改“什么算过关”。</p></div><a class="btn secondary small" href="#idea/treasure">继续 →</a></div>`;
}

/* ======================= 页面：B 取宝物 ======================= */
function treasurePage(){
 return `<div class="classic-breadcrumb"><a href="#opportunities">机会检验</a><span>/</span>机会B · 取宝物</div>
 <header class="game-hero"><div class="gh-copy"><div class="gh-tags">${tag("第二位","role")}${tag("TriPeaks 换过关目标")}</div><h1>取宝物即过关</h1><p class="gh-thesis">±1 接牌、覆盖结构、Stock 都不变；只把胜利条件从“清空 28 张”改成“取得 3 张宝物牌”。玩家第一次有了“往哪挖”的方向，也多了“省牌直取还是绕路连击”的取舍。</p>
 <div class="gh-switch"><a href="#idea/conveyor">A · 传送带</a><a class="active" href="#idea/treasure">B · 取宝物</a><a href="#idea/more">C · 其他</a></div></div>
 <div class="gh-data"><div class="data-strip"><b>一句话规则</b><span>宝物牌与普通牌一样按 ±1 接走；接走第 3 张宝物的瞬间立即过关，剩余牌不再要求清空。</span></div></div></header>
 ${toc([["t-view","牌阵图"],["t-spec","规则说明书"],["t-route","两条路线"],["t-param","关卡参数"],["t-risk","风险与否决"]])}
 ${sec("t-view","01","BOARD","牌阵图：宝物埋得越深，这关越难","标准 TriPeaks 几何：4 排 3/6/9/10 张，每张压住下排相邻两张的各一半。",`<figure class="idea-fig">${treasureBoard()}<figcaption>构造示意，非实录；宝物位置与点数为示例。</figcaption></figure>`)}
 ${sec("t-spec","02","RULE SPEC","规则说明书","",`<table class="spec"><thead><tr><th>模块</th><th>规则</th><th>来源</th></tr></thead><tbody>
 <tr><td>牌阵与接牌</td><td>与 TriPeaks 相同：1 副 52 张，28 张成牌阵、23 张为 Stock；未被压住的牌与弃牌顶相差 1 即可接走，不看花色</td><td>${kind("fact")}</td></tr>
 <tr><td>宝物牌</td><td>关卡指定 3 张牌为宝物，★ 标记始终可见；被压住时点数不可见（同 TriPeaks 暗牌）；除标记外与普通牌规则完全相同</td><td>${kind("cfg")}</td></tr>
 <tr><td>取得</td><td>宝物牌被接到弃牌位即算取得，进度 +1</td><td>${kind("cfg")}</td></tr>
 <tr><td>胜利</td><td>取得第 3 张宝物，立即过关，不需要清空牌阵</td><td>${kind("fact")}</td></tr>
 <tr><td>失败</td><td>Stock 用完（或步数上限用完）且无可接牌，宝物未取齐</td><td>${kind("fact")}</td></tr>
 <tr><td>评价</td><td>按剩余 Stock 折算星级：≥10 张 3★、5–9 张 2★、其余 1★（建议值）</td><td>${kind("cfg")}</td></tr>
 <tr><td>完美奖励</td><td>取齐宝物后可选择继续清台；清空额外奖励一份收集物，不影响过关判定</td><td>${kind("cfg")}</td></tr>
 </tbody></table>`)}
 ${sec("t-route","03","ROUTES","两条路线：省牌直取 vs 绕路连击","数值为构造示例，说明取舍方向，不代表平衡结果。",`<table class="mini-table vs"><thead><tr><th></th><th>直取路线</th><th>绕路连击</th></tr></thead><tbody>
 <tr><td>做法</td><td>只拆压住宝物的牌，到手就停</td><td>先清宝物周边，攒长连击</td></tr>
 <tr><td>消耗 Stock</td><td>少（例：8 张）</td><td>多（例：14 张）</td></tr>
 <tr><td>收益</td><td>星级高（剩余 Stock 多）</td><td>金币高（连击奖励）</td></tr>
 <tr><td>风险</td><td>连击短、金币少</td><td>Stock 不够，宝物没拿齐就失败</td></tr></tbody></table>
 <p class="sec-foot">${kind("ana")} 只有当“星级”和“金币”对玩家都有价值时，这个取舍才成立——局外必须同时需要两者。</p>`)}
 ${sec("t-param","04","LEVEL PARAMS","关卡参数","",`<table class="mini-table"><thead><tr><th>参数</th><th>作用</th><th>设计注意</th></tr></thead><tbody>
 <tr><td>宝物深度</td><td>第 1 排峰顶最深，第 3 排较浅</td><td>全在峰顶 ≈ 清台；全部暴露又过浅</td></tr>
 <tr><td>宝物分布</td><td>同峰 / 跨峰</td><td>跨三峰才逼出路线选择</td></tr>
 <tr><td>宝物点数</td><td>翻开后能否立即接走</td><td>与周边点数的距离决定绕路成本</td></tr>
 <tr><td>Stock / 步数上限</td><td>默认 Stock 23 张</td><td>缩减预算是加难的主旋钮（遮挡 + 步数限制）</td></tr></tbody></table>`)}
 ${sec("t-risk","05","RISK","风险与否决","",`<div class="cost-grid">
 <div><b>完成感缺失</b><span>剩牌结束可能让人觉得“没玩完”——这是首要验证点</span></div>
 <div><b>习惯性清台</b><span>若多数人取齐后仍继续清，目标变化等于没变</span></div>
 <div><b>宝物可见性</b><span>★ 标记被压住时也必须清晰可见</span></div>
 <div><b>否决线</b><span>同一关两组玩家的路线无明显差异，说明取舍不存在</span></div></div>`)}
 <div class="chapter-end"><div><strong>下一篇：其他候选</strong><p>一次排牌权、语义多归属。</p></div><a class="btn secondary small" href="#idea/more">继续 →</a></div>`;
}

/* ======================= 页面：C 其他 ======================= */
function morePage(){
 return `<div class="classic-breadcrumb"><a href="#opportunities">机会检验</a><span>/</span>机会C · 其他思路</div>
 <header class="game-hero"><div class="gh-copy"><div class="gh-tags">${tag("候补","role")}</div><h1>其他候选思路</h1><p class="gh-thesis">都遵守“只改一处”：改供给顺序、改匹配关系、改界面。保留在这里是为了留选项和否决理由。</p>
 <div class="gh-switch"><a href="#idea/conveyor">A · 传送带</a><a href="#idea/treasure">B · 取宝物</a><a class="active" href="#idea/more">C · 其他</a></div></div>
 <div class="gh-data"><div class="data-strip"><b>排序原则</b><span>先看失败能否归因，再看是否只改一处。</span></div></div></header>
 ${sec("m-list","01","CANDIDATES","三个候选","",`<div class="cand-grid">
 <article><span class="overline">C1 · 改供给顺序</span><h3>一次排牌权</h3><p>每局一次，可重排 Stock 顶部 3 张。例：底牌 8、桌面 10，把 9 调到最前，少耗一张补牌。</p><div class="mini-seq"><span>原序</span>${hc("n","6")}${hc("n","9")}${hc("n","4")}<span>→</span>${hc("n","9","pick")}${hc("n","6")}${hc("n","4")}</div><ul><li>新取舍：眼前救局，还是留给后面的难点</li><li>否决：玩家看到答案就必点，说明没有取舍</li></ul></article>
 <article><span class="overline">C2 · 改匹配关系</span><h3>语义多归属</h3><p>一张词卡可进多个合法类别。例：“蝙蝠”既属哺乳动物，也属会飞的。</p><div class="mini-seq"><span>蝙蝠</span><span>→</span><em>哺乳动物 0/8</em><em>会飞的 0/6</em></div><ul><li>新取舍：认对之后，还能靠规划玩得更好</li><li>否决：多路径无法被玩家理解或计算</li></ul></article>
 <article><span class="overline">C3 · 改界面</span><h3>竖屏 TriPeaks</h3><p>为单手操作重排牌阵。属于界面变量，不算新机制，已有先例。</p><ul><li>代价：可接范围变窄，难度自然上升</li><li>仅作包装选项，不进入机制排序</li></ul></article></div>`)}
 ${sec("m-drop","02","REJECTED","已否决的思路","保留否决理由，避免重复讨论。",`<table class="mini-table"><thead><tr><th>思路</th><th>否决理由</th></tr></thead><tbody>
 <tr><td>倒计时炸弹牌</td><td>失败从“判断失误”变成“来不及”，违背失败可归因</td></tr>
 <tr><td>牌面叠加多种属性</td><td>判断从 1 条变 3 条，违背“只改一处”</td></tr>
 <tr><td>局外 Merge 替代相册</td><td>Merge Kingdom 已做，且两套操作切换割裂</td></tr></tbody></table>`)}
 <div class="chapter-end"><div><strong>回到 A</strong><p>传送带仍是最值得先做的一条。</p></div><a class="btn secondary small" href="#idea/conveyor">回看 A →</a></div>`;
}
function page(id){return id==="treasure"?treasurePage():id==="more"?morePage():conveyorPage();}
return {page};
})();
