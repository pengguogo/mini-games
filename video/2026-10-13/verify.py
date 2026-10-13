from pathlib import Path
import argparse,json,subprocess,wave,math,array
from PIL import Image
R=Path(__file__).resolve().parent
p=argparse.ArgumentParser();p.add_argument('--ffmpeg',required=True);a=p.parse_args()
cover=Image.open(R/'out/cover.png');cover.verify();assert Image.open(R/'out/cover.png').size==(1080,1920)
with wave.open(str(R/'out/narration.wav')) as w:
 assert w.getframerate()==24000 and w.getnchannels()==1 and w.getsampwidth()==2
 data=array.array('h');data.frombytes(w.readframes(w.getnframes()));duration=len(data)/w.getframerate()
 rms=math.sqrt(sum(x*x for x in data)/len(data));assert rms>100
 timing=json.loads((R/'timing.json').read_text());assert abs(duration-timing['duration'])<.01
 for s in timing['segments']:assert 0<=s['start']<s['end']<=duration
result=subprocess.run([a.ffmpeg,'-v','error','-i',str(R/'out/pengge-ai-03-mini-games.mp4'),'-f','null','-'],capture_output=True,text=True);assert result.returncode==0,result.stderr
print(json.dumps({'duration':duration,'wavSampleRate':24000,'wavChannels':1,'rms':rms,'peak':max(abs(x) for x in data),'cover':[1080,1920],'videoDecode':'passed'},indent=2))
