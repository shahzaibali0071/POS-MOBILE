"""Builds src/data/products.json from the ALI MOBILE POS database.

Run: python scripts/pos_to_catalog.py <mobile_pos.db | pos-rows.json> <photos_dir>
Only in-stock items with a selling price go online. Cost prices and stock
counts never leave the shop. Replica ("copy") items are not listed online.
"""
import json, re, sqlite3, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
NOT_FOR_SALE = {52, 72, 109, 110, 177}   # mixed cover lot, Easy Paisa, print, photocopy, broken panels
REPLICAS = {91}                          # AirPods-style item listed under brand "Iphone"
REPLICA_WORDS = re.compile(r"\bcopy\b", re.I)
TOP_SELLERS = 12

CATEGORIES = [  # slug, name, blurb, art
    ("earbuds", "Earbuds & Neckbands", "Wireless earbuds and neckbands", "earbuds"),
    ("handsfree", "Handsfree", "Wired earphones with mic", "handsfree"),
    ("chargers", "Chargers", "Wall, car and laptop chargers", "charger"),
    ("cables", "Cables", "Charging, audio and display cables", "cable"),
    ("power-banks", "Power Banks", "Charge on the go", "powerbank"),
    ("audio", "Speakers & Mics", "Speakers and wireless microphones", "speaker"),
    ("smart-watches", "Smart Watches", "Fitness and calling watches", "watch"),
    ("computer", "Computer", "Mice, keyboards, USB drives and more", "cable"),
    ("mobiles", "Mobile Phones", "Keypad phones", "watch"),
    ("accessories", "Accessories", "Protectors, holders, batteries and more", "handsfree"),
]

def category_for(cat, name):
    c, n = (cat or "").strip().lower(), (name or "").lower()
    if c in ("wireless",) or "earbud" in n or "neck" in n: return "earbuds"
    if c in ("handfree", "headphone"): return "handsfree"
    if ("type c" in n or "cable" in n) and "charger" not in n: return "cables"
    if "charger" in c or "charger" in n: return "chargers"
    if c in ("powerbank", "powerbanks"): return "power-banks"
    if c in ("speaker", "microphone"): return "audio"
    if c == "watch": return "smart-watches"
    if c == "mobile" or re.match(r"keypad( mobile| phone)?$", n.strip()): return "mobiles"
    if c in ("mouse", "keyboard", "usb", "memory card", "display converter", "wireless adapter", "matts",
             "wireless set", "computer", "tv box") or "usb" in n and "gb" in n or "mouse" in n: return "computer"
    if "cable" in c or c in ("datacable", "datacqble", "converter", "aux cable", "otg") or "spliter" in n or "c-c" in n: return "cables"
    return "accessories"

def clean(s):
    s = re.sub(r"\s+", " ", (s or "").strip())
    return "" if s.lower() in ("", "local", "non", "none", "mix", "all", "new", "latest", "china") else s

def slugify(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")

FIELDS = ("id", "name", "brand_name", "model", "category", "sale_price", "stock_qty")

def rows_from_db(db_path):
    db = sqlite3.connect(db_path); db.row_factory = sqlite3.Row
    sold = {r[0]: r[1] for r in db.execute("SELECT product_id, SUM(qty) FROM sale_items GROUP BY product_id")}
    rows = [dict(r) for r in db.execute(f"SELECT {', '.join(FIELDS)} FROM products ORDER BY id")]
    return rows, sold

def rows_from_json(path):
    """Rows the POS pushed to the website (PUT /api/pos/products): same columns plus sold_qty."""
    rows = json.load(open(path))["products"]
    return rows, {r["id"]: r.get("sold_qty") or 0 for r in rows}

def main(source, photos_dir):
    rows, sold = rows_from_json(source) if source.endswith(".json") else rows_from_db(source)
    rows = sorted((r for r in rows if (r["stock_qty"] or 0) > 0 and (r["sale_price"] or 0) > 0), key=lambda r: r["id"])
    photos = Path(photos_dir)
    out = []
    for r in rows:
        text = " ".join(str(r[k] or "") for k in ("name", "brand_name", "model"))
        if r["id"] in NOT_FOR_SALE | REPLICAS or REPLICA_WORDS.search(text):
            continue
        brand, model = clean(r["brand_name"]), clean(r["model"])
        if model.lower() == brand.lower() or model.lower() in (r["name"] or "").lower():
            model = ""
        name = clean(r["name"]) or (r["name"] or "").strip()
        name = name[:1].upper() + name[1:]
        title = f"{name} ({model.upper()})" if model else name
        cat = category_for(r["category"], r["name"])
        has_photo = (photos / f"{r['id']}.webp").exists()
        specs = [["Brand", brand or "Generic"]] + ([["Model", model.upper()]] if model else []) + \
                [["Category", next(c[1] for c in CATEGORIES if c[0] == cat)]]
        out.append({
            "posId": r["id"],
            "slug": f"{slugify(f'{brand} {name} {model}')}-{r['id']}",
            "model": brand,
            "name": title,
            "category": cat,
            "tagline": next(c[2] for c in CATEGORIES if c[0] == cat),
            "price": round(float(r["sale_price"])),
            "image": f"/products/{r['id']}.webp" if has_photo else None,
            "specs": specs,
        })
    # Only a best-seller rank (1 = most sold) for the top items goes public, never sales counts.
    top = sorted((p for p in out if sold.get(p["posId"])), key=lambda p: -sold[p["posId"]])[:TOP_SELLERS]
    for rank, p in enumerate(top, 1):
        p["bestSellerRank"] = rank
    used = {p["category"] for p in out}
    cats = [{"slug": s, "name": n, "blurb": b, "art": a} for s, n, b, a in CATEGORIES if s in used]
    json.dump({"categories": cats, "products": out}, open(ROOT / "src/data/products.json", "w"), indent=1)
    print(len(out), "products,", sum(1 for p in out if p["image"]), "with photos;", len(cats), "categories")

if __name__ == "__main__":
    main(*sys.argv[1:3])
