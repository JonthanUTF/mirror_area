# Scripts

Utilitaires fournis dans `scripts/`.

puml_to_csv.py
- Convertit des fichiers PlantUML (.puml, .plantuml) en CSV listant les nœuds et relations.

Exemples :

```bash
# extraire depuis le dossier docs/poc
python3 scripts/puml_to_csv.py docs/poc -o docs/poc/puml_edges.csv

# extraire depuis un fichier
python3 scripts/puml_to_csv.py docs/poc/web-react/diagram.puml -o react_diagram.csv
```
