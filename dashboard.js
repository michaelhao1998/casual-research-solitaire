"use strict";
/* v4 数据看板与通用图表：只读 RESEARCH_DATA 源值，不改数据；缺失不补0，跨App合计不代表去重人数。 */
window.RESEARCH_DASH=(()=>{
const D=window.RESEARCH_DATA;
const esc=s=>String(s??"").replace(/[&<>"']/g,x=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[x]));
const num=v=>typeof v==="number"&&Number.isFinite(v);
const wan=v=>!num(v)?"缺失":v>=1e8?(v/1e8).toFixed(2)+"亿":v>=1e4?(v/1e4).toFixed(v>=1e6?1:2)+"万":String(Math.round(v));
const point=(p,m)=>p.months.find(x=>x.month===m)||{month:m,mau:null,downloads:null};
const prevMonth=m=>{let[y,mo]=m.split("-").map(Number);mo--;if(!mo){mo=12;y--;}return `${y}-${String(mo).padStart(2,"0")}`;};
const GROUPS=[
 {id:"pm1",name:"±1 TriPeaks / Golf",color:"#a99bff",src:["TriPeaks/Golf ±1","Golf／±1近缘"]},
 {id:"classic",name:"经典接龙",color:"#6fb6e8",src:["传统接龙-分支待核","Klondike","Spider","FreeCell","接龙合集","经典多规则合集","Pyramid凑13（标题初分）"]},
 {id:"semantic",name:"语义 / 词语归类",color:"#e7b46a",src:["语义／词语归类","语义/词语归类","词语构造/牌桌"]},
 {id:"image",name:"图像拼合 / 配对",color:"#6fd0b6",src:["图像拼合","图像类别归组","配对/图像归组","麻将接龙/配对邻近"]},
 {id:"compete",name:"竞技 / 现金赛事",color:"#e58aa8",src:["现金竞技/奖励（单列）","Klondike／赛事"]},
 {id:"other",name:"其他邻近 / 待核",color:"#8792ab",src:[]}
];
const groupOf=p=>GROUPS.find(g=>g.src.includes(p.branch))||GROUPS[GROUPS.length-1];
const S={scope:"discovery167",month:"2026-09",metric:"mau",group:"all",picked:null,hoverHint:""};
const FOCUS=[["MS0035","语义样本"],["MS0219","Disney"],["MS0624","Grand Harvest"],["MS0675","Candy"],["MS1973","Tiki"],["MS3075","Fairway"]];
const label=m=>m==="mau"?"月活 MAU":"下载";
function pool(){let a=D.products.filter(p=>p.memberships.includes(S.scope));if(S.group!=="all")a=a.filter(p=>groupOf(p).id===S.group);return a;}
function valid(a,metric=S.metric,month=S.month){return a.filter(p=>num(point(p,month)[metric])).sort((x,y)=>point(y,month)[metric]-point(x,month)[metric]||x.id.localeCompare(y.id));}
/* ---------- 通用折线：多产品，缺失断线 ---------- */
function lines(series,{metric="mau",W=760,H=260,months=D.months,legend=true,yLabel=true}={}){
 const L=58,R=14,T=14,B=30,ph=H-T-B,pw=W-L-R;
 const vals=series.flatMap(s=>months.map(m=>point(s.p,m)[metric]).filter(num));
 if(!vals.length)return '<p class="dash-empty">未取得源值，不用0补图。</p>';
 const max=Math.max(...vals)*1.08||1,X=i=>L+i/(months.length-1)*pw,Y=v=>T+(1-v/max)*ph;
 const grid=[0,.25,.5,.75,1].map(t=>`<line x1="${L}" x2="${W-R}" y1="${Y(t*max)}" y2="${Y(t*max)}" class="g"/>${yLabel?`<text x="${L-8}" y="${Y(t*max)+3}" text-anchor="end" class="ax">${wan(t*max)}</text>`:""}`).join("");
 const step=months.length>12?4:2;const xt=months.map((m,i)=>(months.length-1-i)%step===0?`<text x="${X(i)}" y="${H-8}" text-anchor="${i===0?"start":i===months.length-1?"end":"middle"}" class="ax">${m.slice(2).replace("-",".")}</text>`:"").join("");
 const paths=series.map(s=>{let segs=[],cur=[];months.forEach((m,i)=>{const v=point(s.p,m)[metric];if(num(v))cur.push([X(i),Y(v),m,v]);else if(cur.length){segs.push(cur);cur=[];}});if(cur.length)segs.push(cur);
  return `<g class="ln" data-id="${s.p.id}">${segs.map(sg=>`<polyline points="${sg.map(q=>q[0].toFixed(1)+","+q[1].toFixed(1)).join(" ")}" fill="none" stroke="${s.color}" stroke-width="${s.bold?2.6:1.8}"/>`).join("")}${segs.flat().map(q=>`<circle cx="${q[0].toFixed(1)}" cy="${q[1].toFixed(1)}" r="2.4" fill="${s.color}"><title>${esc(s.name)} · ${q[2]} · ${wan(q[3])}</title></circle>`).join("")}</g>`;}).join("");
 return `<svg class="dash-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label(metric)}源值走势，缺失不连接">${grid}${xt}${paths}</svg>${legend?`<div class="dash-legend">${series.map(s=>`<span><i style="background:${s.color}"></i>${esc(s.name)}</span>`).join("")}</div>`:""}`;
}
const PALETTE=["#a99bff","#6fb6e8","#e7b46a","#6fd0b6","#e58aa8","#c9d36b","#f08f62","#8fb0ff"];
/* ---------- 单品数据条（产品页复用） ---------- */
function productStrip(id,{note=""}={}){
 const p=D.products.find(x=>x.id===id);if(!p)return `<div class="data-strip missing"><b>当前数据快照未收录</b><span>没有匹配的源序列；不填0、不用同名产品代填。</span></div>`;
 const m="2026-09",x=point(p,m),pr=point(p,prevMonth(m));
 const disc=D.products.filter(q=>q.memberships.includes("discovery167"));
 const rk=metric=>{const v=valid(disc,metric,m);const i=v.findIndex(q=>q.id===id);return i<0?"—":i+1;};
 const ms=D.months.map(mm=>point(p,mm)).filter(z=>num(z.mau));const peak=ms.reduce((a,b)=>!a||b.mau>a.mau?b:a,null);
 const mom=num(x.mau)&&num(pr.mau)&&pr.mau?((x.mau-pr.mau)/pr.mau*100):null;
 return `<div class="data-strip"><div class="ds-kpis"><div><small>2026-09 MAU</small><b>${wan(x.mau)}</b><em>样本顺位 #${rk("mau")}</em></div><div><small>2026-09 下载</small><b>${wan(x.downloads)}</b><em>样本顺位 #${rk("downloads")}</em></div><div><small>MAU 月环比</small><b class="${num(mom)?(mom>=0?"up":"down"):""}">${num(mom)?(mom>0?"+":"")+mom.toFixed(1)+"%":"不可算"}</b><em>8月→9月源值</em></div><div><small>窗口内MAU峰值</small><b>${peak?wan(peak.mau):"缺失"}</b><em>${peak?peak.month:""}</em></div></div><div class="ds-chart"><div class="segmented ds-toggle" role="group" aria-label="指标"><button class="active" data-strip-metric="mau" data-strip-id="${id}">MAU</button><button data-strip-metric="downloads" data-strip-id="${id}">下载</button></div><div class="ds-plot" id="strip-${id}">${lines([{p,name:p.name,color:"#a99bff",bold:true}],{metric:"mau",W:520,H:170,legend:false})}</div></div><p class="ds-note">Mobile Source导出源值 · Global源标签 · 平台覆盖与完整月待确认 · 顺位为9月167条发现集内源值顺位，不是全球名次。${note}<button class="text-button" data-product="${p.id}">完整月度与口径 ↗</button></p></div>`;
}
function stripPlot(id,metric){const p=D.products.find(x=>x.id===id);return lines([{p,name:p.name,color:metric==="mau"?"#a99bff":"#e7b46a",bold:true}],{metric,W:520,H:170,legend:false});}
/* ---------- 看板 ---------- */
function controls(){return `<div class="dash-controls"><div class="segmented" role="group" aria-label="指标">${["mau","downloads"].map(m=>`<button data-dash-metric="${m}" class="${S.metric===m?"active":""}">${label(m)}</button>`).join("")}</div><label>范围<select id="dashScope">${D.datasets.map(s=>`<option value="${s.id}" ${s.id===S.scope?"selected":""}>${esc(s.name)} · ${s.records}</option>`).join("")}</select></label><label>月份<select id="dashMonth">${[...D.months].reverse().map(m=>`<option ${m===S.month?"selected":""}>${m}</option>`).join("")}</select></label><label>玩法分组<select id="dashGroup"><option value="all">全部分组</option>${GROUPS.map(g=>`<option value="${g.id}" ${S.group===g.id?"selected":""}>${esc(g.name)}</option>`).join("")}</select></label></div>`;}
function kpis(){
 const a=pool(),v=valid(a),tot=v.reduce((s,p)=>s+point(p,S.month)[S.metric],0),top10=v.slice(0,10).reduce((s,p)=>s+point(p,S.month)[S.metric],0);
 const pm=prevMonth(S.month);let up=0,down=0;a.forEach(p=>{const c=point(p,S.month)[S.metric],q=point(p,pm)[S.metric];if(num(c)&&num(q)&&q){if(c>q)up++;else if(c<q)down++;}});
 const t=v[0];
 return `<div class="dash-kpis"><article><small>有${label(S.metric)}值的记录</small><b>${v.length}<span> / ${a.length}</span></b><em>缺失 ${a.length-v.length} 条，不补0</em></article><article><small>筛选内第一</small><b class="kpi-name">${t?esc(t.name):"—"}</b><em>${t?wan(point(t,S.month)[S.metric])+" · "+esc(t.publisher):""}</em></article><article><small>Top10 占样本合计</small><b>${tot?(top10/tot*100).toFixed(1)+"%":"—"}</b><em>样本合计 ${wan(tot)}（跨App相加，非去重人数）</em></article><article><small>较上月 上升 / 下降</small><b><span class="up">${up}</span> / <span class="down">${down}</span></b><em>仅相邻两月均有值且前月非0</em></article></div>`;
}
function topBars(){
 const v=valid(pool()).slice(0,15);if(!v.length)return '<p class="dash-empty">该筛选没有源值。</p>';
 const max=point(v[0],S.month)[S.metric];
 return `<div class="hbars">${v.map((p,i)=>{const g=groupOf(p),val=point(p,S.month)[S.metric];return `<button class="hbar" data-product="${p.id}" title="${esc(p.name)} · ${esc(p.branch)}"><span class="hb-rank">${String(i+1).padStart(2,"0")}</span><span class="hb-name"><b>${esc(p.name)}</b><small>${esc(p.publisher)}</small></span><span class="hb-track"><i style="width:${Math.max(1.5,val/max*100)}%;background:${g.color}"></i></span><span class="hb-val">${wan(val)}</span></button>`;}).join("")}</div><div class="dash-legend">${GROUPS.map(g=>`<span><i style="background:${g.color}"></i>${esc(g.name)}</span>`).join("")}</div>`;
}
function groupMix(){
 const a=D.products.filter(p=>p.memberships.includes(S.scope));
 const rows=GROUPS.map(g=>{const list=a.filter(p=>groupOf(p).id===g.id),v=valid(list);return {g,n:list.length,sum:v.reduce((s,p)=>s+point(p,S.month)[S.metric],0)};});
 const tn=rows.reduce((s,r)=>s+r.n,0)||1,ts=rows.reduce((s,r)=>s+r.sum,0)||1;
 const bar=(key,tot)=>`<div class="mix-bar">${rows.filter(r=>r[key]>0).map(r=>`<i style="width:${r[key]/tot*100}%;background:${r.g.color}" title="${esc(r.g.name)} ${key==="n"?r.n+"条":wan(r.sum)} · ${(r[key]/tot*100).toFixed(1)}%"></i>`).join("")}</div>`;
 return `<div class="mix"><div class="mix-row"><span>记录数</span>${bar("n",tn)}</div><div class="mix-row"><span>${label(S.metric)}合计</span>${bar("sum",ts)}</div><table class="mix-table"><thead><tr><th>页面归并分组</th><th class="numeric">记录</th><th class="numeric">${label(S.metric)}合计</th><th class="numeric">占比</th></tr></thead><tbody>${rows.map(r=>`<tr><td><i class="dot" style="background:${r.g.color}"></i>${esc(r.g.name)}</td><td class="numeric">${r.n}</td><td class="numeric">${wan(r.sum)}</td><td class="numeric">${(r.sum/ts*100).toFixed(1)}%</td></tr>`).join("")}</tbody></table><p class="dash-foot">分组由源“分支/初筛标签”归并，仅为页面阅读；源标签原样保留在大表。跨App合计不是去重用户数。</p></div>`;
}
function scatter(){
 const a=pool().filter(p=>num(point(p,S.month).mau)&&num(point(p,S.month).downloads)&&point(p,S.month).mau>0&&point(p,S.month).downloads>0);
 if(a.length<3)return '<p class="dash-empty">两项同时有值的记录不足。</p>';
 const W=560,H=330,L=54,R=16,T=14,B=34,lg=Math.log10;
 const xs=a.map(p=>lg(point(p,S.month).downloads)),ys=a.map(p=>lg(point(p,S.month).mau));
 const x0=Math.floor(Math.min(...xs)),x1=Math.ceil(Math.max(...xs)),y0=Math.floor(Math.min(...ys)),y1=Math.ceil(Math.max(...ys));
 const X=v=>L+(v-x0)/(x1-x0)*(W-L-R),Y=v=>T+(1-(v-y0)/(y1-y0))*(H-T-B);
 const ticks=(a0,a1,f,axis)=>{let o="";for(let k=a0;k<=a1;k++)o+=axis==="x"?`<line x1="${f(k)}" x2="${f(k)}" y1="${T}" y2="${H-B}" class="g"/><text x="${f(k)}" y="${H-B+16}" text-anchor="middle" class="ax">${wan(10**k)}</text>`:`<line x1="${L}" x2="${W-R}" y1="${f(k)}" y2="${f(k)}" class="g"/><text x="${L-6}" y="${f(k)+3}" text-anchor="end" class="ax">${wan(10**k)}</text>`;return o;};
 const lab=new Set(valid(a,"mau").slice(0,6).map(p=>p.id).concat(FOCUS.map(f=>f[0])));
 return `<svg class="dash-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="下载与MAU散点，对数坐标">${ticks(x0,x1,X,"x")}${ticks(y0,y1,Y,"y")}<text x="${W-R}" y="${H-4}" text-anchor="end" class="ax">当月下载（对数）→</text><text x="${L+4}" y="${T+10}" class="ax">↑ MAU（对数）</text>${a.map(p=>{const q=point(p,S.month),g=groupOf(p),cx=X(lg(q.downloads)),cy=Y(lg(q.mau));return `<g class="sc" data-product="${p.id}"><circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${lab.has(p.id)?5:3.4}" fill="${g.color}" fill-opacity=".8"><title>${esc(p.name)} · MAU ${wan(q.mau)} · 下载 ${wan(q.downloads)}</title></circle>${lab.has(p.id)?`<text x="${(cx+7).toFixed(1)}" y="${(cy+3).toFixed(1)}" class="sc-l">${esc(p.name.split(/[:\-–]/)[0].trim().slice(0,22))}</text>`:""}</g>`;}).join("")}</svg><p class="dash-foot">右下：当月新增多、活跃沉淀相对少；左上：下载少而月活高的长线存量产品。仅描述源值位置，不推断留存或买量因果。</p>`;
}
function movers(){
 const pm=prevMonth(S.month),a=pool().map(p=>{const c=point(p,S.month)[S.metric],q=point(p,pm)[S.metric];return num(c)&&num(q)&&q?{p,c,q,r:(c-q)/q}:null;}).filter(Boolean).filter(x=>x.c>=(S.metric==="mau"?100000:20000));
 const up=[...a].sort((x,y)=>y.r-x.r).slice(0,6),dn=[...a].sort((x,y)=>x.r-y.r).slice(0,6);
 const row=x=>`<button class="mv" data-product="${x.p.id}"><span>${esc(x.p.name)}</span><b class="${x.r>=0?"up":"down"}">${x.r>0?"+":""}${(x.r*100).toFixed(1)}%</b><small>${wan(x.q)} → ${wan(x.c)}</small></button>`;
 return `<div class="movers"><div><h4>上升最多</h4>${up.map(row).join("")||'<p class="dash-empty">无</p>'}</div><div><h4>下降最多</h4>${dn.map(row).join("")||'<p class="dash-empty">无</p>'}</div></div><p class="dash-foot">${pm} → ${S.month} · 仅统计当月${S.metric==="mau"?"MAU≥10万":"下载≥2万"}且两月均有值的记录，避免小基数放大。</p>`;
}
function trendPanel(){
 const ids=S.picked||valid(pool(),S.metric,S.month).slice(0,5).map(p=>p.id);
 const series=ids.map((id,i)=>{const p=D.products.find(x=>x.id===id);return p?{p,name:p.name,color:PALETTE[i%PALETTE.length]}:null;}).filter(Boolean);
 return `<div class="trend-pick">${[["top","筛选内Top5"],["focus","研究样本六款"]].map(([k,t])=>`<button class="chip-btn ${((k==="focus")===!!S.picked)?"active":""}" data-trend-set="${k}">${t}</button>`).join("")}</div>${lines(series,{metric:S.metric,W:760,H:270})}`;
}
function focusCards(){return `<div class="focus-grid">${FOCUS.map(([id,tag])=>{const p=D.products.find(x=>x.id===id);if(!p)return "";const x=point(p,"2026-09");return `<button class="focus-card" data-product="${id}"><span class="fc-tag">${esc(tag)}</span><b>${esc(p.name)}</b><span class="fc-kpi"><em>MAU</em>${wan(x.mau)}<em>下载</em>${wan(x.downloads)}</span>${lines([{p,name:p.name,color:"#a99bff"}],{metric:"mau",W:260,H:70,legend:false,yLabel:false}).replace('class="dash-svg"','class="dash-svg spark"')}</button>`;}).join("")}</div>`;}
function page(){
 return `<div class="page-heading"><div><span class="overline">DATA DASHBOARD / MOBILE SOURCE 源值</span><h1>数据看板</h1><p>先看规模与走势，再下钻到单品；所有数字点开都能回到月度源值与口径。</p></div><a class="btn secondary small" href="#" data-scroll="market-table">跳到完整大表 ↓</a></div>
 <div class="notice">2025-01—2026-09 · Global源标签 · <b>平台覆盖与完整月定义待确认</b>；顺位为筛选内源值顺位，不是全球名次；跨App相加不是去重人数；Revenue/ARPU未定币种，看板不展示收入。</div>
 <div id="dashBody">${body()}</div>`;
}
function body(){return `${controls()}${kpis()}
 <div class="dash-grid">
  <section class="dash-card span2"><header><div><span class="overline">RANKING</span><h3>${label(S.metric)} Top 15 · ${S.month}</h3></div><small>颜色＝玩法分组 · 点击查看单品</small></header>${topBars()}</section>
  <section class="dash-card"><header><div><span class="overline">STRUCTURE</span><h3>玩法分组结构</h3></div></header>${groupMix()}</section>
  <section class="dash-card span2"><header><div><span class="overline">TREND</span><h3>${label(S.metric)}走势 · 2025-01—2026-09</h3></div><small>缺失月份断线，不连0</small></header>${trendPanel()}</section>
  <section class="dash-card"><header><div><span class="overline">MOVERS</span><h3>月环比变化</h3></div></header>${movers()}</section>
  <section class="dash-card span2"><header><div><span class="overline">ACQUISITION × ACTIVE</span><h3>下载 × MAU 位置图 · ${S.month}</h3></div><small>对数坐标</small></header>${scatter()}</section>
  <section class="dash-card"><header><div><span class="overline">RESEARCH SET</span><h3>研究样本速查</h3></div><small>2026-09源值</small></header>${focusCards()}</section>
 </div>`;}
function rerender(){const b=document.querySelector("#dashBody");if(b)b.innerHTML=body();}
function onClick(t){
 const m=t.closest("[data-dash-metric]");if(m){S.metric=m.dataset.dashMetric;rerender();return true;}
 const ts=t.closest("[data-trend-set]");if(ts){S.picked=ts.dataset.trendSet==="focus"?FOCUS.map(f=>f[0]):null;rerender();return true;}
 const sm=t.closest("[data-strip-metric]");if(sm){const id=sm.dataset.stripId;document.querySelector("#strip-"+id).innerHTML=stripPlot(id,sm.dataset.stripMetric);sm.parentElement.querySelectorAll("button").forEach(b=>b.classList.toggle("active",b===sm));return true;}
 return false;
}
function onChange(t){if(t.id==="dashScope"){S.scope=t.value;if(S.scope!=="monthly174"&&S.month!=="2026-09")S.month="2026-09";rerender();return true;}if(t.id==="dashMonth"){S.month=t.value;if(S.month!=="2026-09"&&S.scope!=="monthly174")S.scope="monthly174";rerender();return true;}if(t.id==="dashGroup"){S.group=t.value;rerender();return true;}return false;}
return {page,onClick,onChange,lines,productStrip,GROUPS,groupOf,state:S,wan,point};
})();
