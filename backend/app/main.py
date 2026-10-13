import logging
import time
import uuid
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from .catalog import get_catalog
from .engines import rank, tco
from .schemas import Preferences, TCOInput

app = FastAPI(title='DriveMatch API', version='0.1.0')
log = logging.getLogger('uvicorn.error')

@app.middleware('http')
async def trace(request: Request, call_next):
    started = time.perf_counter()
    request_id = uuid.uuid4().hex
    try:
        response = await call_next(request)
    except Exception:
        # Do not log connection strings or request bodies.
        log.error('request_id=%s failed', request_id)
        response = JSONResponse(status_code=503, content={'detail':'服務暫時無法使用，請稍後重試。'})
    response.headers['X-Request-ID'] = request_id
    log.info('%s %s status=%s ms=%.1f request_id=%s',request.method,request.url.path,response.status_code,(time.perf_counter()-started)*1000,request_id)
    return response

@app.get('/api/health')
def health():
    return {'status':'ok', 'vehicles':len(get_catalog())}

@app.get('/api/vehicles')
def vehicles():
    return get_catalog()

@app.post('/api/recommendations')
def recommendations(p: Preferences):
    catalog = get_catalog()
    if p.current_id not in {v.id for v in catalog}:
        raise HTTPException(422,'未知的目前車款')
    return rank(catalog,p)

@app.post('/api/tco')
def calculate(i: TCOInput):
    return tco(i)
