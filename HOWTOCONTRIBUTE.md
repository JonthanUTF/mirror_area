# How to Contribute to AREA Project

Ce guide vous explique comment étendre les fonctionnalités du projet AREA en ajoutant de nouveaux services, actions et réactions.

## Table des Matières

1. [Architecture du Système](#architecture-du-système)
2. [Ajouter un Nouveau Service](#ajouter-un-nouveau-service)
3. [Ajouter des Actions](#ajouter-des-actions)
4. [Ajouter des Réactions](#ajouter-des-réactions)
5. [Tests](#tests)
6. [Pull Request Guidelines](#pull-request-guidelines)

---

## Architecture du Système

### Vue d'ensemble

Le projet AREA suit une architecture en couches :

```
┌─────────────────────────────────────┐
│  Clients (Web + Mobile)             │
├─────────────────────────────────────┤
│  API REST (NestJS Controllers)      │
├─────────────────────────────────────┤
│  Business Logic (Services)          │
├─────────────────────────────────────┤
│  Service Adapters (Intégrations)    │
├─────────────────────────────────────┤
│  Data Layer (TypeORM + PostgreSQL)  │
└─────────────────────────────────────┘
```

### Composants Clés

- **Service Adapter** : Interface entre notre application et une API externe
- **Action** : Événement déclencheur détecté par un adapter
- **Reaction** : Tâche exécutée par un adapter
- **AREA** : Association d'une Action et d'une Reaction

---

## Ajouter un Nouveau Service

### Étape 1 : Créer l'Adapter

Créez un nouveau fichier dans `server/src/services/adapters/` :

```typescript
// server/src/services/adapters/mon-service.adapter.ts
import { Injectable, Logger } from '@nestjs/common';
import { BaseServiceAdapter } from './base.adapter';

@Injectable()
export class MonServiceAdapter extends BaseServiceAdapter {
  private readonly logger = new Logger(MonServiceAdapter.name);
  serviceName = 'mon-service';

  async checkAction(
    actionName: string,
    params: Record<string, any>,
    tokens: { accessToken: string; refreshToken: string },
  ): Promise<{ triggered: boolean; data?: any }> {
    this.logger.debug(`Checking action: ${actionName}`);

    switch (actionName) {
      case 'mon_action':
        return await this.checkMonAction(params, tokens);
      
      default:
        this.logger.warn(`Unknown action: ${actionName}`);
        return { triggered: false };
    }
  }

  async executeReaction(
    reactionName: string,
    params: Record<string, any>,
    actionData: any,
    tokens: { accessToken: string; refreshToken: string },
  ): Promise<void> {
    this.logger.debug(`Executing reaction: ${reactionName}`);

    switch (reactionName) {
      case 'ma_reaction':
        await this.executeManReaction(params, actionData, tokens);
        break;
      
      default:
        throw new Error(`Unknown reaction: ${reactionName}`);
    }
  }

  private async checkMonAction(
    params: Record<string, any>,
    tokens: { accessToken: string },
  ): Promise<{ triggered: boolean; data?: any }> {
    // TODO: Implémenter la logique de vérification
    // 1. Appeler l'API externe avec tokens.accessToken
    // 2. Vérifier si la condition est remplie
    // 3. Retourner { triggered: true, data: ... } si oui

    try {
      // Exemple d'appel API
      const response = await fetch('https://api.monservice.com/endpoint', {
        headers: {
          'Authorization': `Bearer ${tokens.accessToken}`,
        },
      });
      
      const data = await response.json();
      
      // Vérifier votre condition ici
      if (/* condition remplie */) {
        return { triggered: true, data };
      }
      
      return { triggered: false };
    } catch (error) {
      this.logger.error(`Error checking action: ${error.message}`);
      return { triggered: false };
    }
  }

  private async executeManReaction(
    params: Record<string, any>,
    actionData: any,
    tokens: { accessToken: string },
  ): Promise<void> {
    // TODO: Implémenter l'exécution de la réaction
    // 1. Utiliser les params de configuration
    // 2. Utiliser les données de l'action (actionData)
    // 3. Appeler l'API externe pour effectuer l'action

    try {
      await fetch('https://api.monservice.com/action', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokens.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...params,
          triggeredBy: actionData,
        }),
      });
      
      this.logger.log('Reaction executed successfully');
    } catch (error) {
      this.logger.error(`Error executing reaction: ${error.message}`);
      throw error;
    }
  }

  // Si votre service utilise OAuth2 avec refresh tokens
  async refreshTokens(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // Implémenter le refresh des tokens
    const response = await fetch('https://api.monservice.com/oauth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    const data = await response.json();
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token || refreshToken,
    };
  }
}
```

### Étape 2 : Enregistrer l'Adapter

Dans `server/src/services/services.module.ts` :

```typescript
import { MonServiceAdapter } from './adapters/mon-service.adapter';

@Module({
  imports: [TypeOrmModule.forFeature([Service, UserService])],
  providers: [
    ServicesService,
    GitHubAdapter,
    GmailAdapter,
    MonServiceAdapter, // ← Ajouter ici
  ],
  exports: [ServicesService],
})
export class ServicesModule {}
```

Dans `server/src/services/services.service.ts` :

```typescript
constructor(
  @InjectRepository(Service)
  private servicesRepository: Repository<Service>,
  private githubAdapter: GitHubAdapter,
  private gmailAdapter: GmailAdapter,
  private monServiceAdapter: MonServiceAdapter, // ← Ajouter ici
) {
  this.adapters.set('github', githubAdapter);
  this.adapters.set('gmail', gmailAdapter);
  this.adapters.set('mon-service', monServiceAdapter); // ← Ajouter ici
}
```

### Étape 3 : Créer les Entrées en Base de Données

Créez une migration ou un seed pour ajouter votre service :

```typescript
// server/src/database/seeds/add-mon-service.seed.ts
import { Service } from '../../services/entities/service.entity';
import { Action } from '../../areas/entities/action.entity';
import { Reaction } from '../../areas/entities/reaction.entity';

export async function seedMonService(dataSource) {
  const serviceRepo = dataSource.getRepository(Service);
  const actionRepo = dataSource.getRepository(Action);
  const reactionRepo = dataSource.getRepository(Reaction);

  // Créer le service
  const service = serviceRepo.create({
    name: 'Mon Service',
    slug: 'mon-service',
    iconUrl: 'https://example.com/icon.png',
    requiresOAuth: true,
    oauthConfig: {
      authUrl: 'https://api.monservice.com/oauth/authorize',
      tokenUrl: 'https://api.monservice.com/oauth/token',
      clientId: process.env.MON_SERVICE_CLIENT_ID,
      clientSecret: process.env.MON_SERVICE_CLIENT_SECRET,
      scopes: ['read', 'write'],
    },
  });
  
  await serviceRepo.save(service);

  // Créer les actions
  const action = actionRepo.create({
    service,
    name: 'mon_action',
    description: 'Description de mon action',
    parametersSchema: {
      param1: { type: 'string', required: true },
      param2: { type: 'number', required: false, default: 5 },
    },
    triggerType: 'polling', // ou 'webhook'
  });

  await actionRepo.save(action);

  // Créer les réactions
  const reaction = reactionRepo.create({
    service,
    name: 'ma_reaction',
    description: 'Description de ma réaction',
    parametersSchema: {
      message: { type: 'string', required: true },
      priority: { type: 'string', enum: ['low', 'medium', 'high'] },
    },
  });

  await reactionRepo.save(reaction);
}
```

### Étape 4 : Ajouter la Stratégie OAuth2 (si nécessaire)

```typescript
// server/src/auth/strategies/mon-service.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MonServiceStrategy extends PassportStrategy(Strategy, 'mon-service') {
  constructor(private configService: ConfigService) {
    super({
      authorizationURL: 'https://api.monservice.com/oauth/authorize',
      tokenURL: 'https://api.monservice.com/oauth/token',
      clientID: configService.get('MON_SERVICE_CLIENT_ID'),
      clientSecret: configService.get('MON_SERVICE_CLIENT_SECRET'),
      callbackURL: 'http://localhost:8080/auth/mon-service/callback',
      scope: ['read', 'write'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    return {
      accessToken,
      refreshToken,
      profile,
    };
  }
}
```

Enregistrez la stratégie dans `auth.module.ts`.

### Étape 5 : Mettre à Jour le Frontend

#### Ajouter l'Icône et les Infos du Service

```typescript
// client-web/src/utils/services.ts
export const SERVICES = {
  // ... autres services
  'mon-service': {
    name: 'Mon Service',
    icon: '🚀',
    color: '#FF6B6B',
    description: 'Description de mon service',
  },
};
```

#### Créer un Composant de Configuration (optionnel)

```tsx
// client-web/src/components/services/MonServiceConfig.tsx
import React from 'react';

interface Props {
  params: Record<string, any>;
  onChange: (params: Record<string, any>) => void;
}

export const MonServiceConfig: React.FC<Props> = ({ params, onChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          Paramètre 1
        </label>
        <input
          type="text"
          value={params.param1 || ''}
          onChange={(e) => onChange({ ...params, param1: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">
          Paramètre 2
        </label>
        <input
          type="number"
          value={params.param2 || 5}
          onChange={(e) => onChange({ ...params, param2: parseInt(e.target.value) })}
          className="w-full p-2 border rounded"
        />
      </div>
    </div>
  );
};
```

---

## Ajouter des Actions

Pour ajouter une nouvelle action à un service existant :

### 1. Implémenter la Logique dans l'Adapter

```typescript
// Dans votre adapter
async checkAction(actionName: string, params: any, tokens: any) {
  switch (actionName) {
    case 'ma_nouvelle_action':
      return await this.checkNouvelleAction(params, tokens);
    // ... autres cases
  }
}

private async checkNouvelleAction(params: any, tokens: any) {
  // Votre logique ici
  return { triggered: false };
}
```

### 2. Créer l'Entrée en Base de Données

```sql
INSERT INTO actions (service_id, name, description, parameters_schema, trigger_type)
VALUES (
  (SELECT id FROM services WHERE slug = 'mon-service'),
  'ma_nouvelle_action',
  'Description de la nouvelle action',
  '{"param1": {"type": "string", "required": true}}',
  'polling'
);
```

### 3. Documenter les Paramètres

Créez un fichier de documentation :

```markdown
## Action: ma_nouvelle_action

### Description
Cette action se déclenche quand...

### Paramètres
- `param1` (string, requis) : Description du paramètre 1
- `param2` (number, optionnel) : Description du paramètre 2, défaut: 5

### Exemple
\`\`\`json
{
  "param1": "valeur",
  "param2": 10
}
\`\`\`

### Fréquence de vérification
Cette action est vérifiée toutes les 5 minutes.
```

---

## Ajouter des Réactions

Pour ajouter une nouvelle réaction à un service existant :

### 1. Implémenter la Logique dans l'Adapter

```typescript
// Dans votre adapter
async executeReaction(reactionName: string, params: any, actionData: any, tokens: any) {
  switch (reactionName) {
    case 'ma_nouvelle_reaction':
      await this.executeNouvelleReaction(params, actionData, tokens);
      break;
    // ... autres cases
  }
}

private async executeNouvelleReaction(params: any, actionData: any, tokens: any) {
  // Votre logique ici
}
```

### 2. Créer l'Entrée en Base de Données

```sql
INSERT INTO reactions (service_id, name, description, parameters_schema)
VALUES (
  (SELECT id FROM services WHERE slug = 'mon-service'),
  'ma_nouvelle_reaction',
  'Description de la nouvelle réaction',
  '{"message": {"type": "string", "required": true}}'
);
```

---

## Tests

### Tests Unitaires de l'Adapter

```typescript
// server/src/services/adapters/mon-service.adapter.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { MonServiceAdapter } from './mon-service.adapter';

describe('MonServiceAdapter', () => {
  let adapter: MonServiceAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MonServiceAdapter],
    }).compile();

    adapter = module.get<MonServiceAdapter>(MonServiceAdapter);
  });

  describe('checkAction', () => {
    it('should return triggered: false when condition is not met', async () => {
      const result = await adapter.checkAction(
        'mon_action',
        { param1: 'test' },
        { accessToken: 'fake-token', refreshToken: 'fake-refresh' },
      );

      expect(result.triggered).toBe(false);
    });

    it('should return triggered: true with data when condition is met', async () => {
      // Mock l'API externe
      jest.spyOn(global, 'fetch').mockResolvedValue({
        json: async () => ({ data: 'test' }),
      } as any);

      const result = await adapter.checkAction(
        'mon_action',
        { param1: 'test' },
        { accessToken: 'fake-token', refreshToken: 'fake-refresh' },
      );

      expect(result.triggered).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('executeReaction', () => {
    it('should execute reaction successfully', async () => {
      const mockFetch = jest.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
      } as any);

      await adapter.executeReaction(
        'ma_reaction',
        { message: 'test' },
        { data: 'action-data' },
        { accessToken: 'fake-token', refreshToken: 'fake-refresh' },
      );

      expect(mockFetch).toHaveBeenCalled();
    });
  });
});
```

### Tests d'Intégration

```typescript
// server/test/mon-service-integration.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('MonService Integration (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Login pour obtenir un token
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password' });
    
    authToken = response.body.access_token;
  });

  it('should create an AREA with mon-service action', async () => {
    const response = await request(app.getHttpServer())
      .post('/areas')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Test AREA',
        actionId: 'mon-action-id',
        actionParams: { param1: 'test' },
        reactionId: 'some-reaction-id',
        reactionParams: { message: 'test' },
      });

    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });
});
```

---

## Pull Request Guidelines

### Avant de Soumettre

1. **Tester localement** :
   ```bash
   npm run test
   npm run test:e2e
   npm run lint
   ```

2. **Vérifier le build Docker** :
   ```bash
   docker-compose build
   docker-compose up
   ```

3. **Documenter** :
   - Mettre à jour le README.md si nécessaire
   - Créer/mettre à jour la documentation de l'API
   - Ajouter des commentaires dans le code

### Format de la PR

**Titre** : `feat: Add [Service Name] integration`

**Description** :
```markdown
## Description
Ajoute l'intégration avec [Service Name] incluant :
- Action: [liste des actions]
- Reaction: [liste des réactions]

## Motivation
Pourquoi ce service est utile pour AREA...

## Testing
- [ ] Tests unitaires ajoutés
- [ ] Tests d'intégration ajoutés
- [ ] Testé manuellement avec vraie API
- [ ] Build Docker fonctionne

## Checklist
- [ ] Code suit les conventions du projet
- [ ] Documentation mise à jour
- [ ] Pas de secrets/tokens dans le code
- [ ] Variables d'environnement documentées dans .env.example
- [ ] Frontend mis à jour si nécessaire

## Screenshots
[Si applicable, ajouter des captures d'écran]
```

### Code Review Checklist

Les reviewers vérifieront :
- ✅ Sécurité : Pas de secrets hardcodés
- ✅ Error handling : Try/catch appropriés
- ✅ Logging : Logs clairs et utiles
- ✅ Performance : Pas de boucles infinies, rate limiting respecté
- ✅ Tests : Coverage > 80%
- ✅ Documentation : Claire et complète
- ✅ Code style : Conforme à ESLint/Prettier

---

## Ressources

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [OAuth 2.0 Specification](https://oauth.net/2/)
- [API Design Best Practices](https://restfulapi.net/)

## Questions ?

Ouvrez une issue sur GitHub avec le tag `question` ou contactez l'équipe sur Discord.

---

**Bon courage et merci de contribuer au projet AREA ! 🚀**