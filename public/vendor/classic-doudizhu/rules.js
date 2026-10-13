(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.Doudizhu=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const NAMES=['你','川叔','蓉姐'], SUITS=['♠','♥','♣','♦'];
  const rank=id=>id===52?16:id===53?17:Math.floor(id/4)+3;
  const suit=id=>id>=52?-1:id%4;
  const face=r=>({11:'J',12:'Q',13:'K',14:'A',15:'2',16:'小王',17:'大王'}[r]||String(r));
  const label=id=>id>=52?face(rank(id)):SUITS[suit(id)]+face(rank(id));
  const sort=hand=>hand.sort((a,b)=>rank(b)-rank(a)||suit(a)-suit(b));
  function shuffle(random=Math.random){const d=Array.from({length:54},(_,i)=>i);for(let i=53;i>0;i--){const j=Math.floor(random()*(i+1));[d[i],d[j]]=[d[j],d[i]];}return d;}
  function groups(cards){const map=new Map();for(const id of cards){const r=rank(id);if(!map.has(r))map.set(r,[]);map.get(r).push(id);}return [...map.entries()].sort((a,b)=>a[0]-b[0]);}
  const consecutive=rs=>rs.every((r,i)=>!i||r===rs[i-1]+1);
  const TYPES={single:'单张',pair:'对子',triple:'三张',tripleSingle:'三带一',triplePair:'三带一对',straight:'顺子',pairStraight:'连对',airplane:'飞机',airplaneSingle:'飞机带单',airplanePair:'飞机带对',fourSingle:'四带二单',fourPair:'四带两对',bomb:'炸弹',rocket:'王炸'};
  function classify(cards){
    if(!cards.length||new Set(cards).size!==cards.length||cards.some(id=>!Number.isInteger(id)||id<0||id>53))return null;
    const gs=groups(cards), rs=gs.map(x=>x[0]), sizes=gs.map(x=>x[1].length), n=cards.length;
    const result=(type,main,chain=1)=>({type,main,chain,count:n,name:TYPES[type]});
    if(n===2&&rs[0]===16&&rs[1]===17)return result('rocket',17);
    if(gs.length===1){if(n===1)return result('single',rs[0]);if(n===2)return result('pair',rs[0]);if(n===3)return result('triple',rs[0]);if(n===4)return result('bomb',rs[0]);}
    if(n===4&&sizes.includes(3))return result('tripleSingle',gs.find(x=>x[1].length===3)[0]);
    if(n===5&&gs.length===2&&sizes.includes(3)&&sizes.includes(2))return result('triplePair',gs.find(x=>x[1].length===3)[0]);
    if(n>=5&&sizes.every(x=>x===1)&&rs.at(-1)<=14&&consecutive(rs))return result('straight',rs.at(-1),n);
    if(n>=6&&n%2===0&&sizes.every(x=>x===2)&&rs.at(-1)<=14&&consecutive(rs))return result('pairStraight',rs.at(-1),n/2);
    if(n>=6&&n%3===0&&sizes.every(x=>x===3)&&rs.at(-1)<=14&&consecutive(rs))return result('airplane',rs.at(-1),n/3);
    const four=gs.find(x=>x[1].length===4);
    if(four){const rest=gs.filter(x=>x!==four);if(n===6&&rest.length===2&&rest.every(x=>x[1].length===1)&&!rest.every(x=>x[0]>=16))return result('fourSingle',four[0]);if(n===8&&rest.length===2&&rest.every(x=>x[1].length===2))return result('fourPair',four[0]);}
    for(const [type,unit] of [['airplaneSingle',4],['airplanePair',5]]){
      if(n%unit)continue;const k=n/unit;if(k<2)continue;
      for(let start=3;start+k-1<=14;start++){
        const main=Array.from({length:k},(_,i)=>start+i);
        if(!main.every(r=>gs.some(x=>x[0]===r&&x[1].length===3)))continue;
        const rest=gs.filter(x=>!main.includes(x[0]));
        if(rest.length!==k||!rest.every(x=>x[1].length===(unit===4?1:2)))continue;
        if(type==='airplaneSingle'&&rest.some(x=>x[0]===16)&&rest.some(x=>x[0]===17))continue;
        return result(type,start+k-1,k);
      }
    }
    return null;
  }
  function beats(a,b){
    if(!a)return false;if(!b)return true;if(b.type==='rocket')return false;if(a.type==='rocket')return true;
    if(a.type==='bomb')return b.type!=='bomb'||a.main>b.main;
    if(b.type==='bomb')return false;
    return a.type===b.type&&a.count===b.count&&a.chain===b.chain&&a.main>b.main;
  }
  function combinations(items,k){const out=[];function walk(start,chosen){if(chosen.length===k){out.push(chosen.slice());return;}for(let i=start;i<=items.length-k+chosen.length;i++){chosen.push(items[i]);walk(i+1,chosen);chosen.pop();}}walk(0,[]);return out;}
  const moveCache=new Map();
  function moves(hand,target=null){
    const key=hand.slice().sort((a,b)=>a-b).join(','), cached=moveCache.get(key);let out=cached;
    if(!out){
      out=[];const gs=groups(hand), m=new Map(gs), seen=new Set();
      function add(cards){const c=classify(cards);if(!c)return;const ck=cards.slice().sort((a,b)=>a-b).join(',');if(seen.has(ck))return;seen.add(ck);out.push({...c,cards});}
      for(const [r,ids] of gs){for(let n=1;n<=ids.length;n++)add(ids.slice(0,n));
        if(ids.length>=3){for(const [s,other] of gs)if(s!==r){add(ids.slice(0,3).concat(other[0]));if(other.length>=2)add(ids.slice(0,3).concat(other.slice(0,2)));}}
        if(ids.length===4){const rest=gs.filter(x=>x[0]!==r);for(const wings of combinations(rest,2)){add(ids.concat(wings.map(x=>x[1][0])));if(wings.every(x=>x[1].length>=2))add(ids.concat(wings.flatMap(x=>x[1].slice(0,2))));}}
      }
      if(m.has(16)&&m.has(17))add([52,53]);
      for(const [unit,minLength] of [[1,5],[2,3],[3,2]])for(let start=3;start<=14;start++){
        for(let end=start;end<=14&&m.get(end)?.length>=unit;end++){
          const k=end-start+1;if(k<minLength)continue;const rs=Array.from({length:k},(_,i)=>start+i), main=rs.flatMap(r=>m.get(r).slice(0,unit));add(main);
          if(unit===3){const rest=gs.filter(x=>!rs.includes(x[0]));for(const wings of combinations(rest,k))add(main.concat(wings.map(x=>x[1][0])));
            for(const wings of combinations(rest.filter(x=>x[1].length>=2),k))add(main.concat(wings.flatMap(x=>x[1].slice(0,2))));}
        }
      }
      if(moveCache.size>1000)moveCache.clear();moveCache.set(key,out);
    }
    return target?out.filter(m=>beats(m,target)):out.slice();
  }
  function delay(random=Math.random){return 500+Math.floor(random()*1001);}
  class Game{
    constructor({random=Math.random,totals=[0,0,0],round=1,starter=0}={}){
      this.random=random;this.round=round;this.totals=totals.slice();this.starter=starter;this.logs=[];this.redeals=0;this.deal();
    }
    deal(){
      const d=shuffle(this.random);this.players=NAMES.map(name=>({name,hand:[],role:null,plays:0,last:null,delta:0}));
      for(let i=0;i<51;i++)this.players[i%3].hand.push(d[i]);this.players.forEach(p=>sort(p.hand));this.kitty=d.slice(51);
      this.phase='bid';this.turn=this.starter;this.bidCount=0;this.highBid=0;this.highBidder=null;this.bids=[null,null,null];this.landlord=null;
      this.target=null;this.leader=null;this.passes=0;this.played=[];this.multiplier=1;this.bombs=0;this.winner=null;this.spring=null;
      this.log('第 '+this.round+' 局'+(this.redeals?'重新发牌':'开桌')+'，'+NAMES[this.starter]+'先叫分。');
    }
    log(text){this.logs.push(text);}
    bid(score){
      if(this.phase!=='bid'||![0,1,2,3].includes(score)||score!==0&&score<=this.highBid)return false;
      const i=this.turn;this.bids[i]=score;this.bidCount++;this.log(NAMES[i]+(score?'叫 '+score+' 分。':'不叫。'));
      if(score>this.highBid){this.highBid=score;this.highBidder=i;}
      if(score===3||this.bidCount===3){
        if(this.highBidder==null){this.log('三家都不叫，重新洗牌。');this.redeals++;this.starter=(this.starter+1)%3;this.deal();}
        else{this.landlord=this.highBidder;this.players.forEach((p,j)=>p.role=j===this.landlord?'landlord':'farmer');this.players[this.landlord].hand.push(...this.kitty);sort(this.players[this.landlord].hand);this.phase='play';this.turn=this.landlord;this.log(NAMES[this.landlord]+'成为地主，拿走三张底牌，底分 '+this.highBid+'。');}
      }else this.turn=(i+1)%3;return true;
    }
    team(i){return i===this.landlord?'landlord':'farmer';}
    play(ids){
      if(this.phase!=='play'||!ids.length||new Set(ids).size!==ids.length)return false;
      const p=this.players[this.turn];if(ids.some(id=>!p.hand.includes(id)))return false;
      const combo=classify(ids);if(!beats(combo,this.target))return false;
      const from=this.turn;for(const id of ids)p.hand.splice(p.hand.indexOf(id),1);
      p.plays++;p.last={cards:ids.slice(),...combo};this.played.push({from,cards:ids.slice(),...combo});this.target=p.last;this.leader=from;this.passes=0;
      if(combo.type==='bomb'||combo.type==='rocket'){this.multiplier*=2;this.bombs++;this.log(NAMES[from]+'打出'+combo.name+'，倍数 ×'+this.multiplier+'。');}
      else this.log(NAMES[from]+'打出'+combo.name+'（'+ids.map(label).join(' ')+'）。');
      if(!p.hand.length)this.end(from);else this.turn=(from+1)%3;return true;
    }
    pass(){
      if(this.phase!=='play'||!this.target||this.leader===this.turn)return false;
      const from=this.turn;this.players[from].last={pass:true};this.log(NAMES[from]+'不出。');this.passes++;
      if(this.passes===2){this.turn=this.leader;this.target=null;this.passes=0;this.players.forEach(p=>p.last=null);this.log(NAMES[this.turn]+'获得新一轮出牌权。');}
      else this.turn=(from+1)%3;return true;
    }
    end(winner){
      this.winner=winner;const lordWins=winner===this.landlord;
      if(lordWins&&this.players.every((p,i)=>i===this.landlord||p.plays===0))this.spring='春天';
      else if(!lordWins&&this.players[this.landlord].plays===1)this.spring='反春天';
      if(this.spring){this.multiplier*=2;this.log(this.spring+'，倍数再翻倍。');}
      const stake=this.highBid*this.multiplier;
      this.players.forEach((p,i)=>{p.delta=i===this.landlord?(lordWins?2:-2)*stake:(lordWins?-1:1)*stake;this.totals[i]+=p.delta;});
      this.phase='ended';this.log((lordWins?'地主':'农民')+'获胜，底分 '+this.highBid+' × '+this.multiplier+' 倍 = 每位农民 '+stake+' 分。');
    }
  }
  function chooseBid(game,i=game.turn){
    let strength=0;const gs=groups(game.players[i].hand);
    for(const [r,ids] of gs){if(r===17)strength+=7;else if(r===16)strength+=5;else if(r===15)strength+=ids.length*3;else if(r===14)strength+=ids.length*1.3;if(ids.length===4)strength+=7;else if(ids.length===3)strength+=1.5;}
    if(gs.some(x=>x[0]===16)&&gs.some(x=>x[0]===17))strength+=5;
    const wanted=strength>=22?3:strength>=15?2:strength>=9?1:0;return wanted>game.highBid?wanted:0;
  }
  // A fast structural estimate: pack long runs, then triples/pairs, without looking at hidden cards.
  function handCost(hand){
    if(!hand.length)return 0;
    const base=groups(hand), initial=new Map(base.map(([r,ids])=>[r,ids.length]));let best=Infinity;
    for(const order of [[3,2,1],[1,3,2],[2,3,1]]){
      const c=new Map(initial);let turns=0;
      for(const unit of order){const min=unit===1?5:unit===2?3:2;
        for(let start=3;start<=14;start++){
          let end=start;while(end<=14&&(c.get(end)||0)>=unit)end++;
          if(end-start>=min){for(let r=start;r<end;r++)c.set(r,c.get(r)-unit);turns++;start--;}
        }
      }
      let trip=0,singles=0,pairs=0;
      for(const n of c.values()){if(n===4)turns++;else if(n===3)trip++;else if(n===2)pairs++;else if(n===1)singles++;}
      const attached=Math.min(trip,singles+pairs);turns+=trip+singles+pairs-attached;
      if((c.get(16)||0)&&(c.get(17)||0))turns--;
      best=Math.min(best,turns);
    }return best;
  }
  function chooseMove(game,i=game.turn){
    const p=game.players[i], options=moves(p.hand,game.target);if(!options.length)return null;
    const finish=options.find(m=>m.cards.length===p.hand.length);if(finish)return finish;
    const enemy=game.players.map((other,j)=>({j,size:other.hand.length})).filter(x=>x.j!==i&&game.team(x.j)!==game.team(i));
    const urgent=enemy.some(x=>x.size<=2);
    if(game.target&&game.team(game.leader)===game.team(i))return null;
    const mate=game.players.find((other,j)=>j!==i&&game.team(j)===game.team(i));
    if(!game.target&&mate?.hand.length===1&&!urgent){const singles=options.filter(m=>m.type==='single');return singles.sort((a,b)=>a.main-b.main)[0];}
    let viable=options;
    const normal=options.filter(m=>m.type!=='bomb'&&m.type!=='rocket');
    if(game.target&&normal.length)viable=normal;
    if(game.target&&!normal.length&&!urgent&&p.hand.length>7&&enemy.every(x=>x.size>4))return null;
    if(!game.target&&enemy.some(x=>x.size===1)&&options.some(m=>m.count>1))viable=options.filter(m=>m.count>1);
    const scored=viable.map(m=>{
      const rest=p.hand.filter(id=>!m.cards.includes(id));let penalty=handCost(rest)*18+m.main*.28-m.count*.35;
      if(m.type==='bomb'||m.type==='rocket')penalty+=18;
      const before=new Map(groups(p.hand).map(([r,ids])=>[r,ids.length])), used=new Map(groups(m.cards).map(([r,ids])=>[r,ids.length]));
      for(const [r,n] of used)if(before.get(r)===4&&n<4)penalty+=14;
      if(!game.target&&m.type==='single'&&m.main>=15)penalty+=6;
      if(game.target&&urgent&&m.type==='single')penalty-=m.main*.65;
      return {move:m,value:penalty};
    });
    scored.sort((a,b)=>a.value-b.value||a.move.main-b.move.main);return scored[0].move;
  }
  return {NAMES,SUITS,rank,suit,face,label,sort,shuffle,groups,classify,beats,moves,delay,Game,chooseBid,handCost,chooseMove,TYPES};
});
