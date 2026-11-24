"""Sends the POS product list to the website ("Update website").

Run on the shop PC:  python scripts/pos_push.py <mobile_pos.db> [site]
The POS key is read from the POS_API_KEY environment variable (never put it in this file).
The website saves the list and rebuilds itself; changes show online in about 2 minutes.
"""
import json, os, sys, urllib.error, urllib.request
from pos_to_catalog import rows_from_db

def main(db_path, site="https://voltix-store-zeta.vercel.app"):
    key = os.environ.get("POS_API_KEY")
    if not key:
        sys.exit("Set POS_API_KEY first (same value as in the Vercel project).")
    rows, sold = rows_from_db(db_path)
    body = json.dumps({"products": [{**r, "sold_qty": sold.get(r["id"], 0)} for r in rows]}).encode()
    req = urllib.request.Request(f"{site.rstrip('/')}/api/pos/products", data=body, method="PUT",
                                 headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=60) as res:
            print(json.load(res))
    except urllib.error.HTTPError as e:
        sys.exit(f"Website refused the update ({e.code}): {e.read().decode(errors='replace')}")

if __name__ == "__main__":
    main(*sys.argv[1:3])
