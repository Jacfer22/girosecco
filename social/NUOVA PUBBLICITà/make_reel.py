"""
make_reel.py — MotoGarage Reel v5
1080x1920 · 30fps · 45s
Hub, GPS animato, Card del giro, Itinerari, Naviga,
Garage turntable (Jacfer22), Community, CTA
"""

import math, os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import imageio.v3 as iio
import numpy as np

BASE   = Path(__file__).parent
MASCOT = BASE.parent / "mascot"
TOUR   = BASE.parent / "tour" / "out" / "instagram"
OUT    = BASE / "reel-motogarage.mp4"

W, H  = 1080, 1920
FPS   = 30
TOTAL = FPS * 45   # 1350 frames

RED   = (232, 40, 11)
BLUE  = (61, 155, 232)
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)

# ── PHONE ────────────────────────────────────────────────────
PH_W  = 520
PH_H  = int(PH_W * 2.16)   # 1123
PH_X  = (W - PH_W) // 2    # 280
PH_Y  = 55
PH_CX = PH_X + PH_W // 2   # 540

# ── HELPERS ──────────────────────────────────────────────────
def clamp(v, lo=0.0, hi=1.0): return max(lo, min(hi, v))
def lerp(a, b, t):  return a + (b-a)*t
def ease_out(t):    return 1-(1-clamp(t))**3
def ease_io(t):     t=clamp(t); return t*t*(3-2*t)
def scene_t(f,s,e): return clamp((f-s)/(e-s)) if e>s else 0.0

def ac(base, ov, pos=(0,0), alpha=1.0):
    ov = ov.convert("RGBA")
    if alpha < 1.0:
        r,g,b,a = ov.split()
        a = a.point(lambda x: int(x*alpha))
        ov = Image.merge("RGBA",(r,g,b,a))
    base.paste(ov, pos, ov)
    return base

def load(path, h=None):
    img = Image.open(path).convert("RGBA")
    if h:
        r = h/img.height
        img = img.resize((int(img.width*r), h), Image.LANCZOS)
    return img

def font(size):
    for p in ["C:/Windows/Fonts/ariblk.ttf","C:/Windows/Fonts/arialbd.ttf",
              "C:/Windows/Fonts/arial.ttf"]:
        if os.path.exists(p):
            try: return ImageFont.truetype(p, size)
            except: pass
    return ImageFont.load_default()

F_HUGE = font(160)
F_BIG  = font(90)
F_DLG  = font(40)
F_MED  = font(32)
F_SM   = font(28)
F_URL  = font(44)
F_BTN  = font(72)
F_GPS  = font(54)
F_GPSM = font(30)

# ── ASSETS ───────────────────────────────────────────────────
print("Loading assets...")
MASCOT_H = 680

rosso = load(MASCOT / "rosso-sport.png",    MASCOT_H)
blu   = load(MASCOT / "blu-adventure.png",  MASCOT_H)
nero  = load(MASCOT / "nero-cruiser.png",   MASCOT_H)

GARAGE_H     = 440
nero_garage  = load(MASCOT / "nero-cruiser.png", GARAGE_H)

SCREEN_IMGS = [
    load(TOUR / "01-benvenuto.jpg").convert("RGB"),  # 0 hub
    load(TOUR / "05-card.jpg").convert("RGB"),        # 1 card
    load(TOUR / "03-itinerari.jpg").convert("RGB"),   # 2 itinerari
    load(TOUR / "06-naviga.jpg").convert("RGB"),      # 3 naviga
    load(TOUR / "07-community.jpg").convert("RGB"),   # 4 community
    load(TOUR / "08-registrati.jpg").convert("RGB"),  # 5 registrati
]

# ── PHONE MOCKUP ─────────────────────────────────────────────
RADIUS = int(PH_W * 0.13)
PAD    = int(PH_W * 0.04)
SW     = PH_W - PAD*2
SH     = PH_H - PAD*2

