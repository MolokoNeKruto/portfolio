from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os, math, random, subprocess, shutil

out = r"C:\Users\user\OneDrive\Документы\Проект по умолчанию\portfolio\public\media"
os.makedirs(out, exist_ok=True)
W, H = 1600, 1000

def font(size):
    for p in [r"C:\Windows\Fonts\arialbd.ttf", r"C:\Windows\Fonts\seguisb.ttf", r"C:\Windows\Fonts\Arial.ttf"]:
        if os.path.exists(p):
            try: return ImageFont.truetype(p, size)
            except: pass
    return ImageFont.load_default()

def grain(img, amt=18):
    px = img.load()
    for _ in range(W*H//15):
        x = random.randrange(W); y = random.randrange(H)
        r,g,b = px[x,y]
        n = random.randint(-amt,amt)
        px[x,y] = (max(0,min(255,r+n)), max(0,min(255,g+n)), max(0,min(255,b+n)))
    return img

def encode(frames_dir, name, fps=24):
    pattern = os.path.join(frames_dir, 'frame_%04d.png')
    dst = os.path.join(out, name)
    cmd = ['ffmpeg','-y','-framerate',str(fps),'-i',pattern,'-c:v','libx264','-pix_fmt','yuv420p','-crf','20','-movflags','+faststart',dst]
    subprocess.run(cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    shutil.rmtree(frames_dir, ignore_errors=True)
    print('ok', name)

def make_glass():
    base = Image.new('RGB',(W,H),(14,17,20))
    d = ImageDraw.Draw(base)
    for i in range(10):
        x=180+i*110; y=110+i*22; w2=280; h2=640-i*18
        col=(28+i*6,38+i*5,46+i*4)
        d.rounded_rectangle([x,y,x+w2,y+h2], radius=20, fill=col, outline=(110,160,175))
        d.line([x+20,y+40,x+w2-20,y+40], fill=(90,130,145), width=2)
    d.rectangle([0,720,W,H], fill=(12,14,16))
    d.text((110,760), 'GLASSMORPHISM V2', fill=(242,239,232), font=font(92))
    d.text((110,860), 'OpenCode Desktop plugin / real project', fill=(255,92,58), font=font(38))
    grain(base,14)
    base.save(os.path.join(out,'glass-poster.jpg'),'JPEG',quality=92)
    fdir=os.path.join(out,'_f_glass'); os.makedirs(fdir,exist_ok=True)
    for f in range(72):
        fr=base.copy(); dd=ImageDraw.Draw(fr)
        t=f/72*math.pi*2
        ox=int(math.sin(t)*22); oy=int(math.cos(t)*10)
        dd.ellipse([960+ox,100+oy,1330+ox,470+oy], outline=(255,92,58), width=5)
        dd.ellipse([990+ox,130+oy,1300+ox,440+oy], outline=(242,239,232), width=2)
        fr.save(os.path.join(fdir,f'frame_{f:04d}.png'))
    encode(fdir,'glass.mp4')

def make_poster():
    base = Image.new('RGB',(W,H),(18,18,20))
    d=ImageDraw.Draw(base)
    d.rectangle([120,120,760,640], fill=(255,92,58))
    d.text((160,250),'MAKE', fill=(11,11,12), font=font(150))
    d.text((160,390),'IT', fill=(242,239,232), font=font(150))
    d.text((160,560),'LOUD / CLEAR / YOURS', fill=(11,11,12), font=font(34))
    for i in range(14):
        y=140+i*55
        d.line([860,y,1480,y], fill=(70,70,72), width=2)
    d.rectangle([980,560,1340,760], fill=(198,255,77))
    d.text((1020,640),'2026', fill=(11,11,12), font=font(72))
    grain(base,12)
    base.save(os.path.join(out,'poster-poster.jpg'),'JPEG',quality=92)
    fdir=os.path.join(out,'_f_poster'); os.makedirs(fdir,exist_ok=True)
    for f in range(72):
        fr=base.copy(); dd=ImageDraw.Draw(fr)
        t=f/72
        x=int(860 + 620*(t))
        dd.rectangle([860,120,1480,640], fill=(18,18,20))
        for i in range(14):
            y2=140+i*55+int(math.sin(t*math.pi*2+i*0.4)*8)
            col=(255,92,58) if i%4==0 else (242,239,232) if i%3==0 else (70,70,72)
            dd.line([860,y2,1480,y2], fill=col, width=3)
        dd.rectangle([980,560,1340,760], fill=(198,255,77))
        dd.text((1020,640),'2026', fill=(11,11,12), font=font(72))
        fr.save(os.path.join(fdir,f'frame_{f:04d}.png'))
    encode(fdir,'poster.mp4')

def make_signal():
    base = Image.new('RGB',(W,H),(12,12,14))
    d=ImageDraw.Draw(base)
    cx,cy=980,460
    for r in range(360,40,-20):
        col=(40+r//6,40+r//8,45+r//10)
        d.ellipse([cx-r,cy-r,cx+r,cy+r], outline=col, width=2)
    d.text((110,760),'SIGNAL', fill=(242,239,232), font=font(110))
    d.text((110,870),'audio-reactive 3D scene', fill=(255,92,58), font=font(38))
    grain(base,16)
    base.save(os.path.join(out,'signal-poster.jpg'),'JPEG',quality=92)
    fdir=os.path.join(out,'_f_signal'); os.makedirs(fdir,exist_ok=True)
    random.seed(2)
    pts=[(random.random()*math.pi*2, random.random()*math.pi, 180+random.random()*180) for _ in range(220)]
    for f in range(72):
        fr=Image.new('RGB',(W,H),(12,12,14)); dd=ImageDraw.Draw(fr)
        t=f/72*math.pi*2
        cx,cy=980,470
        for a,b,r in pts:
            aa=a+t*0.7; bb=b+math.sin(t*0.5)*0.3
            x=cx+math.cos(aa)*math.sin(bb)*r
            y=cy+math.sin(aa)*math.sin(bb)*r*0.55
            z=math.cos(bb)
            s=2 if z<0 else 3
            col=(255,92,58) if z>0.2 else (160,160,165) if z>-0.2 else (70,70,75)
            dd.ellipse([x-s,y-s,x+s,y+s], fill=col)
        dd.text((110,760),'SIGNAL', fill=(242,239,232), font=font(110))
        dd.text((110,870),'audio-reactive 3D scene', fill=(255,92,58), font=font(38))
        fr.save(os.path.join(fdir,f'frame_{f:04d}.png'))
    encode(fdir,'signal.mp4')

def make_type():
    base=Image.new('RGB',(W,H),(20,19,18))
    d=ImageDraw.Draw(base)
    d.text((120,260),'TYPE', fill=(242,239,232), font=font(220))
    d.text((760,320),'MACHINE', fill=(255,92,58), font=font(140))
    d.line([120,610,1480,610], fill=(80,78,74), width=3)
    d.text((120,640),'kinetic typography / interactive', fill=(184,178,167), font=font(38))
    grain(base,12)
    base.save(os.path.join(out,'type-poster.jpg'),'JPEG',quality=92)
    fdir=os.path.join(out,'_f_type'); os.makedirs(fdir,exist_ok=True)
    letters='TYPEMACHINE'
    for f in range(72):
        fr=Image.new('RGB',(W,H),(20,19,18)); dd=ImageDraw.Draw(fr)
        for i,ch in enumerate(letters[:8]):
            t=f/72*math.pi*2
            x=140+i*165+int(math.sin(t+i*0.6)*12)
            y=360+int(math.cos(t*1.2+i*0.5)*18)
            col=(255,92,58) if ch in 'AEI' else (242,239,232)
            dd.text((x,y), ch, fill=col, font=font(170))
        dd.line([120,610,1480,610], fill=(80,78,74), width=3)
        dd.text((120,640),'kinetic typography / interactive', fill=(184,178,167), font=font(38))
        fr.save(os.path.join(fdir,f'frame_{f:04d}.png'))
    encode(fdir,'type.mp4')

if __name__=='__main__':
    make_glass(); make_poster(); make_signal(); make_type()
    print('done')
