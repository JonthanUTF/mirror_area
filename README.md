# mirror_area

Documentation du projet mirror_area

Site de documentation : https://JonthanUTF.github.io/mirror_area/

## Rapide
- Documentation (MkDocs) : accessible via le lien ci-dessus.
- Code source : ce dépôt GitHub.

## Contribuer
1. Clone le dépôt
2. Crée une branche pour ta feature/fix
3. Ouvre une Pull Request

## Développement local de la documentation
Installer et servir la doc localement :

```bash
# créer et activer un environnement virtuel (optionnel)
python3 -m venv .venv
source .venv/bin/activate

pip install mkdocs mkdocs-material
mkdocs serve
```

## Lancer

Avant de lancer veuillez créer votre `.env` en suivant l'example de `.env.example`.

Puis:
```bash
docker-compose up --build -d
```

Puis stopper avec:
```bash
docker-compose down
```

(Penser à stopper avant de relancer)