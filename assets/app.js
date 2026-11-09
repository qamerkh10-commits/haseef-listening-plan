/* حصيف — سكربت مشترك لكل الصفحات */
const X=window.HASEEF;
const D=X.days,C=X.courses,P=X.pods,B=X.books,SP=X.speed,K="haseef-v4",POD="#6B6A66",REV="#CDB98C";
const CM={},PM={},BM={};C.forEach(c=>CM[c.id]=c);P.forEach(p=>PM[p.id]=p);B.forEach(b=>BM[b.id]=b);
const PAGE=document.body.dataset.page,Q=new URLSearchParams(location.search),$=id=>document.getElementById(id);
let S={},F="all";
try{S=JSON.parse(localStorage.getItem(K)||"{}")}catch(e){}
const sv=()=>{try{localStorage.setItem(K,JSON.stringify(S))}catch(e){}};
const MO=["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];
const nf=new Intl.NumberFormat("ar-EG"),n1=new Intl.NumberFormat("ar-EG",{maximumFractionDigits:1});
const now=new Date(),T=now.getFullYear()+"-"+String(now.getMonth()+1).padStart(2,"0")+"-"+String(now.getDate()).padStart(2,"0");
const E=(g,c,x)=>{const e=document.createElement(g);if(c)e.className=c;if(x!=null)e.textContent=x;return e};
const fd=iso=>{const[y,m,d]=iso.split("-").map(Number);return nf.format(d)+" "+MO[m-1]};
const yr=y=>nf.format(+y).replace(/٬/g,"");
const fdy=iso=>fd(iso)+" "+yr(iso.slice(0,4));
const hms=s=>{const h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60;return h+":"+String(m).padStart(2,"0")+":"+String(x).padStart(2,"0")};
const mins=s=>nf.format(Math.round(s/60));
const yt=(v,a)=>"https://www.youtube.com/watch?v="+v+(a?"&t="+a+"s":"");
const ytl=l=>"https://www.youtube.com/playlist?list="+l;
const courseUrl=id=>"course.html?id="+id;
const RM=matchMedia("(prefers-reduced-motion: reduce)");
/* انتقال داخل الصفحة نفسها (تغيير الشهر، اختيار يوم) */
function vt(f,type){if(!document.startViewTransition||RM.matches){f();return}
 try{document.startViewTransition({update:f,types:type?[type]:[]})}catch(e){document.startViewTransition(f)}}
let DRAWN=false;   // حركة الدخول المتتابعة في أول رسم فقط، لا عند كل تحديث
const vtn=(el,n)=>{el.style.viewTransitionName=n;el.style.setProperty("view-transition-class","morph")};
const rv=(el,i)=>{if(!DRAWN){el.dataset.rv="";el.style.setProperty("--i",i)}return el};
function img(id,q){const i=E("img");i.loading="lazy";i.decoding="async";i.alt="";i.src="https://i.ytimg.com/vi/"+id+"/"+(q||"mqdefault")+".jpg";
 if(q==="maxresdefault"){const fb=()=>{if(!i.dataset.fb){i.dataset.fb=1;i.src="https://i.ytimg.com/vi/"+id+"/hqdefault.jpg"}};i.onload=()=>{if(i.naturalWidth<=120)fb()};i.onerror=fb}return i}
function lnk(u,cls){const a=E("a",cls);a.href=u;a.target="_blank";a.rel="noopener noreferrer";return a}
function play(){const p=E("span","play");p.append(E("i"));return p}
function thumb(id,u,cls){const a=lnk(u,"th"+(cls?" "+cls:""));a.append(img(id),play());return a}
function playBtn(u,x,cls){const a=lnk(u,"btn "+(cls||"sm navy"));a.textContent="▶ "+x;return a}
const col=d=>d.kind==="s"?CM[d.c].color:REV;
const dlen=d=>d.kind==="s"?d.items.reduce((a,i)=>a+i.b-i.a,0):(d.kind==="review"?20*60*SP:45*60*SP)+(d.pod?d.pod.b-d.pod.a:0);
const itemLabel=i=>i.whole?"كاملة — "+hms(i.L):(i.a?"من "+hms(i.a)+" إلى "+hms(i.b):"من البداية إلى "+hms(i.b))+" (جزء "+nf.format(i.part)+"/"+nf.format(i.parts)+")";
const partName=p=>p===1?"الأول":"الثاني";
function dayTitle(d){if(d.kind==="s")return d.tt;if(d.kind==="review")return"مراجعة الأسبوع";return"المراجعة الختامية للجزء "+partName(d.part)}
const finalTxt=d=>"اربط سلاسل الجزء "+partName(d.part)+" بخريطة ذهنية واحدة، وراجع كل أسئلتك المؤجلة.";
function recap(d){const ids=[...new Set(d.recap||[])];return ids.length?"راجع ملاحظاتك في: "+ids.map(i=>CM[i].title).join("، ")+"، وعوّض أي جلسة فاتتك.":"عوّض أي جلسة فاتتك، وأكمل ملاحظاتك المؤجلة."}
function seriesNo(c){if(c.id==="lec")return"الانطلاق";const cs=C.filter(x=>x.part===c.part&&x.id!=="lec");return"السلسلة "+nf.format(cs.indexOf(c)+1)}
const toggle=n=>{S[n]?delete S[n]:S[n]=1;sv();draw()};
const doneCount=()=>D.filter(d=>S[d.n]).length;
function jump(n){if(PAGE==="calendar"){vt(()=>sel(n),"day");$("calwrap").scrollIntoView({behavior:RM.matches?"auto":"smooth",block:"start"})}else location.href="calendar.html?d="+n}

/* ---------- الرئيسية: جلسة اليوم ---------- */
function todayCard(){const box=$("today");box.textContent="";
 let d=D.find(x=>x.date===T);let lbl="جلسة اليوم — "+(d?d.dow+" "+fd(d.date):"");
 if(!d||S[d.n]){const nx=D.find(x=>!S[x.n]);if(!nx){box.append(E("div","today")).append(E("div","tx","أتممت الخطة كلها، بارك الله فيك."));return}
  if(d)lbl="أنجزت جلسة اليوم — التالية: "+nx.dow+" "+fd(nx.date);else lbl=(T<D[0].date?"تبدأ الخطة ":"أقرب جلسة لم تُنجز: ")+nx.dow+" "+fd(nx.date);d=nx}
 const w=E("div","today");let vid,u;
 if(d.kind==="s"){const i=d.items.find(i=>!i.teaser)||d.items[0];vid=i.vid;u=yt(i.vid,i.a)}else if(d.pod){vid=PM[d.pod.p].vid;u=yt(vid,d.pod.a)}
 if(vid){const a=lnk(u,"ph");a.append(img(vid,"maxresdefault"),play());w.append(a)}
 else{const a=E("div","ph ico","🧭");w.append(a)}
 const t=E("div","tx");t.append(E("div","eyebrow",lbl),E("div","tt",dayTitle(d)));
 if(d.kind==="s"){const c=CM[d.c];t.append(E("div","ss",c.title+" · "+c.who+" · "+mins(dlen(d)/SP)+" دقيقة فعليًا"));t.append(E("div","q","سؤال الجلسة: "+c.goal))}
 else if(d.kind==="review"){t.append(E("div","ss",recap(d)));if(d.pod){const p=PM[d.pod.p];t.append(E("div","q","🎧 استماع خفيف: "+p.title+" — "+p.who+" (جزء "+nf.format(d.pod.part)+"/"+nf.format(d.pod.parts)+")"))}}
 else t.append(E("div","ss",finalTxt(d)));
 if(d.bk){const bk=BM[d.bk];t.append(E("div","ss","📖 قراءة اليوم (٢٠ دقيقة): "+bk.title+" — "+bk.who))}
 const ac=E("div","acts");if(u){const it=d.kind==="s"?(d.items.find(i=>!i.teaser)||d.items[0]):d.pod;ac.append(playBtn(u,it&&it.a?"ابدأ من "+hms(it.a):"شغّل الآن","btn"))}
 const mk=E("button","btn ghost",S[d.n]?"تراجع عن الإنجاز":"✓ أنجزتها");mk.onclick=()=>toggle(d.n);ac.append(mk);
 const go=E("a","btn ghost","مكانها في التقويم");go.href="calendar.html?d="+d.n;ac.append(go);t.append(ac);w.append(t);box.append(rv(w,0))}
function kpis(){const k=$("kpis");k.textContent="";
 const tot=C.reduce((a,c)=>a+c.len,0)+P.reduce((a,p)=>a+p.len,0),done=doneCount();
 [[nf.format(D.length),"يومًا (مع المراجعات)"],[n1.format(tot/3600),"ساعة محتوى"],[n1.format(tot/3600/SP),"ساعة فعليًا بعد التسريع"],[nf.format(C.length-1)+" + "+nf.format(B.length),"سلسلة + كتاب"],[fdy(D[D.length-1].date),"الانتهاء المتوقع"],[nf.format(Math.round(done/D.length*100))+"٪","المنجز حتى الآن"]]
 .forEach(([b,s],i)=>{const e=E("div","kpi");e.append(E("b",null,b),E("span",null,s));k.append(rv(e,i+1))})}
function road(){const r=$("road");r.textContent="";const tr=E("div","track");const N=D.length;
 C.forEach((c,i)=>{const a=E("a");a.href=courseUrl(c.id);a.style.background=c.color;a.title=c.title+" — "+nf.format(c.days.length)+" يوم";
  const nx=C[i+1];a.style.flex=String((nx?nx.days[0]:N+1)-c.days[0]);
  a.append(E("span",null,c.days.length>=10?c.sn:""));const fl=E("i","fill");fl.style.width=(c.days.filter(n=>S[n]).length/c.days.length*100)+"%";a.append(fl);tr.append(a)});
 r.append(tr);
 const ti=D.findIndex(d=>d.date===T);if(ti>=0){const pin=E("div","nowpin"),i=E("i");i.style.right="calc("+(ti+.5)/N*100+"% - 1px)";pin.append(i);r.append(pin)}
 const ms=E("div","months");let cur=null,cnt=0;const parts=[];D.forEach(d=>{const m=d.date.slice(0,7);if(m!==cur){if(cur)parts.push([cur,cnt]);cur=m;cnt=0}cnt++});parts.push([cur,cnt]);
 parts.forEach(([m,c])=>{const s=E("span",null,MO[+m.slice(5)-1]);s.style.flex=c;ms.append(s)});r.append(ms)}
function tiles(){const box=$("tiles");box.textContent="";const td=D.find(d=>d.date===T)||D.find(d=>!S[d.n])||D[0];const cb=td.bk?BM[td.bk]:B[0];
 const curM=MO[+T.slice(5,7)-1];
 [["calendar.html","التقويم","تقويم شهري لكل الأيام: "+nf.format(D.length)+" يومًا، من "+fd(D[0].date)+" إلى "+fd(D[D.length-1].date)+".","ic-cal","شهر "+curM],
  ["courses.html","الدورات",nf.format(C.length-1)+" سلسلة في جزأين، ولكل دورة صفحة بحلقاتها ومواعيدها.","ic-grid",nf.format(C.reduce((a,c)=>a+c.count,0))+" حلقة"],
  ["podcasts.html","البودكاست","خمس حلقات للاستماع الخفيف يوم الجمعة مع المراجعة.","ic-pod","الجمعة"],
  ["books.html","الكتب","خمسة كتب، ٢٠ دقيقة قراءة كل يوم. الآن: "+cb.title+".","ic-book",nf.format(B.length)+" كتب"]]
 .forEach(([h,t,s,ic,tag],i)=>{const a=E("a","tile");a.href=h;const ico=E("span","tico");ico.innerHTML=ICONS[ic];a.append(ico);const x=E("span","tbd");x.append(E("b",null,t),E("span",null,s));a.append(x,E("span","ttag",tag),E("span","tgo","←"));box.append(rv(a,i+1))})}

/* ---------- الدورات ---------- */
function courseCard(c,i){const a=E("a","card");a.href=courseUrl(c.id);a.style.setProperty("--c",c.color);
 const cv=E("span","cv");vtn(cv,"cv-"+c.id);cv.append(img((c.v.find(v=>!v.teaser)||c.v[0]).vid,c.cq||"maxresdefault"),E("span","no",seriesNo(c)),E("span","ct",nf.format(c.count)+(c.id==="lec"?" محاضرة":" حلقة")));a.append(cv);
 const b=E("span","bd");const n=E("span","n",c.title);vtn(n,"tt-"+c.id);b.append(n,E("span","who",c.who+" · "+c.ch));if(c.quote)b.append(E("span","qt",c.quote));
 const st=E("span","stats");[[n1.format(c.len/3600),"ساعة محتوى"],[n1.format(c.len/3600/SP),"ساعة فعليًا"],[nf.format(c.days.length),"يومًا"]].forEach(([x,y])=>{const d=E("span");d.append(E("b",null,x),E("span",null,y));st.append(d)});b.append(st);
 b.append(E("span","range","من "+fd(D[c.days[0]-1].date)+" إلى "+fd(D[c.days[c.days.length-1]-1].date)));
 const pb=E("span","pb"),pi=E("i");pb.append(pi);const dn=c.days.filter(n=>S[n]).length;pi.style.width=dn/c.days.length*100+"%";b.append(pb);
 const pt=E("span","pbt");pt.append(E("span",null,nf.format(dn)+" من "+nf.format(c.days.length)+" يوم"),E("span","more","صفحة الدورة ←"));b.append(pt);
 a.append(b);return rv(a,i)}
function cards(){const host=$("cards");host.textContent="";let i=0;
 [1,2].forEach(part=>{const cs=C.filter(c=>c.part===part);const hh=E("div","ph2");hh.append(E("b",null,"الجزء "+partName(part)));
  const s0=Math.min(...cs.map(c=>c.days[0])),s1=Math.max(...cs.map(c=>c.days[c.days.length-1]));hh.append(E("span",null,fd(D[s0-1].date)+" ← "+fd(D[s1-1].date)+" · "+n1.format(cs.reduce((a,c)=>a+c.len,0)/3600)+" ساعة"));host.append(rv(hh,i++));
  const box=E("div","cards");host.append(box);cs.forEach(c=>box.append(courseCard(c,i++)))})}

/* ---------- صفحة الدورة ---------- */
function coursePage(){const c=CM[Q.get("id")]||C[0];document.title=c.title+" · حصيف";const box=$("course");box.textContent="";box.style.setProperty("--c",c.color);
 const hero=E("section","chero");
 const cv=c.pl?lnk(ytl(c.pl),"ccv"):lnk(yt(c.v[0].vid),"ccv");vtn(cv,"cv-"+c.id);cv.title="افتح على يوتيوب";cv.append(img((c.v.find(v=>!v.teaser)||c.v[0]).vid,c.cq||"maxresdefault"),play());hero.append(cv);
 const tx=E("div","ctx");const bc=E("div","crumb");const ba=E("a",null,"الدورات");ba.href="courses.html";bc.append(ba," / الجزء "+partName(c.part)+" · "+seriesNo(c));tx.append(bc);
 const h=E("h1","ctitle",c.title);vtn(h,"tt-"+c.id);tx.append(h,E("div","cwho",c.who+" · "+c.ch));if(c.quote)tx.append(E("div","qt",c.quote));
 const st=E("div","stats big");[[nf.format(c.count),c.id==="lec"?"محاضرة":"حلقة"],[n1.format(c.len/3600),"ساعة محتوى"],[n1.format(c.len/3600/SP),"ساعة فعليًا"],[nf.format(c.days.length),"يومًا"]].forEach(([x,y])=>{const d=E("div");d.append(E("b",null,x),E("span",null,y));st.append(d)});tx.append(st);
 tx.append(E("div","range","من "+D[c.days[0]-1].dow+" "+fdy(D[c.days[0]-1].date)+" إلى "+D[c.days[c.days.length-1]-1].dow+" "+fdy(D[c.days[c.days.length-1]-1].date)));
 const dn=c.days.filter(n=>S[n]).length,pb=E("div","pb"),pi=E("i");pi.style.width=dn/c.days.length*100+"%";pb.append(pi);tx.append(pb,E("div","pbt",nf.format(dn)+" من "+nf.format(c.days.length)+" يوم منجز"));
 const ac=E("div","acts");if(c.pl)ac.append(playBtn(ytl(c.pl),"قائمة التشغيل على يوتيوب","btn"));const nx=c.days.find(n=>!S[n])||c.days[0];const g=E("a","btn ghost","أقرب جلسة لم تُنجز في التقويم");g.href="calendar.html?d="+nx;ac.append(g);tx.append(ac);
 hero.append(tx);box.append(hero);
 const gq=E("div","goal");gq.append(E("b",null,"سؤال الدورة"),E("span",null,c.goal));box.append(rv(gq,1));if(c.note)box.append(rv(E("p","note",c.note),2));
 box.append(rv(E("h2",null,"جلسات الدورة"),2));const L=E("div","rows");c.days.forEach((n,i)=>L.append(rv(row(D[n-1]),Math.min(i,12)+3)));box.append(L);
 const ix=C.indexOf(c),nav=E("nav","cnav");[[C[ix-1],"الدورة السابقة","prev"],[C[ix+1],"الدورة التالية","next"]].forEach(([o,l,k])=>{if(!o){nav.append(E("span"));return}const a=E("a","cn-"+k);a.href=courseUrl(o.id);a.style.setProperty("--c",o.color);a.append(img((o.v.find(v=>!v.teaser)||o.v[0]).vid));const t=E("span");t.append(E("small",null,l),E("b",null,o.title));a.append(t);nav.append(a)});box.append(nav)}

/* ---------- البودكاست والكتب ---------- */
function pods(){const box=$("podl");box.textContent="";
 P.forEach((p,i)=>{const e=E("div","pod");const cv=lnk(yt(p.vid),"cv");cv.append(img(p.vid,"maxresdefault"),play());e.append(cv);
  const b=E("div","bd");b.append(E("div","n",p.title),E("div","who",p.who+" · "+p.ch+" · "+hms(p.len)));
  const fr=E("div","fr");p.days.forEach(n=>{const a=E("a","fday"+(S[n]?" on":""),fd(D[n-1].date));a.href="calendar.html?d="+n;fr.append(a)});b.append(fr);e.append(b);box.append(rv(e,i))})}
function books(){const box=$("bookl");box.textContent="";
 B.forEach((bk,i)=>{const e=E("div","book");const cv=E("div","cv");const im=E("img");im.src=bk.img;im.alt="غلاف "+bk.title;im.loading="lazy";cv.append(im);e.append(cv);
  const b=E("div","bd");b.append(E("div","no","الكتاب "+nf.format(i+1)),E("div","n",bk.title));if(bk.sub)b.append(E("div","sb",bk.sub));b.append(E("div","who",bk.who));if(bk.quote)b.append(E("div","qt",bk.quote));
  const dn=bk.days.filter(n=>S[n]).length;b.append(E("div","fr","من "+fd(D[bk.days[0]-1].date)+" إلى "+fd(D[bk.days[bk.days.length-1]-1].date)+" · "+nf.format(bk.days.length)+" يومًا"+(dn?" — قرأت "+nf.format(dn):"")));
  const pb=E("div","pb"),pi=E("i");pb.style.setProperty("--c","var(--gold)");pi.style.width=dn/bk.days.length*100+"%";pb.append(pi);b.append(pb);e.append(b);box.append(rv(e,i))})}

/* ---------- سطر اليوم (في التقويم وصفحة الدورة) ---------- */
function match(d){if(F==="all")return true;if(F==="pod")return!!d.pod;if(F==="rev")return d.kind!=="s";return d.c===F}
function row(d){const r=E("div","r"+(d.kind!=="s"?" rev":"")+(S[d.n]?" done":""));r.id="d"+d.n;r.style.setProperty("--c",col(d));if(d.date===T)r.classList.add("now");
 const cb=E("input");cb.type="checkbox";cb.checked=!!S[d.n];cb.setAttribute("aria-label","أنجزت جلسة "+fd(d.date));cb.onchange=()=>toggle(d.n);
 const dt=E("a","d",d.dow);dt.href="calendar.html?d="+d.n;dt.title="افتح في التقويم";dt.append(E("small",null,fd(d.date)));if(d.date===T)dt.append(E("span","td","اليوم"));
 let th;if(d.kind==="s"){const i=d.items.find(i=>!i.teaser)||d.items[0];th=thumb(i.vid,yt(i.vid,i.a),"big")}
 else{th=E("div","th icon big",d.kind==="final"?"🧭":"📝");th.style.setProperty("--c","#E9D9B2")}
 const b=E("div","bx");
 if(d.kind==="s"){const c=CM[d.c];const cc=E("a","cc",c.title);cc.href=courseUrl(c.id);b.append(cc);const h=E("div","t");h.append(E("bdi",null,dayTitle(d)),E("span","m",mins(dlen(d)/SP)+" د"));b.append(h);
  d.items.forEach(i=>{const it=E("div","it");it.append(E("div","s",(d.items.length>1?i.t+" — ":"")+itemLabel(i)),playBtn(yt(i.vid,i.a),i.a?"ابدأ من "+hms(i.a):"شغّل"));b.append(it)});
  b.append(E("div","g",c.goal))}
 else if(d.kind==="review"){const h=E("div","t","📝 مراجعة الأسبوع");h.append(E("span","m","٢٠ د"));b.append(h,E("div","s",recap(d)),E("div","g","اكتب ثلاثة أسطر: أهم ما تغيّر في فهمي هذا الأسبوع."));
  if(d.pod){const p=PM[d.pod.p],pp=E("div","p");pp.append(thumb(p.vid,yt(p.vid,d.pod.a)));const x=E("div");const pt=E("div","t","🎧 استماع خفيف: "+p.title);pt.append(E("span","m",mins((d.pod.b-d.pod.a)/SP)+" د"));
   x.append(pt,E("div","s",p.who+" · "+p.ch+" · جزء "+nf.format(d.pod.part)+"/"+nf.format(d.pod.parts)+": "+(d.pod.a?"من "+hms(d.pod.a):"من البداية")+" إلى "+hms(d.pod.b)));
   const it=E("div","it");it.append(playBtn(yt(p.vid,d.pod.a),d.pod.a?"ابدأ من "+hms(d.pod.a):"شغّل"));x.append(it);pp.append(x);b.append(pp)}}
 else{const h=E("div","t","🧭 "+dayTitle(d));h.append(E("span","m","٤٥ د"));b.append(h,E("div","s",finalTxt(d)),E("div","g","ما الذي سأفعله عمليًا خلال الشهر القادم بناءً على ما سمعت؟"))}
 if(d.bk){const bk=BM[d.bk],rd=E("div","rd");const im=E("img");im.src=bk.img;im.alt="";im.loading="lazy";rd.append(im);const x=E("span");x.append("📖 قراءة ٢٠ دقيقة: ",E("b",null,bk.title)," — "+bk.who);rd.append(x);b.append(rd)}
 r.append(cb,dt,th,b);return r}

/* ---------- التقويم ---------- */
let SEL=null,MON=null;
const BYD={};D.forEach(d=>BYD[d.date]=d);
const MONS=[...new Set(D.map(d=>d.date.slice(0,7)))];
const WD=["السبت","الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة"];
function short(d){if(d.kind==="s"){const it=d.items.find(i=>!i.teaser)||d.items[0];return[CM[d.c].sn,d.tt+(it.parts>1?" · ج"+nf.format(it.part)+"/"+nf.format(it.parts):"")]}
 if(d.kind==="review")return["مراجعة الأسبوع",d.pod?"🎧 "+PM[d.pod.p].who:"عوّض ما فاتك"];
 return["الختام","المراجعة الختامية للجزء "+partName(d.part)]}
function chips(){const box=$("chips");box.textContent="";
 [["all","الكل",null],...C.map(c=>[c.id,c.sn,c.color]),["pod","البودكاست",POD],["rev","المراجعات",REV]].forEach(([id,x,c])=>{const b=E("button","chip");b.setAttribute("aria-pressed",F===id);if(c){b.style.setProperty("--c",c);b.append(E("i"))}b.append(x);
  b.onclick=()=>vt(()=>{F=id;chips();cal()});box.append(b)})}
function goMonth(m,dir){vt(()=>{MON=m;cal()},dir)}
function cal(){
 if(!SEL){const q=+Q.get("d");const t=q&&D[q-1]?D[q-1]:(BYD[T]&&!S[BYD[T].n]?BYD[T]:(D.find(x=>!S[x.n])||D[0]));SEL=t.n}
 if(!MON)MON=D[SEL-1].date.slice(0,7);
 const mt=$("mtabs");mt.textContent="";const mi=MONS.indexOf(MON);
 MONS.forEach((m,k)=>{const ds=D.filter(d=>d.date.startsWith(m)),dn=ds.filter(d=>S[d.n]).length;const b=E("button","mt"+(m===MON?" on":""));
  const bar=E("span","mb"),bi=E("i");bi.style.width=dn/ds.length*100+"%";bar.append(bi);
  b.append(E("b",null,MO[+m.slice(5)-1]),E("small",null,nf.format(dn)+"/"+nf.format(ds.length)),bar);if(m===MON){const pl=E("span","mpill");b.append(pl)}
  b.onclick=()=>{if(m!==MON)goMonth(m,k>mi?"mnext":"mprev")};mt.append(b);if(m===MON)requestAnimationFrame(()=>{const L=mt.getBoundingClientRect(),R=b.getBoundingClientRect();mt.scrollLeft+=R.left-L.left-(L.width-R.width)/2})});
 $("mname").textContent=MO[+MON.slice(5)-1]+" "+yr(MON.slice(0,4));
 const pv=$("mprev"),nx=$("mnext");pv.disabled=mi<=0;nx.disabled=mi>=MONS.length-1;
 pv.onclick=()=>goMonth(MONS[mi-1],"mprev");nx.onclick=()=>goMonth(MONS[mi+1],"mnext");
 const g=$("grid");g.textContent="";
 WD.forEach((w,i)=>g.append(E("div","wh"+(i===6?" fr":""),w)));
 const[y,m]=MON.split("-").map(Number);const off=(new Date(y,m-1,1).getDay()+1)%7;
 for(let k=0;k<off;k++)g.append(E("div","cell pad"));
 const dim=new Date(y,m,0).getDate();
 for(let day=1;day<=dim;day++){const iso=MON+"-"+String(day).padStart(2,"0"),d=BYD[iso];
  const c=E(d?"button":"div","cell"+(d?"":" out"));c.append(E("span","dn",nf.format(day)));
  if(d){c.style.setProperty("--c",col(d));if(d.kind!=="s")c.classList.add("rv");if(S[d.n])c.classList.add("done");if(iso===T)c.classList.add("now");if(d.n===SEL)c.classList.add("sel");if(!match(d))c.classList.add("dim");
   const[t1,t2]=short(d);c.append(E("span","ct",t1),E("span","cs",t2));
   const ft=E("span","cf");ft.append(E("span",null,mins(dlen(d)/SP)+" د"));if(d.bk)ft.append(E("span","bk","📖"));if(S[d.n])ft.append(E("span","ok","✓"));c.append(ft);
   c.title=d.dow+" "+fd(d.date)+" — "+t1+": "+t2;c.setAttribute("aria-label",c.title);
   c.onclick=()=>{if(d.n===SEL)return;vt(()=>{SEL=d.n;cal()},"day");if(innerWidth<=1100)setTimeout(()=>$("det").scrollIntoView({behavior:RM.matches?"auto":"smooth",block:"start"}),60)}}
  g.append(c)}
 const det=$("det");det.textContent="";const d=D[SEL-1];
 const hd=E("div","dh");hd.append(E("b",null,d.dow+" "+fdy(d.date)));
 const nv=E("span","dnav"),p=E("button","nb","→ السابق"),n=E("button","nb","التالي ←");p.disabled=SEL<=1;n.disabled=SEL>=D.length;p.onclick=()=>vt(()=>sel(SEL-1),"day");n.onclick=()=>vt(()=>sel(SEL+1),"day");nv.append(p,n);hd.append(nv);
 det.append(hd,row(d));
 const mk=E("button","btn mk"+(S[d.n]?" on":""),S[d.n]?"✓ أنجزت هذا اليوم (اضغط للتراجع)":"علّم هذا اليوم كمنجز");mk.onclick=()=>toggle(d.n);det.append(mk);
 const tot=doneCount();$("f").style.width=tot/D.length*100+"%";$("c").textContent=nf.format(tot)+" من "+nf.format(D.length)+" يوم منجز"}
function sel(n){SEL=n;MON=D[n-1].date.slice(0,7);cal()}

/* ---------- أيقونات ---------- */
const ICONS={"ic-cal":'<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
 "ic-grid":'<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="2"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2"/></svg>',
 "ic-pod":'<svg viewBox="0 0 24 24"><path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="14" width="4.5" height="7" rx="2"/><rect x="16.5" y="14" width="4.5" height="7" rx="2"/></svg>',
 "ic-book":'<svg viewBox="0 0 24 24"><path d="M12 6.5C10 5 7 4.5 3.5 5v14c3.5-.5 6.5 0 8.5 1.5 2-1.5 5-2 8.5-1.5V5C17 4.5 14 5 12 6.5zM12 6.5V20"/></svg>'};

/* ---------- الرسم ---------- */
function header(){const h=$("hp");if(h)h.textContent=nf.format(Math.round(doneCount()/D.length*100))+"٪ منجز"}
const PAGES={home:()=>{todayCard();kpis();road();tiles()},calendar:()=>{chips();cal()},courses:cards,course:coursePage,podcasts:pods,books:books};
function draw(){header();PAGES[PAGE]();DRAWN=true}
draw();
