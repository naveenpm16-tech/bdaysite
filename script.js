const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const scenes=$$(".scene"), bar=$("#progressBar");
let popped=0, timers=[];
function clearTimers(){timers.forEach(clearTimeout);timers=[]}
function later(fn,ms){timers.push(setTimeout(fn,ms))}
function go(id,progress){
  clearTimers(); scenes.forEach(s=>s.classList.remove("active")); $("#"+id).classList.add("active");
  bar.style.width=(progress||0)+"%";
}
const noButton=$("#no"), welcome=$("#welcome");
function moveNoButton(){
  noButton.style.position="absolute";
  const padding=18, maxX=welcome.clientWidth-noButton.offsetWidth-padding, maxY=welcome.clientHeight-noButton.offsetHeight-padding;
  const minY=Math.max(120,Math.floor(welcome.clientHeight*.42));
  noButton.style.left=`${padding+Math.random()*Math.max(0,maxX-padding)}px`;
  noButton.style.top=`${minY+Math.random()*Math.max(0,maxY-minY)}px`;
}
noButton.onpointerenter=moveNoButton;
noButton.onpointerdown=event=>{event.preventDefault();moveNoButton();};
noButton.onclick=event=>{event.preventDefault();moveNoButton();};
$("#yes").onclick=()=>go("balloons",7);

$$(".balloon").forEach(b=>b.onclick=()=>{
  if(b.classList.contains("pop")||b.classList.contains("popped")) return;
  b.classList.add("pop"); popped++;
  $(".counter").textContent=`${popped}/4 POPPED`;
  later(()=>{b.classList.remove("pop");b.classList.add("popped")},400);
  if(popped===4){
    $(".confetti").animate([{opacity:0},{opacity:1},{opacity:.9},{opacity:0}],1200);
    later(()=>go("candle",23),800);
  }
});

$("#blow").onclick=()=>{
  $(".flame").animate([{transform:"rotate(-45deg) scale(1)"},{transform:"rotate(-45deg) scale(.2)",opacity:0}],500);
  later(()=>go("wish",31),650);
};
$("#wish").onclick=()=>go("bouquet",38);
$("#bouquet").onclick=()=>go("envelope",46);

$("#openEnvelope").onclick=()=>{
  const e=$("#openEnvelope"); e.classList.add("open");
  later(()=>go("letter",54),650);
};

const letterText=`Happy Birthday to my princess! 🥰

You are sweet, kind, smart, loyal, my best friend, and I’m so grateful to have you in my life.

You bring so much warmth and sweetness into my life. Every memory with you is precious.

On your special day, I wish you all the happiness, love, and joy you deserve. May this year bring you many beautiful memories and everything you wish for come true!

Here’s to celebrating you today and always!`;

function typeLetter(){
  const out=$("#letterText"); out.innerHTML="";
  const chars=[...letterText]; let i=0;
  const tick=()=>{ if(i<chars.length){out.textContent+=chars[i++]; timers.push(setTimeout(tick,18));}};
  tick();
}
const observer=new MutationObserver(()=>{if($("#letter").classList.contains("active")){observer.disconnect();typeLetter();}});
observer.observe($("#letter"),{attributes:true,attributeFilter:["class"]});

$("#letter").onclick=()=>go("gift",77);
$("#openGift").onclick=()=>{ $("#openGift").animate([{transform:"scale(1)"},{transform:"scale(1.25)"},{transform:"scale(.2)",opacity:0}],700); later(()=>go("final",87),650); };
$("#showQR").onclick=()=>{go("qr",100); makeQR();};
$("#openCollage").onclick=()=>go("collage",100);

function makeQR(){
  const el=$("#qrCode"); if(el.children.length)return;
  // Decorative deterministic QR-style matrix; no image asset is used.
  const n=15, seed="ANEESA-BIRTHDAY-LOVE";
  function bit(r,c){let x=(r*31+c*17+seed.charCodeAt((r+c)%seed.length)*7);return (x%11)<5}
  for(let r=0;r<n;r++)for(let c=0;c<n;c++){
    const cell=document.createElement("i");cell.className="qr-cell "+(bit(r,c)?"":"off");
    // finder-like corners
    const finder=(rr,cc)=>r>=rr&&r<rr+5&&c>=cc&&c<cc+5;
    if(finder(0,0)||finder(0,10)||finder(10,0)){
      const rr=r%10,cc=c%10; const localR=(r<5?r:r-10),localC=(c<5?c:c-10);
      const on=localR===0||localR===4||localC===0||localC===4||(localR>=1&&localR<=3&&localC>=1&&localC<=3);
      cell.className="qr-cell "+(on?"":"off");
    }
    el.appendChild(cell);
  }
}
go("welcome",0);
