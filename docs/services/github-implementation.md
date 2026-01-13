# GitHub Service Implementation

## Overview
The GitHub service has been successfully implemented with full OAuth2 authentication and support for various actions (triggers) and reactions.

## Features Implemented

### ✅ OAuth2 Authentication
- Scopes: `repo`, `read:org`, `user`
- Authorization endpoint: `/api/services/github/connect`
- Callback handling: `/api/services/github/callback`

### ✅ Actions (Triggers)

| Action | Description | Parameters |
|--------|-------------|------------|
| `issue_created` | Detects when a new issue is created | owner, repo |
| `pr_opened` | Detects when a PR is opened | owner, repo |
| `push_committed` | Detects new commits to a branch | owner, repo, branch |
| `release_published` | Detects when a release is published | owner, repo |
| `repo_starred` | Detects when someone stars the repo | owner, repo |

### ✅ Reactions (Actions)

| Reaction | Description | Parameters |
|----------|-------------|------------|
| `create_issue` | Creates a new issue | owner, repo, title, body, labels |
| `comment_issue` | Comments on an issue/PR | owner, repo, issue_number, body |
| `create_file` | Creates or updates a file | owner, repo, path, content, message, branch |
| `create_release` | Creates a new release | owner, repo, tag_name, name, body, draft, prerelease |

## Configuration

### Environment Variables
Add to your `.env` file:
```env
GITHUB_CLIENT_ID=your-github-oauth-app-client-id
GITHUB_CLIENT_SECRET=your-github-oauth-app-secret
```

### Create GitHub OAuth App
1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Set callback URL to: `http://localhost:8081/services/callback`
4. Copy the Client ID and Client Secret to your `.env`

## Usage Examples

### Example 1: Issue Created → Send Console Log
```json
{
  "name": "Monitor Issues",
  "actionService": "github",
  "actionType": "issue_created",
  "reactionService": "console",
  "reactionType": "log_message",
  "parameters": {
    "owner": "yourusername",
    "repo": "your-repo",
    "message": "New issue created!"
  }
}
```

### Example 2: Timer → Create GitHub Issue
```json
{
  "name": "Daily Report Issue",
  "actionService": "timer",
  "actionType": "schedule",
  "reactionService": "github",
  "reactionType": "create_issue",
  "parameters": {
    "targetTime": "2026-01-06T09:00:00Z",
    "owner": "yourusername",
    "repo": "your-repo",
    "title": "Daily Report",
    "body": "Automated daily report issue",
    "labels": ["automated", "report"]
  }
}
```

### Example 3: New Release → Create File
```json
{
  "name": "Document Release",
  "actionService": "github",
  "actionType": "release_published",
  "reactionService": "github",
  "reactionType": "create_file",
  "parameters": {
    "owner": "yourusername",
    "repo": "your-repo",
    "path": "releases/latest.md",
    "content": "# Latest Release\\n\\nNew release detected!",
    "message": "Update latest release documentation",
    "branch": "main"
  }
}
```

## API Endpoints

### Connect GitHub Account
```bash
# Get authorization URL
GET /api/services/github/connect
Authorization: Bearer <jwt_token>

Response:
{
  "url": "https://github.com/login/oauth/authorize?client_id=..."
}
```

### Complete OAuth Flow
```bash
# After user authorizes, frontend sends code
POST /api/services/github/callback
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "code": "authorization_code_from_github",
  "redirectUri": "http://localhost:8081/services/callback"
}

Response:
{
  "message": "Service connected successfully",
  "connected": true
}
```

## Technical Details

### Implementation Files
- Service: `/server/src/services/implementations/GitHubService.js`
- Routes: `/server/src/routes/services.js` (GitHub OAuth added)
- Loader: `/server/src/services/loader.js` (registered)
- Seed: `/server/seed.js` (GitHub service entry)

### Dependencies
- `@octokit/rest`: Official GitHub REST API client
- Dynamic ES Module import for Node.js 18 compatibility

### Database
GitHub service is registered in the `services` table with:
- name: `github`
- label: `GitHub`
- icon: GitHub icon URL
- active: `true`

User tokens are stored in `user_services` table with:
- accessToken
- refreshToken (if available)
- expiresAt

## Testing

### Verify Service Registration
```bash
curl http://localhost:8080/about.json | jq '.server.services[] | select(.name=="github")'
```

### Test Connection Flow
1. Register/login to get JWT token
2. Call `/api/services/github/connect` with JWT
3. Visit returned URL to authorize
4. Complete callback with authorization code
5. Verify connection in `/api/services/` endpoint

## Automation Loop
The service checks for triggers every 10 seconds (configurable). Each action compares the latest activity timestamp with the `lastTriggered` field to detect new events.

## Notes
- Requires user to connect their GitHub account via OAuth2
- Tokens are stored securely in the database
- All API calls use the user's GitHub token for authentication
- Rate limits apply per GitHub's API limits
- Supports both public and private repositories (with appropriate permissions)