PHONE_FRAME = Image.new("RGBA", (PH_W, PH_H), (0,0,0,0))
_pf = ImageDraw.Draw(PHONE_FRAME)
_pf.rounded_rectangle([0,0,PH_W-1,PH_H-1], radius=RADIUS, fill=(22,22,24,255))
_pf.rounded_rectangle([0,0,PH_W-1,PH_H-1], radius=RADIUS, outline=(75,75,80,255), width=3)
_pf.rectangle([PH_W-3, PH_H//3,   PH_W-1, PH_H//3+90], fill=(55,55,58))
_pf.rectangle([1,       PH_H//4,   3,       PH_H//4+60], fill=(55,55,58))
_pf.rectangle([1,       PH_H//4+78,3,       PH_H//4+134],fill=(55,55,58))

PHONE_NOTCH = Image.new("RGBA",(PH_W,PH_H),(0,0,0,0))
_ni_w, _ni_h = int(PH_W*0.30), int(PH_W*0.07)
_ni_x = (PH_W-_ni_w)//2
ImageDraw.Draw(PHONE_NOTCH).rounded_rectangle(
    [_ni_x, PAD+2, _ni_x+_ni_w, PAD+2+_ni_h],
    radius=_ni_h//2, fill=(0,0,0,255))

SCREEN_MASK = Image.new("L",(SW,SH),0)
ImageDraw.Draw(SCREEN_MASK).rounded_rectangle([0,0,SW-1,SH-1], radius=RADIUS-PAD, fill=255)

def make_phone_frame(screen_img):
    out = Image.new("RGBA",(PH_W,PH_H),(0,0,0,0))
    out.paste(PHONE_FRAME, (0,0), PHONE_FRAME)
    sc = screen_img.resize((SW, SH), Image.LANCZOS).convert("RGBA")
    sc.putalpha(SCREEN_MASK)
    out.paste(sc, (PAD, PAD), sc)
    out.paste(PHONE_NOTCH, (0,0), PHONE_NOTCH)
    return out

# ── ANIMATED SCREEN: GPS TRACCIA ─────────────────────────────
# Route waypoints (normalized 0..1 relative to map area)
_ROUTE = [
    (.15,.70),(.18,.55),(.25,.44),(.35,.38),(.47,.34),
    (.58,.36),(.68,.42),(.76,.52),(.78,.64),(.74,.75),
    (.64,.82),(.52,.84),(.40,.80),(.30,.74),(.20,.74),
    (.15,.70),
]

def _route_pts(sw, sh, margin=50):
    return [(int(margin + nx*(sw-2*margin)), int(margin + ny*(sh-2*margin)))
            for nx,ny in _ROUTE]

def _partial_route(pts, t):
    n = len(pts)-1
    seg_f = t * n
    full  = int(seg_f)
    result = list(pts[:full+1])
    if full < n:
        frac = seg_f - full
        x = int(pts[full][0] + frac*(pts[full+1][0]-pts[full][0]))
        y = int(pts[full][1] + frac*(pts[full+1][1]-pts[full][1]))
        result.append((x, y))
    return result

def make_gps_screen(frame, gs, ge):
    t  = scene_t(frame, gs, ge)
    sc = Image.new("RGB", (SW, SH), (6,5,10))
    d  = ImageDraw.Draw(sc)

    # Grid
    for y in range(0, SH, 55):
        d.line([(0,y),(SW,y)], fill=(18,10,22))
    for x in range(0, SW, 55):
        d.line([(x,0),(x,SH)], fill=(18,10,22))

    # Header
    d.text((18, 18), "TRACCIA GPS", font=F_GPS, fill=RED)
    d.text((18, 80), "IN DIRETTA", font=F_GPSM, fill=(160,160,160))
    d.line([(0,118),(SW,118)], fill=(40,20,20), width=1)

    # Map area
    mt = 128  # map top y
    mh = SH - mt - 170
    pts = _route_pts(SW, mh, margin=45)
    pts = [(x, y+mt) for x,y in pts]

    # Faint full route
    for i in range(len(pts)-1):
        d.line([pts[i], pts[i+1]], fill=(55,15,10), width=3)

    # Progressive route draw
    prog = ease_out(t)
    drawn = _partial_route(pts, prog)
    if len(drawn) > 1:
        for i in range(len(drawn)-1):
            d.line([drawn[i], drawn[i+1]], fill=RED, width=5)
        # Pulse at tip
        cx, cy = drawn[-1]
        pulse = 0.5 + 0.5*math.sin(frame*0.28)
        r1 = int(9+4*pulse); r2 = int(20+10*pulse)
        d.ellipse([cx-r2,cy-r2,cx+r2,cy+r2], fill=(232,40,11,35))
        d.ellipse([cx-r1,cy-r1,cx+r1,cy+r1], fill=RED)

    # Live stats — 3 clean columns
    km_val  = 47.3 * prog
    sec_val = int(5673 * prog)
    m2, sc2 = divmod(sec_val, 60)
    h2, m2  = divmod(m2, 60)
    speed   = int(62 + 7*math.sin(frame*0.09))

    sy = SH - 155
    d.line([(0, sy-10),(SW, sy-10)], fill=(40,20,20), width=1)

    col_w = SW // 3
    # Columns left→right: SPEED | TEMPO | KM
    # (bubble covers left ~50% so km is intentionally on the right, always visible)
    # SPEED (col 0)
    sp_s = str(speed)
    d.text((col_w*0+10, sy),    sp_s,   font=F_MED, fill=WHITE)
    d.text((col_w*0+10, sy+40), "km/h", font=F_GPSM, fill=(130,130,130))
    # TEMPO (col 1, centered)
    ts   = f"{h2:02d}:{m2:02d}:{sc2:02d}"
    tw   = int(d.textlength(ts, font=F_MED))
    tx   = col_w + (col_w-tw)//2
    d.text((tx, sy),    ts,      font=F_MED, fill=WHITE)
    d.text((tx, sy+40), "tempo", font=F_GPSM, fill=(130,130,130))
    # KM (col 2, right-aligned — always visible, outside speech bubble)
    km_s = f"{km_val:.1f}"
    kw_  = int(d.textlength(km_s, font=F_MED))
    d.text((SW-kw_-10, sy),    km_s, font=F_MED, fill=WHITE)
    d.text((SW-kw_-10, sy+40), "km",  font=F_GPSM, fill=(130,130,130))

    return sc

# ── ANIMATED SCREEN: GARAGE TURNTABLE ─────────────────────────
def make_garage_screen(frame, gs, ge):
    t = scene_t(frame, gs, ge)
    sc = Image.new("RGBA", (SW, SH), (5,4,8,255))
    d  = ImageDraw.Draw(sc)

    # Floor grid (perspective lines)
    for y in range(SH//2, SH, 45):
        a = int(25 * (y-SH//2)/(SH//2))
        d.line([(0,y),(SW,y)], fill=(a,4,4))
    for xi in range(0, SW+1, 60):
        # converge to center
        cx = SW//2
        a  = int(20*(1-abs(xi-cx)/max(cx,1)))
        d.line([(xi,SH//2),(cx,SH)], fill=(a,4,4))

    # Rim glow under moto (Gaussian-blurred ellipse)
    gx, gy = SW//2, SH - 55
    glow_canvas = Image.new("RGBA", (SW, SH), (0,0,0,0))
    gd = ImageDraw.Draw(glow_canvas)
    gd.ellipse([gx-160, gy-30, gx+160, gy+30], fill=(232,40,11,80))
    glow_canvas = glow_canvas.filter(ImageFilter.GaussianBlur(18))
    ac(sc, glow_canvas, (0, 0))

    # Header
    d.text((18, 18), "IL MIO GARAGE", font=F_GPS, fill=RED)
    # Username with underline
    uw = int(d.textlength("JACFER22", font=F_SM))
    d.text((18, 80), "JACFER22", font=F_SM, fill=WHITE)
    d.line([(18, 112),(18+uw, 112)], fill=RED, width=2)
    d.line([(0, 122),(SW,122)], fill=(40,10,10), width=1)

    # ── Turntable rotation (2 full rotations over scene) ──────
    angle = t * 4 * math.pi
    sx_raw = math.cos(angle)

    moto = nero_garage
    if sx_raw < 0:
        moto = nero_garage.transpose(Image.FLIP_LEFT_RIGHT)
        sx = -sx_raw
    else:
        sx = sx_raw

    nw = max(4, int(nero_garage.width * sx))
    nh = nero_garage.height
    moto_s = moto.resize((nw, nh), Image.LANCZOS)

    map_area_top = 130
    map_area_h   = SH - map_area_top - 80
    mx = (SW - nw) // 2
    my = map_area_top + int((map_area_h - nh) * 0.85)  # near bottom of map area
    my = max(map_area_top, my)

    # Wheel shadow
    sha_w = max(4, int(nw * 0.75))
    sha_y = my + nh - 25
    for sr in range(30, 0, -5):
        a = int(50*(1-sr/30))
        d.ellipse([mx+(nw-sha_w)//2-sr, sha_y-sr//4,
                   mx+(nw+sha_w)//2+sr, sha_y+sr//4],
                  fill=(0,0,0,a))

    ac(sc, moto_s, (mx, my))

    # 360° orbit indicator (bottom-right)
    ix, iy = SW-52, SH-52
    orb = t * 8 * math.pi
    d.ellipse([ix-26, iy-26, ix+26, iy+26], outline=(232,40,11,100), width=2)
    dx = ix + int(24*math.cos(orb))
    dy = iy + int(10*math.sin(orb))
    d.ellipse([dx-5,dy-5,dx+5,dy+5], fill=RED)
    tw = int(d.textlength("360", font=F_GPSM))
    d.text((ix-tw//2, iy+30), "360", font=F_GPSM, fill=RED)

    return sc.convert("RGB")

# ── SCREEN SCHEDULE ──────────────────────────────────────────
# Indices: 0=hub 1=card 2=itinerari 3=naviga 4=community 5=registrati
# "gps" and "garage" are custom-built per frame

# Scene boundaries
INTRO_S,  INTRO_E  =   0,  89
ROSSO_S,  ROSSO_E  =  90, 359
BLU_S,    BLU_E    = 360, 569
NERO_S,   NERO_E   = 570, 809
TRIO_S,   TRIO_E   = 810, 989
CTA_S,    CTA_E    = 990,1349

# (start, end, from_key, to_key)
# keys: int=SCREEN_IMGS index  |  "gps"  |  "garage"
SCHED = [
    (INTRO_S, INTRO_E,  0,       0),
    (90,  209,          0,       0),       # rosso: hub
    (210, 269,          0,     "gps"),     # hub→GPS
    (270, 329,        "gps",  "gps"),      # GPS anim
    (330, 359,        "gps",    1),        # GPS→card
    (360, 469,          2,       2),       # blu: itinerari
    (470, 519,          2,       3),       # itinerari→naviga
    (520, 569,          3,       3),       # naviga
    (NERO_S, NERO_E,"garage","garage"),    # nero: garage
    (810, 899,          4,       4),       # trio: community
    (900, 949,          4,       5),       # community→registrati
    (950, TRIO_E,       5,       5),       # registrati
    (CTA_S, CTA_E,      5,       5),       # CTA
]

def _get_raw(key, frame):
    if key == "gps":
        return make_gps_screen(frame, 270, 329)
    if key == "garage":
        return make_garage_screen(frame, NERO_S, NERO_E)
    return SCREEN_IMGS[key]

def get_screen(frame):
    for s, e, fk, tk in SCHED:
        if s <= frame <= e:
            if fk == tk or (fk == "gps" and tk == "gps") or (fk == "garage" and tk == "garage"):
                return _get_raw(fk, frame)
            # Slide-up transition
            t  = ease_io(scene_t(frame, s, e))
            fr = _get_raw(fk, frame)
            to = _get_raw(tk, frame)
            fr_r = fr.convert("RGB") if hasattr(fr, 'convert') else fr
            to_r = to.convert("RGB") if hasattr(to, 'convert') else to
            h = fr_r.height
            off = int(t * h)
            combo = Image.new("RGB",(fr_r.width, h*2))
            combo.paste(fr_r,(0,0))
            combo.paste(to_r,(0,h))
            return combo.crop((0, off, fr_r.width, off+h))
    return SCREEN_IMGS[0]

# ── SPEECH BUBBLE ────────────────────────────────────────────
def speech_bubble(lines, max_w=560, tail_side="left"):
    pad    = 30
    line_h = 56
    bh     = len(lines)*line_h + pad*2
    tmp    = ImageDraw.Draw(Image.new("RGB",(1,1)))
    ml     = max(tmp.textlength(l, font=F_DLG) for l in lines)
    bw     = min(int(ml)+pad*2, max_w)
    total_h= bh + 34
    img    = Image.new("RGBA",(bw, total_h),(0,0,0,0))
    draw   = ImageDraw.Draw(img)
    draw.rounded_rectangle([0,0,bw-1,bh-1], radius=20,
                           fill=(235,235,235,248), outline=(200,200,200,200), width=2)
    if tail_side == "left":
        draw.polygon([(32,bh),(58,bh-2),(58,bh+30)], fill=(235,235,235,248))
    else:
        draw.polygon([(bw-32,bh),(bw-58,bh-2),(bw-58,bh+30)], fill=(235,235,235,248))
    for i,line in enumerate(lines):
        draw.text((pad, pad+i*line_h), line, font=F_DLG, fill=(18,18,18))
    return img

# ── FLASH TRANSITIONS ────────────────────────────────────────
FLASHES = {
    ROSSO_S: (WHITE, 20),
    BLU_S:   (BLUE,  20),
    NERO_S:  (WHITE, 18),
    TRIO_S:  (RED,   24),
    CTA_S:   (WHITE, 16),
}

def apply_flash(img, frame):
    for start,(col,dur) in FLASHES.items():
        if start <= frame < start+dur:
            t  = 1.0-(frame-start)/dur
            fl = Image.new("RGB",(W,H), col)
            img = Image.blend(img, fl, t*0.72)
    return img

# ── MASCOT HELPERS ───────────────────────────────────────────
def mascot_x(mascot_img, side, t_in, gap=70):
    mw = mascot_img.width
    if side == "left":
        x_end = PH_X - mw + gap
        x_end = max(x_end, -int(mw*0.42))
        return int(lerp(-mw-60, x_end, ease_out(clamp(t_in))))
    else:
        x_end = PH_X + PH_W - gap
        x_end = min(x_end, W - int(mw*0.58))
        return int(lerp(W+60, x_end, ease_out(clamp(t_in))))

def mascot_y():
    # Mascot bottom overlaps phone bottom by ~35%
    return PH_Y + PH_H - int(MASCOT_H * 0.40)

# ── BASE FRAME ────────────────────────────────────────────────
def base_frame(frame):
    img = Image.new("RGB",(W,H),(5,5,7))
    # Subtle vignette
    vign = Image.new("RGBA",(W,H),(0,0,0,0))
    vd   = ImageDraw.Draw(vign)
    for i in range(5):
        a = int(110*(1-i/5))
        m = i*90
        vd.rounded_rectangle([m,m,W-1-m,H-1-m], radius=220,
                              outline=(0,0,0,a), width=45)
    img.paste(vign.convert("RGB"),(0,0),vign)
    # Phone shadow
    sh = Image.new("RGBA",(PH_W+100,PH_H+100),(0,0,0,0))
    ImageDraw.Draw(sh).rounded_rectangle([25,25,PH_W+75,PH_H+75],
                                          radius=RADIUS, fill=(0,0,0,150))
    sh  = sh.filter(ImageFilter.GaussianBlur(26))
    img_rgba = img.convert("RGBA")
    ac(img_rgba, sh, (PH_X-50, PH_Y-50))
    # Phone
    screen = get_screen(frame)
    phone  = make_phone_frame(screen)
    bob    = int(math.sin(frame*0.06)*9)
    ac(img_rgba, phone, (PH_X, PH_Y+bob))
    return img_rgba.convert("RGB")

# ── RENDER FUNCTIONS ─────────────────────────────────────────
def render_intro(frame):
    t   = scene_t(frame, INTRO_S, INTRO_E)
    img = Image.new("RGB",(W,H),(5,5,7))
    ov  = Image.new("RGBA",(W,H),(0,0,0,0))
    te  = ease_out(t)
    drop_y = int(lerp(-PH_H-120, PH_Y, te))
    if t > 0.72:
        drop_y = int(PH_Y + math.sin((t-0.72)/0.28*math.pi)*22)

    sc  = get_screen(frame)
    ph  = make_phone_frame(sc)
    ac(ov, ph, (PH_X, drop_y))

    if t > 0.78:
        la = clamp((t-0.78)*6, 0, 1)
        td = ImageDraw.Draw(ov)
        # Logo below phone
        logy = drop_y + PH_H + 36
        td.text((PH_X+10,  logy),     "MOTO",   font=F_BIG, fill=WHITE+(int(255*la),))
        td.text((PH_X-8,   logy+118), "GARAGE",  font=F_BIG, fill=RED+(int(255*la),))

    img.paste(ov.convert("RGB"),(0,0),ov)
    return img


def render_mascot(frame, fs, fe, mascot_img, side, lines, accent=RED):
    img = base_frame(frame)
    ov  = Image.new("RGBA",(W,H),(0,0,0,0))
    t   = scene_t(frame, fs, fe)

    t_in  = clamp(t / 0.22)
    mx    = mascot_x(mascot_img, side, t_in)
    my    = mascot_y()
    if t_in >= 1.0:
        my += int(math.sin(frame*0.06)*9)

    ac(ov, mascot_img, (mx, my))

    # Bubble at t>0.28
    if t > 0.28:
        ba = clamp((t-0.28)*5, 0, 1)
        bside = "right" if side == "left" else "left"
        bub   = speech_bubble(lines, tail_side=bside)
        if side == "left":
            bx = mx + mascot_img.width - bub.width + 15
            bx = max(8, min(bx, W-bub.width-8))
        else:
            bx = mx - 12
            bx = max(8, min(bx, W-bub.width-8))
        by = my - bub.height - 24

        r,g,b,a = bub.split()
        a = a.point(lambda x: int(x*ba))
        bub = Image.merge("RGBA",(r,g,b,a))
        ac(ov, bub, (bx, by))

    # Accent line below phone
    al = Image.new("RGBA",(W,6),(0,0,0,0))
    ImageDraw.Draw(al).rectangle([PH_X,0,PH_X+PH_W,5],
                                  fill=accent+(int(180*min(t*4,1)),))
    ac(ov, al, (0, PH_Y+PH_H+18))

    img_rgba = img.convert("RGBA")
    ac(img_rgba, ov)
    return img_rgba.convert("RGB")


def render_trio(frame):
    img = base_frame(frame)
    ov  = Image.new("RGBA",(W,H),(0,0,0,0))
    t   = scene_t(frame, TRIO_S, TRIO_E)

    TH = 500
    def scale(m): return m.resize((int(m.width*(TH/MASCOT_H)), TH), Image.LANCZOS)
    r_s = scale(rosso); b_s = scale(blu); n_s = scale(nero)

    def entry(m, cx, delay):
        mt = ease_out(clamp((t-delay)*5,0,1))
        sc_v = lerp(0.25, 1.0, mt)
        nw, nh = max(2, int(m.width*sc_v)), max(2, int(m.height*sc_v))
        ms  = m.resize((nw,nh), Image.LANCZOS)
        al  = int(255*mt)
        if al < 255:
            r,g,b,a = ms.split()
            a = a.point(lambda x: int(x*al//255))
            ms = Image.merge("RGBA",(r,g,b,a))
        yt  = int(lerp(250,0,mt))
        ac(ov, ms, (cx-nw//2, H-nh+yt))

    entry(r_s,  200, 0.00)
    entry(b_s,  540, 0.12)
    entry(n_s,  880, 0.24)

    if t > 0.5:
        ba  = clamp((t-0.5)*4, 0, 1)
        bub = speech_bubble(["Scaricalo gratis!", "www.motogarage.info"],
                             max_w=640, tail_side="left")
        bx  = (W-bub.width)//2
        by  = PH_Y + PH_H + 28
        r,g,b,a = bub.split()
        a   = a.point(lambda x: int(x*ba))
        bub = Image.merge("RGBA",(r,g,b,a))
        ac(ov, bub, (bx, by))

    img_rgba = img.convert("RGBA")
    ac(img_rgba, ov)
    return img_rgba.convert("RGB")


def render_cta(frame):
    t  = scene_t(frame, CTA_S, CTA_E)
    te = ease_out(t)
    img= base_frame(frame)
    ov = Image.new("RGBA",(W,H),(0,0,0,0))
    td = ImageDraw.Draw(ov)
    a255= int(255*min(te*2,1))

    logy = PH_Y + PH_H + 44
    # Center MOTO and GARAGE
    mw = int(td.textlength("MOTO", font=F_HUGE))
    gw = int(td.textlength("GARAGE", font=F_HUGE))
    td.text(((W-mw)//2, logy),      "MOTO",   font=F_HUGE, fill=WHITE+(a255,))
    td.text(((W-gw)//2, logy+172),  "GARAGE", font=F_HUGE, fill=RED+(a255,))

    if t > 0.18:
        ua  = int(255*clamp((t-0.18)*5,0,1))
        uw2 = int(ImageDraw.Draw(Image.new("RGB",(1,1))).textlength(
              "www.motogarage.info", font=F_URL))
        td.text(((W-uw2)//2, logy+350), "www.motogarage.info",
                font=F_URL, fill=(200,200,200,ua))

    if t > 0.12:
        ba  = clamp((t-0.32)*4,0,1)
        pul = 1+0.03*math.sin(frame*0.26)
        bw, bh = int(700*pul), int(120*pul)
        btn = Image.new("RGBA",(bw,bh),(0,0,0,0))
        bd  = ImageDraw.Draw(btn)
        bd.rounded_rectangle([0,0,bw-1,bh-1], radius=60, fill=RED+(int(255*ba),))
        tw2 = int(bd.textlength("SCARICA ORA", font=F_BTN))
        bd.text(((bw-tw2)//2, (bh-72)//2), "SCARICA ORA",
                font=F_BTN, fill=WHITE+(int(255*ba),))
        ac(ov, btn, ((W-bw)//2, logy+430))

    img_rgba = img.convert("RGBA")
    ac(img_rgba, ov)
    return img_rgba.convert("RGB")


# ── DIALOGUES ────────────────────────────────────────────────
ROSSO_LINES = ["L'Hub, il GPS,", "la Card del giro.", "Tutto tuo!"]
BLU_LINES   = ["Itinerari e Naviga:", "pianifica il tuo", "percorso perfetto!"]
NERO_LINES  = ["Garage 3D:", "la moto di Jacfer22", "gira qui!"]

# ── RENDER LOOP ───────────────────────────────────────────────
print(f"Rendering {TOTAL} frames -> {OUT.name}")

writer = iio.imopen(str(OUT), "w", plugin="pyav")
writer.init_video_stream("libx264", fps=FPS, pixel_format="yuv420p")

for f in range(TOTAL):
    if   f <= INTRO_E:
        fi = render_intro(f)
    elif f <= ROSSO_E:
        fi = render_mascot(f, ROSSO_S, ROSSO_E, rosso, "left",  ROSSO_LINES, RED)
    elif f <= BLU_E:
        fi = render_mascot(f, BLU_S,   BLU_E,   blu,   "right", BLU_LINES,  BLUE)
    elif f <= NERO_E:
        fi = render_mascot(f, NERO_S,  NERO_E,  nero,  "left",  NERO_LINES, (140,140,140))
    elif f <= TRIO_E:
        fi = render_trio(f)
    else:
        fi = render_cta(f)

    fi = apply_flash(fi, f)
    writer.write_frame(np.array(fi))

    if f % 30 == 0:
        pct = f/TOTAL*100
        bar = "#"*int(pct/5)+" "*(20-int(pct/5))
        print(f"\r  [{bar}] {pct:.0f}%  {f//FPS}s/45s", end="", flush=True)

writer.close()
mb = OUT.stat().st_size/1024/1024
print(f"\n\nDONE -> reel-motogarage.mp4  ({mb:.1f} MB)")
