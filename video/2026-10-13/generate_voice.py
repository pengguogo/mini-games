"""Qwen3-TTS VoiceDesign 配音，先试听再全量。"""
import argparse,json,subprocess,wave,array,math
from pathlib import Path
ROOT=Path(__file__).resolve().parent
STYLES={
 'natural':'三十岁左右的中文男声，声音干净、有亲和力，像技术博主面对镜头自然聊天；语气自信，带轻微笑意，语速中等偏快，停顿和重音自然；不要播音腔、广告腔或夸张表演。',
 'professional':'三十岁左右的中文男声，干净沉稳，像资深工程师讲解技术方案，语气专业自然，停顿清楚。',
 'energetic':'年轻中文男声，干净有活力，科技博主自然分享，语速中等偏快，不夸张表演。',
 'documentary':'成熟中文男声，克制沉静，有质感的科技纪录片旁白，自然停顿。'}
p=argparse.ArgumentParser();p.add_argument('--style',choices=STYLES,default='natural');p.add_argument('--sample',action='store_true');p.add_argument('--python',default='/Users/dawn/Desktop/ai-product/codex-video-demo/work/ttsvenv/bin/python');args=p.parse_args()
lines=json.loads((ROOT/'narration.json').read_text());folder=ROOT/'voice';folder.mkdir(exist_ok=True)
for i,line in enumerate(lines[:1] if args.sample else lines):
 target=folder/f'{args.style}-{i:02}_000.wav'
 if not target.exists():
  subprocess.run([args.python,'-m','mlx_audio.tts.generate','--model','mlx-community/Qwen3-TTS-12Hz-1.7B-VoiceDesign-4bit','--text',line,'--lang_code','Chinese','--instruct',STYLES[args.style],'--output_path',str(folder),'--file_prefix',f'{args.style}-{i:02}','--audio_format','wav'],check=True)
 print(target,flush=True)
if args.sample:raise SystemExit(0)
track=array.array('h');segments=[];rate=None
for i,line in enumerate(lines):
 with wave.open(str(folder/f'{args.style}-{i:02}_000.wav')) as w:
  assert w.getnchannels()==1 and w.getsampwidth()==2
  rate=rate or w.getframerate();assert w.getframerate()==rate
  a=array.array('h');a.frombytes(w.readframes(w.getnframes()));assert len(a)>0
  start=len(track)/rate;track.extend(a);end=len(track)/rate
  track.extend(array.array('h',[0])*int(rate*.3))
  segments.append({'start':start,'end':end,'text':line})
track.extend(array.array('h',[0])*int(rate*1))
with wave.open(str(ROOT/'out/narration.wav'),'wb') as w:w.setnchannels(1);w.setsampwidth(2);w.setframerate(rate);w.writeframes(track.tobytes())
rms=math.sqrt(sum(x*x for x in track)/len(track));assert rms>100
(ROOT/'timing.json').write_text(json.dumps({'duration':len(track)/rate,'rate':rate,'channels':1,'rms':rms,'segments':segments},ensure_ascii=False,indent=2))
