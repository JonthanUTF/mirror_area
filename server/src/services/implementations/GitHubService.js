const ServiceBase = require('../ServiceBase');
const { UserService, Service } = require('../../models');

let Octokit;

// Dynamic import for ES Module
async function getOctokitClass() {
    if (!Octokit) {
        const octokitModule = await import('@octokit/rest');
        Octokit = octokitModule.Octokit;
    }
    return Octokit;
}

class GitHubService extends ServiceBase {
    constructor() {
        super('github', 'GitHub', 'http://localhost:8080/assets/github-icon.png');

        // Actions (Triggers)
        this.registerAction('issue_created', 'An issue is created in a repository', {
            owner: 'string',
            repo: 'string'
        });

        this.registerAction('pr_opened', 'A pull request is opened', {
            owner: 'string',
            repo: 'string'
        });

        this.registerAction('push_committed', 'A commit is pushed to a repository', {
            owner: 'string',
            repo: 'string',
            branch: 'string'
        });

        this.registerAction('release_published', 'A new release is published', {
            owner: 'string',
            repo: 'string'
        });

        this.registerAction('repo_starred', 'A user stars the repository', {
            owner: 'string',
            repo: 'string'
        });

        // Reactions (Actions)
        this.registerReaction('create_issue', 'Create an issue in a repository', {
            owner: 'string',
            repo: 'string',
            title: 'string',
            body: 'string',
            labels: 'array'
        });

        this.registerReaction('comment_issue', 'Comment on an issue or pull request', {
            owner: 'string',
            repo: 'string',
            issue_number: 'number',
            body: 'string'
        });

        this.registerReaction('create_file', 'Create or update a file in a repository', {
            owner: 'string',
            repo: 'string',
            path: 'string',
            content: 'string',
            message: 'string',
            branch: 'string'
        });

        this.registerReaction('create_release', 'Create a new release', {
            owner: 'string',
            repo: 'string',
            tag_name: 'string',
            name: 'string',
            body: 'string',
            draft: 'boolean',
            prerelease: 'boolean'
        });
    }

    /**
     * Get authenticated Octokit instance for a user
     */
    async getOctokit(userId) {
        const OctokitClass = await getOctokitClass();
        
        const service = await Service.findOne({ where: { name: 'github' } });
        if (!service) {
            throw new Error('GitHub service not found');
        }

        const userService = await UserService.findOne({
            where: { userId, serviceId: service.id }
        });

        if (!userService || !userService.accessToken) {
            throw new Error('GitHub not connected for this user');
        }

        return new OctokitClass({
            auth: userService.accessToken
        });
    }

    /**
     * Check if a trigger condition is met
     */
    async checkTrigger(action, area, params) {
        try {
            const octokit = await this.getOctokit(area.userId);
            const { owner, repo, branch } = params;

            switch (action) {
                case 'issue_created':
                    return await this.checkIssueCreated(octokit, owner, repo, area.lastTriggered);

                case 'pr_opened':
                    return await this.checkPROpened(octokit, owner, repo, area.lastTriggered);

                case 'push_committed':
                    return await this.checkPushCommitted(octokit, owner, repo, branch, area.lastTriggered);

                case 'release_published':
                    return await this.checkReleasePublished(octokit, owner, repo, area.lastTriggered);

                case 'repo_starred':
                    return await this.checkRepoStarred(octokit, owner, repo, area.lastTriggered);

                default:
                    return false;
            }
        } catch (error) {
            console.error(`[GitHubService] Error checking trigger ${action}:`, error.message);
            return false;
        }
    }

    /**
     * Execute a reaction
     */
    async executeReaction(reaction, area, params) {
        try {
            const octokit = await this.getOctokit(area.userId);

            switch (reaction) {
                case 'create_issue':
                    return await this.createIssue(octokit, params);

                case 'comment_issue':
                    return await this.commentIssue(octokit, params);

                case 'create_file':
                    return await this.createFile(octokit, params);

                case 'create_release':
                    return await this.createRelease(octokit, params);

                default:
                    throw new Error(`Unknown reaction: ${reaction}`);
            }
        } catch (error) {
            console.error(`[GitHubService] Error executing reaction ${reaction}:`, error.message);
            throw error;
        }
    }

    // ===== TRIGGER IMPLEMENTATIONS =====

    async checkIssueCreated(octokit, owner, repo, lastTriggered) {
        const since = lastTriggered ? lastTriggered.toISOString() : undefined;
        
        const { data: issues } = await octokit.issues.listForRepo({
            owner,
            repo,
            state: 'all',
            sort: 'created',
            direction: 'desc',
            per_page: 10,
            since
        });

        const newIssues = issues.filter(issue => {
            if (!issue.pull_request) { // Exclude PRs
                const createdAt = new Date(issue.created_at);
                return !lastTriggered || createdAt > new Date(lastTriggered);
            }
            return false;
        });

        if (newIssues.length > 0) {
            console.log(`[GitHubService] Found ${newIssues.length} new issue(s) in ${owner}/${repo}`);
            return true;
        }

        return false;
    }

