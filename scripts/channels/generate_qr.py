# © 2026 Fernando Rodrigues de Jácomo.
# Produzido no âmbito do Projeto Comunitário de Milreu.
# Consultar RIGHTS.md.

import json
import os
from pathlib import Path
from urllib.parse import urljoin

try:
    import qrcode
    import qrcode.image.svg
except ImportError as exc:
    raise SystemExit("Instale: pip install -r requirements-qr.txt") from exc

base_url = os.environ.get("MILREU_PUBLIC_BASE_URL", "").strip()
if not base_url or not base_url.startswith(("https://", "http://")):
    raise SystemExit("MILREU_PUBLIC_BASE_URL é obrigatório e deve ser uma URL absoluta.")

root = Path(".")
targets_path = root / "public/data/channels/qr-targets.json"
payload = json.loads(targets_path.read_text(encoding="utf-8"))
output = root / "public/media/qr"
output.mkdir(parents=True, exist_ok=True)

for item in payload["targets"]:
    absolute = urljoin(base_url.rstrip("/") + "/", item["path"].lstrip("/"))
    image = qrcode.make(absolute, image_factory=qrcode.image.svg.SvgPathImage)
    image.save(output / f"{item['id']}.svg")
    item["absoluteUrl"] = absolute
    item["status"] = "generated"

payload["publicBaseUrl"] = base_url.rstrip("/")
payload["status"] = "generated"
targets_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

config_path = root / "public/data/channels/channel-config.json"
config = json.loads(config_path.read_text(encoding="utf-8"))
config["publicBaseUrl"] = base_url.rstrip("/")
config["publicBaseUrlStatus"] = "configured"
config["qr"]["status"] = "generated"
config["qr"]["finalCodesGenerated"] = True
config_path.write_text(json.dumps(config, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

print(f"{len(payload['targets'])} códigos QR SVG gerados em {output}.")
