# Solution au problème "This site can't be reached"

## Problème
Après la sélection du compte Google, le téléphone affichait "This site can't be reached" car il ne pouvait pas accéder à `http://10.15.192.62:8080`.

## Cause
Le téléphone essayait d'accéder au serveur via son IP locale (10.15.192.62), mais selon la configuration réseau, cette IP n'était pas accessible depuis le téléphone.

## Solution : ADB Reverse

Le script `connect-mobile.sh` utilise `adb reverse` pour rediriger les ports du téléphone vers l'ordinateur.

### Commande appliquée :
```bash
adb reverse tcp:8080 tcp:8080
```

Cette commande fait en sorte que quand l'app sur le téléphone accède à `localhost:8080`, ça redirige vers `localhost:8080` de l'ordinateur.

## Modifications apportées

1. **connect-mobile.sh** - Ajout du port 8080 à la liste des ports à reverser
2. **LoginScreen.kt** - Changement du server IP par défaut de `10.15.192.62` → `localhost`
3. **AppModule.kt** - Changement du DEFAULT_IP de `10.15.192.62` → `localhost`

## Utilisation

### Option 1 : Commande directe (déjà fait)
```bash
adb reverse tcp:8080 tcp:8080
```

### Option 2 : Utiliser le script
```bash
cd client-mobile
./connect-mobile.sh <device_ip:port>
```

## Vérification
```bash
# Lister les redirections actives
adb reverse --list

# Devrait afficher :
# UsbFfs tcp:8080 tcp:8080
```

## Test OAuth maintenant

Avec cette configuration :
1. L'app utilise `http://localhost:8080` pour les requêtes
2. `adb reverse` redirige vers le serveur local
3. L'OAuth devrait fonctionner sans problème de réseau

**Essaye maintenant de te connecter avec Google !** 🚀
