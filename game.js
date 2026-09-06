import {SIZE,DIRECTIONS,createGame,turn,step} from './engine.js';
const $=id=>document.getElementById(id), canvas=$('board'),ctx=canvas.getContext('2d');
const speeds={chill:180,classic:125,fast:80};
const notes={chill:'Take the scenic route. Every bite can wait.',classic:'The original rhythm. A little room to think.',fast:'Quick bites. Quicker decisions.'};
let level='classic',game=createGame(),last=0,bests={};
try { const saved=JSON.parse(localStorage.getItem('snake-bests') || '{}'); if(saved && typeof saved==='object') bests=saved; } catch {}
function best(){const n=Number(bests[level]);return Number.isFinite(n)&&n>0?n:0;}
function sync(){
  $('score').textContent=String(game.score).padStart(3,'0');$('best').textContent=String(best()).padStart(3,'0');
  $('pause').disabled=!['running','paused'].includes(game.status);
  $('pause').textContent=game.status==='paused'?'▶':'Ⅱ';$('pause').setAttribute('aria-label',game.status==='paused'?'Resume game':'Pause game');
  $('state').textContent={ready:'READY WHEN YOU ARE',running:'MAKE EVERY BITE COUNT',paused:'TAKE A BREATHER',over:'THERE’S ALWAYS ANOTHER ROUND',won:'THE WHOLE BOARD. ALL YOURS.'}[game.status];
  document.querySelectorAll('[data-level]').forEach(b=>b.disabled=game.status==='running'||game.status==='paused');
  $('overlay').hidden=game.status==='running';
  if(game.status!=='running'){
    const copy={ready:['Got an appetite?','A little focus. A lot of snake.','Let’s play'],paused:['Take a breather.','Your next bite will be waiting.','Resume'],over:['One more round?','You scored '+game.score+' points. Hungry for more?','Play again'],won:['Well fed. Well played.','400 cells. One very satisfied snake.','Play again']}[game.status];
    $('title').textContent=copy[0];$('message').textContent=copy[1];$('play').textContent=copy[2]+' ↗';
    $('announcement').textContent=copy[0]+' '+copy[1];
  }
}
function start(){game=createGame();game.status='running';last=performance.now();sync();draw();canvas.focus({preventScroll:true});}
function toggle(){if(game.status==='running'){game.status='paused';}else if(game.status==='paused'){game.status='running';last=performance.now();}else{start();return;}sync();}
function draw(){
  const c=canvas.width/SIZE;ctx.fillStyle='#151e13';ctx.fillRect(0,0,600,600);
  ctx.strokeStyle='#263222';ctx.lineWidth=1;
  for(let i=1;i<SIZE;i++){ctx.beginPath();ctx.moveTo(i*c,0);ctx.lineTo(i*c,600);ctx.stroke();ctx.beginPath();ctx.moveTo(0,i*c);ctx.lineTo(600,i*c);ctx.stroke();}
  if(game.food){ctx.fillStyle='#f49173';ctx.shadowColor='#f4917377';ctx.shadowBlur=16;ctx.beginPath();ctx.roundRect(game.food.x*c+7,game.food.y*c+7,c-14,c-14,5);ctx.fill();ctx.shadowBlur=0;}
  game.snake.forEach((p,i)=>{ctx.fillStyle=i===0?'#d5ff8b':`hsl(83 65% ${Math.max(40,65-i*.7)}%)`;ctx.beginPath();ctx.roundRect(p.x*c+2,p.y*c+2,c-4,c-4,i===0?7:4);ctx.fill();});
  const h=game.snake[0],d=DIRECTIONS[game.direction],px=-d.y,py=d.x;
  ctx.fillStyle='#17200d';for(const sign of [-1,1]){ctx.beginPath();ctx.arc(h.x*c+c/2+d.x*6+px*sign*5,h.y*c+c/2+d.y*6+py*sign*5,2.5,0,Math.PI*2);ctx.fill();}
}
function frame(now){if(game.status==='running' && now-last>=speeds[level]){last=now;const oldScore=game.score;step(game);if(game.score>best()){bests[level]=game.score;try{localStorage.setItem('snake-bests',JSON.stringify(bests));}catch{}}if(game.score!==oldScore||game.status!=='running')sync();draw();}requestAnimationFrame(frame);}
$('play').addEventListener('click',toggle);$('pause').addEventListener('click',toggle);
document.querySelectorAll('[data-level]').forEach(button=>button.addEventListener('click',()=>{level=button.dataset.level;document.querySelectorAll('[data-level]').forEach(b=>{b.classList.toggle('selected',b===button);b.setAttribute('aria-pressed',String(b===button));});$('pace-note').textContent=notes[level];game=createGame();sync();draw();}));
const keys={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',w:'up',s:'down',a:'left',d:'right'};
document.addEventListener('keydown',event=>{if(event.ctrlKey||event.metaKey||event.altKey)return;const key=event.key.length===1?event.key.toLowerCase():event.key;if(key===' '&&event.target.closest('button,a'))return;if(keys[key]){event.preventDefault();turn(game,keys[key]);}else if(key===' '||key==='Escape'){event.preventDefault();if(!event.repeat && (key===' '||['running','paused'].includes(game.status)))toggle();}else if(key==='r'&&!event.repeat){event.preventDefault();start();}});
document.querySelectorAll('[data-direction]').forEach(b=>b.addEventListener('click',()=>turn(game,b.dataset.direction)));
let touch=null;
$('board-wrap').addEventListener('pointerdown',e=>{touch={x:e.clientX,y:e.clientY};});
$('board-wrap').addEventListener('pointerup',e=>{if(!touch)return;const dx=e.clientX-touch.x,dy=e.clientY-touch.y;touch=null;if(Math.max(Math.abs(dx),Math.abs(dy))<15)return;turn(game,Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up'));});
$('board-wrap').addEventListener('pointercancel',()=>touch=null);
function autoPause(){if(game.status==='running'){game.status='paused';sync();}}
document.addEventListener('visibilitychange',()=>{if(document.hidden)autoPause();});window.addEventListener('blur',autoPause);
sync();draw();requestAnimationFrame(frame);
