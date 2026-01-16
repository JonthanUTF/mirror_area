# Services Intégrés# � Services Intégrés



Guide des services disponibles dans l'application AREA pour créer des automatisations.Guide des services disponibles dans l'application AREA pour créer des automatisations.



## Vue d'ensemble## Vue d'ensemble



AREA permet de connecter différents services web pour créer des automatisations. Chaque service peut fournir :AREA permet de connecter différents services web pour créer des automatisations. Chaque service peut fournir :



- Actions (Triggers) : Événements qui déclenchent une automatisation- **Actions (Triggers)** : Événements qui déclenchent une automatisation

- Réactions : Actions exécutées en réponse à un trigger- **Réactions** : Actions exécutées en réponse à un trigger



## Services Disponibles## Services Disponibles



| Service | Type | OAuth | Actions | Réactions || Service | Type | OAuth | Actions | Réactions |

|---------|------|-------|---------|-----------||---------|------|-------|---------|-----------|

| [Google (Gmail)](gmail.md) | Email | Oui | 5 | 1 || [Google (Gmail)](gmail.md) | Email | ✅ | 5 | 1 |

| [GitHub](github.md) | Code | Oui | 5 | 4 || [GitHub](github.md) | Code | ✅ | 5 | 4 |

| [Dropbox](dropbox.md) | Stockage | Oui | 3 | 3 || [Dropbox](dropbox.md) | Stockage | ✅ | 3 | 3 |

| [Twitch](twitch.md) | Streaming | Oui | 1 | 1 || [Twitch](twitch.md) | Streaming | ✅ | 1 | 1 |

| [Microsoft](microsoft.md) | Cloud | Oui | 4 | 3 || [Microsoft](microsoft.md) | Cloud | ✅ | 4 | 3 |

| [Timer](timer.md) | Utilitaire | Non | 1 | 0 || [Timer](timer.md) | Utilitaire | ❌ | 1 | 0 |

| [Console](console.md) | Debug | Non | 0 | 1 || [Console](console.md) | Debug | ❌ | 0 | 1 |



## Comment connecter un service ?## Comment connecter un service ?



### Depuis le Web### Depuis le Web



1. Allez dans Paramètres puis Services1. Allez dans **Paramètres** → **Services**

2. Cliquez sur Connecter à côté du service souhaité2. Cliquez sur **Connecter** à côté du service souhaité

3. Autorisez l'accès via la page OAuth du fournisseur3. Autorisez l'accès via la page OAuth du fournisseur

4. Vous êtes redirigé vers l'application, le service est connecté4. Vous êtes redirigé vers l'application - le service est connecté !



### Depuis l'Application Mobile### Depuis l'Application Mobile



1. Allez dans l'onglet Services1. Allez dans l'onglet **Services**

2. Appuyez sur le service à connecter2. Appuyez sur le service à connecter

3. Complétez l'authentification OAuth dans le navigateur3. Complétez l'authentification OAuth dans le navigateur

4. Retournez dans l'application4. Retournez dans l'application



## Créer une AREA## Créer une AREA



Une fois vos services connectés, vous pouvez créer des automatisations.Une fois vos services connectés, vous pouvez créer des automatisations :



### Étapes### Étapes



1. Choisir l'Action (Trigger)1. **Choisir l'Action** (Trigger)

   - Sélectionnez un service (ex: Twitch)   - Sélectionnez un service (ex: Twitch)

   - Sélectionnez un type d'action (ex: Streamer en live)   - Sélectionnez un type d'action (ex: "Streamer en live")

   - Configurez les paramètres (ex: nom du streamer)   - Configurez les paramètres (ex: nom du streamer)



2. Choisir la Réaction2. **Choisir la Réaction**

   - Sélectionnez un service (ex: Gmail)   - Sélectionnez un service (ex: Gmail)

   - Sélectionnez un type de réaction (ex: Envoyer un email)   - Sélectionnez un type de réaction (ex: "Envoyer un email")

   - Configurez les paramètres (ex: destinataire, sujet, contenu)   - Configurez les paramètres (ex: destinataire, sujet, contenu)



3. Nommer et Activer3. **Nommer et Activer**

   - Donnez un nom descriptif à votre AREA   - Donnez un nom descriptif à votre AREA

   - Activez l'automatisation   - Activez l'automatisation



### Exemple d'AREA### Exemple d'AREA



Notification quand un streamer est en live :**"Notification quand un streamer est en live"**



``````

Action: Twitch -> streamer_liveAction: Twitch → streamer_live

  username: "ninja"  └─ username: "ninja"



Réaction: Google -> send_emailRéaction: Google → send_email

  recipient: "me@example.com"  └─ recipient: "me@example.com"

  subject: "Ninja est en live!"  └─ subject: "🔴 Ninja est en live!"

  body: "Votre streamer préféré vient de commencer à diffuser."  └─ body: "Votre streamer préféré vient de commencer à diffuser."

``````



## Services détaillés## Services détaillés



- [Gmail](gmail.md) - Emails via Google- [📧 Gmail](gmail.md) - Emails via Google

- [GitHub](github.md) - Gestion de code et repositories- [🐙 GitHub](github.md) - Gestion de code et repositories

- [Dropbox](dropbox.md) - Stockage cloud et fichiers- [📦 Dropbox](dropbox.md) - Stockage cloud et fichiers

- [Twitch](twitch.md) - Streaming et notifications- [🎮 Twitch](twitch.md) - Streaming et notifications

- [Microsoft](microsoft.md) - OneDrive et Outlook- [🪟 Microsoft](microsoft.md) - OneDrive et Outlook

- [Timer](timer.md) - Planification temporelle- [⏱️ Timer](timer.md) - Planification temporelle

- [Console](console.md) - Débogage et logs- [🖥️ Console](console.md) - Débogage et logs

