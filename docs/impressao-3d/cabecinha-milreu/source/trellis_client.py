# © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu.
# Cliente mínimo (stdlib) para o espaço público TRELLIS (MIT) no Hugging Face.
# Uso: python3 trellis_client.py <saida.glb> <seed> <img1> [img2 ...]
import json, sys, time, uuid, urllib.request, mimetypes, os
H = "https://trellis-community-trellis.hf.space/gradio_api"
SH = "milreu" + uuid.uuid4().hex[:10]
out, seed, imgs = sys.argv[1], int(sys.argv[2]), sys.argv[3:]

def upload(p):
    b = "----m" + uuid.uuid4().hex
    body = (f"--{b}\r\nContent-Disposition: form-data; name=\"files\"; filename=\"{os.path.basename(p)}\"\r\n"
            f"Content-Type: {mimetypes.guess_type(p)[0]}\r\n\r\n").encode() + open(p, "rb").read() + f"\r\n--{b}--\r\n".encode()
    r = urllib.request.Request(H + "/upload", body, {"Content-Type": f"multipart/form-data; boundary={b}"})
    return {"path": json.load(urllib.request.urlopen(r))[0], "meta": {"_type": "gradio.FileData"}}

def call(fn, data):
    r = urllib.request.Request(H + "/queue/join", json.dumps({"data": data, "fn_index": fn, "session_hash": SH,
                               "event_data": None, "trigger_id": None}).encode(), {"Content-Type": "application/json"})
    ev = json.load(urllib.request.urlopen(r))["event_id"]
    s = urllib.request.urlopen(H + f"/queue/data?session_hash={SH}", timeout=600)
    for line in s:
        line = line.decode().strip()
        if not line.startswith("data:"): continue
        d = json.loads(line[5:])
        if d.get("msg") in ("estimation", "process_starts"): print(" ", fn, d.get("msg"), d.get("rank", ""), flush=True)
        if d.get("event_id") == ev and d.get("msg") == "process_completed":
            if not d.get("success"): sys.exit(f"ERRO fn {fn}: {json.dumps(d)[:800]}")
            return d["output"]["data"]
        if d.get("msg") == "unexpected_error": sys.exit(f"ERRO: {d}")

call(4, [])                                    # start_session
ups = [upload(p) for p in imgs]
if len(ups) == 1:
    pre = call(8, [ups[0]])[0]                 # preprocess_image (remove fundo)
    print("PRE", json.dumps(pre)[:300])
    res = call(11, [pre, [], seed, 7.5, 12, 3.0, 12, "stochastic", 0.95, 1024])
else:
    pre = call(9, [[{"image": u, "caption": None} for u in ups]])[0]
    res = call(11, [None, pre, seed, 7.5, 12, 3.0, 12, "stochastic", 0.95, 1024])
glb = res[2] if isinstance(res[2], dict) else res[1]
url = glb.get("url") or (H + "/file=" + glb["path"])
urllib.request.urlretrieve(url, out)
print("OK", out, os.path.getsize(out))
