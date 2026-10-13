(()=>{
  'use strict';const D=Doudizhu,$=id=>document.getElementById(id);let game=new D.Game(),selected=[],timer=null,toast='',hintIndex=0,resultShown=false;
  const signed=n=>n>0?'+'+n:String(n);
  function cardHTML(id,cls='',interactive=false){const r=D.rank(id),s=D.suit(id),red=s===1||s===3||r===17,portrait=r>=11&&r<=13;const tag=interactive?'button':'span';return `<${tag} class="card ${red?'red':''} ${r>=16?'joker':''} ${cls}" ${interactive?`data-card="${id}" aria-label="${D.label(id)}" aria-pressed="${selected.includes(id)}"`:''}><span class="corner"><span>${D.face(r)}</span>${r<16?'<span class="suit">'+D.SUITS[s]+'</span>':''}</span>${portrait?`<img class="portrait" src="assets/court-${D.face(r).toLowerCase()}.webp" alt="" draggable="false">`:`<span class="center-suit">${r>=16?'♛':D.SUITS[s]}</span>`}${r<16?'<span class="bottom-corner">'+D.face(r)+'</span>':''}</${tag}>`;}
  function playerHTML(i){const p=game.players[i],role=p.role==='landlord'?'地主':p.role==='farmer'?'农民':'待定';return `<div class="player-head ${game.turn===i&&game.phase!=='ended'?'active':''}"><span class="avatar">${['你','川','蓉'][i]}</span><span class="player-name">${p.name}${i?' · AI':''}</span><span class="role ${p.role||''}">${role}</span></div><p class="player-meta">${p.hand.length} 张${p.role==='farmer'&&game.players[0].role==='farmer'&&i!==0?' · 你的队友':''}${p.hand.length<=2&&p.role?' · 报警':''}</p>`;}
  const button=(text,action,primary=false)=>`<button class="${primary?'primary':'quiet'}" data-action="${action}">${text}</button>`;
  function schedule(){clearTimeout(timer);timer=null;if(game.phase==='ended'||game.turn===0)return;timer=setTimeout(()=>{if(game.phase==='bid')game.bid(D.chooseBid(game));else{const move=D.chooseMove(game);if(move)game.play(move.cards);else game.pass();}selected=[];toast='';hintIndex=0;render();schedule();},D.delay());}
  function render(){
    $('round').textContent='第 '+game.round+' 局';$('base').textContent=game.phase==='bid'?'最高叫分 '+game.highBid:'底分 '+game.highBid;$('multiple').textContent='× '+game.multiplier+' 倍';
    $('kitty-title').textContent=game.landlord==null?'三张底牌 · 叫分后公开':'地主底牌 · 全局公开';$('kitty').innerHTML=game.landlord==null?Array(3).fill('<span class="card-back"></span>').join(''):game.kitty.map(id=>cardHTML(id,'small')).join('');
    for(let i=0;i<3;i++){$('seat-'+i).innerHTML=playerHTML(i)+(i?'<div class="backs">'+Array(Math.min(20,game.players[i].hand.length)).fill('<span class="back"></span>').join('')+'</div>':'');}
    for(const i of [1,2]){const last=game.players[i].last;$('recent-'+i).innerHTML=last?.pass?'<p>'+D.NAMES[i]+' · 不出</p>':last?'<p>'+D.NAMES[i]+' · '+last.name+'</p>':'';}
    $('hand').innerHTML=game.players[0].hand.map(id=>cardHTML(id,selected.includes(id)?'selected':'',true)).join('');
    const combo=D.classify(selected);$('selected-label').textContent=selected.length?(combo?combo.name+' · '+selected.length+' 张':'已选 '+selected.length+' 张 · 尚未组成牌型'):'未选牌';
    $('target').innerHTML=game.target?game.target.cards.slice().sort((a,b)=>D.rank(a)-D.rank(b)).map(id=>cardHTML(id,'table-card')).join(''):'';
    $('target-caption').textContent=game.target?D.NAMES[game.leader]+' · '+game.target.name+' · 主体 '+D.face(game.target.main):game.phase==='play'?'新一轮，自由领出':'';
    $('scores').innerHTML=game.players.map((p,i)=>`<div class="score-row"><span>${p.name}<small>${p.role==='landlord'?'地主':p.role==='farmer'?'农民':'等待叫分'}</small></span><b class="${game.totals[i]<0?'negative':''}">${signed(game.totals[i])}</b></div>`).join('');
    $('log').innerHTML=game.logs.slice(-35).reverse().map(t=>'<li>'+t+'</li>').join('');
    let prompt,hint,actions='',status;
    if(game.phase==='bid'){status='轮到'+D.NAMES[game.turn]+'叫分';if(game.turn===0){prompt='你想叫几分？';hint='叫分必须高于当前 '+game.highBid+' 分；叫 3 分立即确定地主。';actions=button('不叫','bid:0')+[1,2,3].filter(n=>n>game.highBid).map(n=>button(n+' 分','bid:'+n,n===3)).join('');}else{prompt=D.NAMES[game.turn]+'正在叫分…';hint='一人叫一次，三家都不叫就重新洗牌。';}}
    else if(game.phase==='ended'){status=game.winner===game.landlord?'地主获胜':'农民获胜';prompt=game.players[0].role===(game.winner===game.landlord?'landlord':'farmer')?'这局，你赢了！':'这局，下一把再战';hint='本局积分已结算，可查看剩余手牌与翻倍明细。';actions=button('查看结算','result')+button('下一局','next',true);}
    else{status='轮到'+D.NAMES[game.turn]+(game.target?'接牌':'领出');if(game.turn===0){prompt=game.target?'轮到你接牌':'你来领出这一轮';hint=game.target?'同类型、同张数才能压；炸弹和王炸除外。':'新一轮可出任意合法牌型，不能不出。';actions=button('提示','hint')+button('清空','clear')+(game.target?button('不出','pass'):'')+button('出牌','play',true);}else{prompt=D.NAMES[game.turn]+'正在思考…';hint=game.players[0].role==='farmer'?'农民一起争胜，留意队友余牌和地主的节奏。':'你是地主，要先于两名农民出完手牌。';}}
    $('status').textContent=status;$('prompt').textContent=prompt;$('hint').textContent=toast||hint;$('hint').className=toast?'toast':'';$('actions').innerHTML=actions;
    if(game.phase==='ended'&&!resultShown){resultShown=true;showResult();}
  }
  function showResult(){const lordWins=game.winner===game.landlord;$('result-title').textContent=(lordWins?'地主获胜':'农民获胜')+(game.spring?' · '+game.spring:'');$('result-summary').textContent=D.NAMES[game.winner]+'先出完所有手牌。底分 '+game.highBid+'，炸弹 / 王炸 '+game.bombs+' 次'+(game.spring?'，'+game.spring+'翻倍':'')+'，最终 ×'+game.multiplier+' 倍。每位农民输赢 '+game.highBid*game.multiplier+' 分，地主输赢其两倍。';$('result-scores').innerHTML=game.players.map((p,i)=>`<div class="score-row"><span>${p.name} · ${p.role==='landlord'?'地主':'农民'}</span><span>本局 <b class="${p.delta<0?'negative':''}">${signed(p.delta)}</b>　累计 ${signed(game.totals[i])}</span></div>`).join('');$('result-hands').innerHTML=game.players.map(p=>'<h3>'+p.name+' · 剩 '+p.hand.length+' 张</h3><div class="revealed-cards">'+(p.hand.length?p.hand.map(id=>cardHTML(id,'small')).join(''):'已全部出完')+'</div>').join('');$('result-dialog').showModal();}
  function nextRound(reset=false){clearTimeout(timer);if($('result-dialog').open)$('result-dialog').close();game=new D.Game(reset?{}:{totals:game.totals,round:game.round+1,starter:(game.starter+1)%3});selected=[];toast='';hintIndex=0;resultShown=false;render();schedule();}
  function act(value){const [type,raw]=value.split(':');toast='';let ok=true;
    if(type==='bid'){ok=game.turn===0&&game.bid(Number(raw));}
    else if(type==='play'){if(game.turn!==0||game.phase!=='play')return;const c=D.classify(selected);if(!selected.length){toast='先选中要出的牌。';ok=false;}else if(!c){toast='这些牌不构成合法牌型，请调整选择。';ok=false;}else if(!D.beats(c,game.target)){toast='压不过上一手：需要相同牌型和张数，且主体更大。';ok=false;}else ok=game.play(selected);}
    else if(type==='pass'){ok=game.turn===0&&game.pass();if(!ok)toast='新一轮领出不能不出。';}
    else if(type==='clear'){selected=[];}
    else if(type==='hint'){const options=D.moves(game.players[0].hand,game.target);if(!options.length){toast='没有能压过的牌，可以选择「不出」。';selected=[];}else{const advised=D.chooseMove(game,0);options.sort((a,b)=>a.main-b.main||b.count-a.count);if(advised){const ix=options.findIndex(m=>m.cards.join(',')===advised.cards.join(','));if(ix>=0){const [m]=options.splice(ix,1);options.unshift(m);}}selected=options[hintIndex%options.length].cards.slice();hintIndex++;toast='推荐 '+D.classify(selected).name+'；再次点提示可换一组。'+(game.target&&game.team(game.leader)===game.team(0)?' 当前队友领先，可考虑不出。':'');}render();return;}
    else if(type==='result'){showResult();return;}else if(type==='next'){nextRound();return;}
    if(ok&&type!=='clear')selected=[];hintIndex=0;render();schedule();
  }
  $('hand').addEventListener('click',e=>{const b=e.target.closest('[data-card]');if(!b||game.phase!=='play'||game.turn!==0)return;const id=Number(b.dataset.card);selected=selected.includes(id)?selected.filter(n=>n!==id):selected.concat(id);toast='';hintIndex=0;render();});
  $('actions').addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(b)act(b.dataset.action);});
  document.addEventListener('keydown',e=>{if($('rules-dialog').open||$('result-dialog').open||e.target.closest?.('button')||game.turn!==0||game.phase!=='play')return;if(e.key==='Enter'){e.preventDefault();act('play');}else if(e.key==='Escape'){e.preventDefault();act('clear');}});
  $('rules-open').onclick=()=>$('rules-dialog').showModal();$('rules-close').onclick=()=>$('rules-dialog').close();$('restart').onclick=()=>{if(confirm('重新开桌会清零本桌积分。确定重新开始？'))nextRound(true);};$('review').onclick=()=>$('result-dialog').close();$('next-round').onclick=()=>nextRound();
  render();schedule();
})();