    async checkPROpened(octokit, owner, repo, lastTriggered) {
        const { data: pulls } = await octokit.pulls.list({
            owner,
            repo,
            state: 'all',
            sort: 'created',
            direction: 'desc',
            per_page: 10
        });

        const newPRs = pulls.filter(pr => {
            const createdAt = new Date(pr.created_at);
            return !lastTriggered || createdAt > new Date(lastTriggered);
        });

        if (newPRs.length > 0) {
            console.log(`[GitHubService] Found ${newPRs.length} new PR(s) in ${owner}/${repo}`);
            return true;
        }

        return false;
    }

    async checkPushCommitted(octokit, owner, repo, branch = 'main', lastTriggered) {
        const { data: commits } = await octokit.repos.listCommits({
            owner,
            repo,
            sha: branch,
            per_page: 10
        });

        const newCommits = commits.filter(commit => {
            const commitDate = new Date(commit.commit.author.date);
            return !lastTriggered || commitDate > new Date(lastTriggered);
        });

        if (newCommits.length > 0) {
            console.log(`[GitHubService] Found ${newCommits.length} new commit(s) in ${owner}/${repo}/${branch}`);
            return true;
        }

        return false;
    }

    async checkReleasePublished(octokit, owner, repo, lastTriggered) {
        const { data: releases } = await octokit.repos.listReleases({
            owner,
            repo,
            per_page: 10
        });

        const newReleases = releases.filter(release => {
            const publishedAt = new Date(release.published_at);
            return !lastTriggered || publishedAt > new Date(lastTriggered);
        });

        if (newReleases.length > 0) {
            console.log(`[GitHubService] Found ${newReleases.length} new release(s) in ${owner}/${repo}`);
            return true;
        }

        return false;
    }

    async checkRepoStarred(octokit, owner, repo, lastTriggered) {
        const { data: stargazers } = await octokit.activity.listStargazersForRepo({
            owner,
            repo,
            per_page: 30,
            headers: {
                accept: 'application/vnd.github.v3.star+json' // To get starred_at timestamp
            }
        });

        const newStars = stargazers.filter(star => {
            const starredAt = new Date(star.starred_at);
            return !lastTriggered || starredAt > new Date(lastTriggered);
        });

        if (newStars.length > 0) {
            console.log(`[GitHubService] Found ${newStars.length} new star(s) in ${owner}/${repo}`);
            return true;
        }

        return false;
    }

    // ===== REACTION IMPLEMENTATIONS =====

    async createIssue(octokit, params) {
        const { owner, repo, title, body, labels } = params;

        const { data: issue } = await octokit.issues.create({
            owner,
            repo,
            title: title || 'New Issue',
            body: body || '',
            labels: labels || []
        });

        console.log(`[GitHubService] Created issue #${issue.number} in ${owner}/${repo}`);
        return { success: true, issueNumber: issue.number, url: issue.html_url };
    }

    async commentIssue(octokit, params) {
        const { owner, repo, issue_number, body } = params;

        const { data: comment } = await octokit.issues.createComment({
            owner,
            repo,
            issue_number,
            body: body || 'Automated comment'
        });

        console.log(`[GitHubService] Added comment to issue #${issue_number} in ${owner}/${repo}`);
        return { success: true, commentId: comment.id, url: comment.html_url };
    }

    async createFile(octokit, params) {
        const { owner, repo, path, content, message, branch } = params;

        // Encode content to base64
        const encodedContent = Buffer.from(content).toString('base64');

        // Check if file exists
        let sha;
        try {
            const { data: existingFile } = await octokit.repos.getContent({
                owner,
                repo,
                path,
                ref: branch
            });
            sha = existingFile.sha;
        } catch (error) {
            // File doesn't exist, that's okay
            sha = undefined;
        }

        const params_to_send = {
            owner,
            repo,
            path,
            message: message || `Add/Update ${path}`,
            content: encodedContent,
            branch: branch || 'main'
        };

        if (sha) {
            params_to_send.sha = sha; // Update existing file
        }

        const { data: file } = await octokit.repos.createOrUpdateFileContents(params_to_send);

        console.log(`[GitHubService] Created/Updated file ${path} in ${owner}/${repo}`);
        return { success: true, path, url: file.content.html_url };
    }

    async createRelease(octokit, params) {
        const { owner, repo, tag_name, name, body, draft, prerelease } = params;

        const { data: release } = await octokit.repos.createRelease({
            owner,
            repo,
            tag_name,
            name: name || tag_name,
            body: body || '',
            draft: draft || false,
            prerelease: prerelease || false
        });

        console.log(`[GitHubService] Created release ${tag_name} in ${owner}/${repo}`);
        return { success: true, releaseId: release.id, url: release.html_url };
    }
}

module.exports = new GitHubService();
