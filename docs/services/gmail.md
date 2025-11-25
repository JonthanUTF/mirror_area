# 📧 Gmail — Service AREA

## 🔍 Présentation
Gmail permet de déclencher des actions basées sur la réception d’emails et d’envoyer des emails en réaction.  
Authentification : **OAuth2 Google**.

---

# 🔑 Authentification
- Type : OAuth2 (Google)
- Permissions recommandées :
  - `gmail.readonly`
  - `gmail.send`
  - `gmail.modify`

---

# 🎬 Actions (Triggers)

| Action | Description |
|--------|-------------|
| email_received | Un email est reçu |
| email_from_sender | Email reçu d’un expéditeur spécifique |
| email_with_keyword | Email contenant un mot-clé dans le sujet |
| email_with_attachment | Email avec pièce jointe |

---

# ⚡ Réactions (Actions)

| Réaction | Description |
|----------|-------------|
| send_email | Envoie un email |
| forward_email | Fait suivre un email |
| send_email_to_group | Envoie à plusieurs destinataires |

---

# 🔁 Exemples d’AREA

### 📩 Quand je reçois un email avec “Facture” → Sauvegarder dans Dropbox
