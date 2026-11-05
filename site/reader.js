(()=>{'use strict';
const get=k=>{try{return JSON.parse(localStorage.getItem(k))}catch{return null}},set=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};
const root=document.documentElement,body=document.body,reader=body.classList.contains('reader');
const announce=t=>{const s=document.querySelector('#status');if(s)s.textContent=t};

document.querySelectorAll('pre').forEach(pre=>{const code=pre.querySelector('code');if(!code)return;pre.tabIndex=0;pre.setAttribute('role','group');pre.setAttribute('aria-label','Bloco de código');const b=document.createElement('button');b.className='copy';b.textContent='Copiar';b.setAttribute('aria-label','Copiar bloco de código');b.addEventListener('click',async()=>{try{if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(code.textContent)}else{const area=document.createElement('textarea');area.value=code.textContent;area.style.cssText='position:fixed;left:-9999px;top:0';document.body.append(area);area.select();const ok=document.execCommand('copy');area.remove();b.focus();if(!ok)throw new Error('copy')}b.textContent='Copiado';announce('Código copiado.');setTimeout(()=>b.textContent='Copiar',1800)}catch{b.textContent='Selecione o código';announce('Não foi possível copiar. Selecione o código para copiá-lo.')}});pre.append(b)});

const last=get('evidence-position');document.querySelectorAll('.resume').forEach(a=>{if(last&&typeof last.path==='string'&&/^\/ler\/[a-z0-9-]+\/$/.test(last.path)){a.href=last.path+'?retomar=1';a.hidden=false;a.textContent='Continuar de onde parei → '+last.title}});
if(!reader)return;

// Controles só aparecem quando o script está ativo.
const prefs=document.querySelector('.reader-prefs');if(prefs)prefs.hidden=false;

let size=get('evidence-font');if(!Number.isFinite(size))size=20;size=Math.max(17,Math.min(27,size));
function font(){body.style.setProperty('--read-size',size+'px');document.querySelector('#font-down').disabled=size<=17;document.querySelector('#font-up').disabled=size>=27}
font();
document.querySelector('#font-down').onclick=()=>{size=Math.max(17,size-1);font();set('evidence-font',size);announce('Fonte em '+size+' pixels')};
document.querySelector('#font-up').onclick=()=>{size=Math.min(27,size+1);font();set('evidence-font',size);announce('Fonte em '+size+' pixels')};

// O tema inicial já foi aplicado no <head> (preferência salva ou do sistema).
let dark=root.classList.contains('dark');const theme=document.querySelector('#theme');
function apply(){root.classList.toggle('dark',dark);theme.textContent=dark?'Tema claro':'Tema escuro';theme.setAttribute('aria-pressed',String(dark))}
apply();theme.onclick=()=>{dark=!dark;apply();set('evidence-theme',dark?'dark':'light')};

const toc=document.querySelector('.reader-toc');if(matchMedia('(max-width:700px)').matches)toc.open=false;

const article=document.querySelector('article'),bar=document.querySelector('.reading-progress'),fill=bar.firstElementChild;let frame=false,saveTimer=0,ratioNow=0;
function measure(){const top=article.getBoundingClientRect().top+scrollY;const length=Math.max(1,article.offsetHeight-innerHeight+100);const ratio=Math.min(1,Math.max(0,(scrollY-top)/length));return {ratio,top,length}}
function save(){clearTimeout(saveTimer);saveTimer=0;set('evidence-position',{path:location.pathname,title:body.dataset.title,ratio:ratioNow})}
function update(){frame=false;ratioNow=measure().ratio;fill.style.width=(ratioNow*100)+'%';bar.setAttribute('aria-valuenow',String(Math.round(ratioNow*100)));if(!saveTimer)saveTimer=setTimeout(save,500)}
function schedule(){if(!frame){frame=true;requestAnimationFrame(update)}}
addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);addEventListener('pagehide',()=>{ratioNow=measure().ratio;save()});
function restore(){if(new URLSearchParams(location.search).has('retomar')&&last?.path===location.pathname){const {top,length}=measure();scrollTo(0,top+Math.min(1,Math.max(0,last.ratio||0))*length)}update()}
if(document.readyState==='complete')restore();else addEventListener('load',restore,{once:true});
})();
