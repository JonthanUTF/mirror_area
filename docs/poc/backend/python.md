# POC Backend — Python (FastAPI + RQ)

Ce POC illustre une API de gestion de tâches qui enfile des jobs dans une queue Redis et les exécute avec un worker RQ (ou Dramatiq). Utile pour démontrer traitement asynchrone, latence d'enqueue et débit du worker.

Objectifs
- Accepter des tâches longues via HTTP (POST /tasks) et exposer leur statut via GET /tasks/{id}.
- Mesurer le débit d'enqueueing et la vitesse de traitement du worker.

Contract API (JSON)

- POST /tasks
  - body: { "type": "string", "payload": {...} }
  - 202 { "task_id": "uuid" }
- GET /tasks/{task_id}
  - 200 { "status": "queued|running|success|failed", "result": {...} }
- GET /health -> 200 {"status":"ok"}

Stack recommandée
- Python 3.11+
- FastAPI (ASGI)
- Uvicorn (server)
- Redis + RQ (ou Dramatiq)
- SQLAlchemy + SQLite pour la persistence minimale (optionnel)

Scaffold rapide

```bash
mkdir -p poc/backend/Python/tasker
cd poc/backend/Python/tasker
python3 -m venv .venv
source .venv/bin/activate
pip install fastapi uvicorn[standard] rq redis sqlalchemy
```

Exemple minimal (esquisse)

```py
# app.py
from fastapi import FastAPI
from redis import Redis
from rq import Queue
import uuid

app = FastAPI()
redis = Redis()
q = Queue(connection=redis)

def work(payload):
    # long running simulation
    import time
    time.sleep(2)
    return {'ok': True, 'payload': payload}

@app.post('/tasks')
def create_task(body: dict):
    task_id = str(uuid.uuid4())
    job = q.enqueue(work, body)
    return { 'task_id': job.get_id() }

@app.get('/health')
def health():
    return {'status':'ok'}

```

Lancer le worker

```bash
# dans le même venv
rq worker
```

Docker compose (suggestion pour dev)

```yaml
version: '3.8'
services:
  redis:
    image: redis:7
    ports: ['6379:6379']
  api:
    build: ./poc/backend/Python/tasker
    command: uvicorn app:app --host 0.0.0.0 --port 8000 --reload
    ports: ['8000:8000']
    depends_on: ['redis']
  worker:
    build: ./poc/backend/Python/tasker
    command: rq worker
    depends_on: ['redis']
```

Bench & tests

- Charge d'enqueue (POST): mesure du temps pour push N tâches (ex: `hey -n 1000 -c 50 http://localhost:8000/tasks`)
- Worker throughput : mesurer nombre de jobs traités par seconde (dépend du `work` func)

Critères de succès
- Enqueue rapide (<50ms) en condition non saturée
- Worker capable de traiter un nombre attendu de jobs/sec selon la charge du job

Où est le code
- Le POC Python est dans `poc/backend/Python/`.

Extensions possibles
- Utiliser Celery pour workflows complexes, ajouter WebSocket pour notifier l'avancement, utiliser Postgres pour la persistence des tâches.
