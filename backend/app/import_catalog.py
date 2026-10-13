"""Validate a reviewed catalog; optionally upsert it into PostgreSQL."""
import argparse
import json
import os
from pathlib import Path
from .catalog import SEED, validate_catalog

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('path',type=Path,nargs='?',default=SEED)
    parser.add_argument('--database',action='store_true')
    args=parser.parse_args()
    vehicles=validate_catalog(json.loads(args.path.read_text()))
    if args.database:
        import psycopg
        from psycopg.types.json import Jsonb
        with psycopg.connect(os.environ['DATABASE_URL'],connect_timeout=5) as conn:
            conn.execute('CREATE TABLE IF NOT EXISTS vehicles (id TEXT PRIMARY KEY, payload JSONB NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT now())')
            for v in vehicles:
                conn.execute('INSERT INTO vehicles (id,payload) VALUES (%s,%s) ON CONFLICT (id) DO UPDATE SET payload=EXCLUDED.payload, updated_at=now()', (v.id,Jsonb(v.model_dump(mode='json'))))
    print(f'Validated {len(vehicles)} vehicles' + ('; database upsert complete' if args.database else ''))

if __name__ == '__main__': main()
