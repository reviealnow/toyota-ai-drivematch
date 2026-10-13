import json
import os
from pathlib import Path
from .schemas import Vehicle

SEED = Path(__file__).resolve().parents[2] / 'data/seed/vehicles.json'
# Local checkout stores data one level above backend; container uses /app/data.
if not SEED.exists():
    SEED = Path(__file__).resolve().parents[2].parent / 'data/seed/vehicles.json'

def validate_catalog(raw):
    vehicles = [Vehicle.model_validate(v) for v in raw]
    ids = [v.id for v in vehicles]
    if len(ids) != len(set(ids)):
        raise ValueError('Duplicate vehicle IDs')
    return vehicles

def get_catalog():
    dsn = os.getenv('DATABASE_URL')
    if dsn:
        import psycopg
        with psycopg.connect(dsn, connect_timeout=5) as conn:
            raw = [row[0] for row in conn.execute('SELECT payload FROM vehicles ORDER BY id')]
        return validate_catalog(raw)
    return validate_catalog(json.loads(SEED.read_text()))
