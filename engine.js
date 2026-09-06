export const SIZE = 20;
export const DIRECTIONS = { up: {x:0,y:-1}, down:{x:0,y:1}, left:{x:-1,y:0}, right:{x:1,y:0} };
export const same = (a,b) => a.x === b.x && a.y === b.y;
export function placeFood(snake, random = Math.random) {
  const free=[];
  for(let y=0;y<SIZE;y++) for(let x=0;x<SIZE;x++) if(!snake.some(p=>same(p,{x,y}))) free.push({x,y});
  return free.length ? free[Math.floor(random()*free.length)] : null;
}
export function createGame(random = Math.random) {
  const snake=[{x:8,y:10},{x:7,y:10},{x:6,y:10}];
  return {snake, direction:'right', queue:[], food:placeFood(snake,random), score:0, status:'ready'};
}
export function turn(game, direction) {
  if(game.status !== 'running' || !DIRECTIONS[direction] || game.queue.length>=2) return;
  const last=game.queue.at(-1) || game.direction;
  const a=DIRECTIONS[last],b=DIRECTIONS[direction];
  if(direction!==last && !(a.x+b.x===0 && a.y+b.y===0)) game.queue.push(direction);
}
export function step(game, random = Math.random) {
  if(game.status!=='running') return;
  game.direction=game.queue.shift() || game.direction;
  const d=DIRECTIONS[game.direction], head={x:game.snake[0].x+d.x,y:game.snake[0].y+d.y};
  const eating=game.food && same(head,game.food);
  const body=eating ? game.snake : game.snake.slice(0,-1);
  if(head.x<0 || head.y<0 || head.x>=SIZE || head.y>=SIZE || body.some(p=>same(p,head))) {game.status='over';return;}
  game.snake.unshift(head);
  if(eating) {game.score+=10;game.food=placeFood(game.snake,random);if(!game.food)game.status='won';}
  else game.snake.pop();
}
