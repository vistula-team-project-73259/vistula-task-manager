# Task Manager

Task Manager for Practical Assignment 1, Team Project – IT, Vistula University.

- Student ID: **73259**
- Required course GitHub username: `vistula-team-project-73259`
- Expected repository: https://github.com/vistula-team-project-73259/vistula-task-manager
- Expected application URL: https://vistula-team-project-73259.github.io/vistula-task-manager/

These are the required account and URL formats, not confirmation that the account or deployment exists.

## Current state

The application is connected to its Supabase demonstration project. The `tasks` table and four public CRUD policies have been created, and `config.json` contains the project URL and public publishable key. Live REST checks passed for reading, creating, editing, completing, reopening, and deleting a temporary task, including separate reads to verify saved changes. The temporary test record was removed. GitHub Pages deployment is not yet complete. The contribution files must arrive through a different student's Pull Request; they are intentionally absent. The Team contribution link will work after that PR is merged and Pages redeploys.

## 1. Set up Supabase

**Already completed for this copy.** The steps below are retained for rebuilding in a different demonstration project. Keep the current config unless intentionally changing projects.

1. Create a separate free demonstration Supabase project containing test data only.
2. Run `supabase-setup.sql` in its SQL Editor. It creates `public.tasks`, grants the anonymous role CRUD access, enables RLS, and adds policies for the four operations.
3. Ensure the Data API is enabled and the `public` schema is exposed.
4. Copy the project URL and **publishable** key from the project settings into `config.json`:

```json
{
  "supabaseUrl": "https://YOUR_PROJECT_ID.supabase.co",
  "supabasePublishableKey": "sb_publishable_REPLACE_WITH_YOUR_PUBLIC_KEY",
  "tableName": "tasks"
}
```

Never put a secret key, service role key, or database password in this repository. Anyone can read, add, edit and delete the demo tasks under these policies. Do not store personal data.

Official references: [Supabase API keys](https://supabase.com/docs/guides/getting-started/api-keys), [REST API](https://supabase.com/docs/guides/api/creating-routes). The browser sends the publishable key in the `apikey` header.

## 2. Publish on GitHub Pages

1. Use your dedicated `vistula-team-project-73259` GitHub account.
2. Create a **public** repository named exactly `vistula-task-manager`.
3. Upload the **contents of this folder** directly into the root of its `main` branch, including your completed `config.json`. Do not upload a containing folder or ZIP as the website.
4. Under repository **Settings → Pages**, select **Deploy from a branch**, branch **main**, folder **/ (root)**, and save.
5. Wait for deployment, then open the expected application URL above. No build step, separate server, or login is required.

For a local preview, serve this folder with an HTTP server (for example `python -m http.server 8000`) and open http://localhost:8000. Opening index.html as a file will not support fetching the JSON configuration.

## 3. Verify the application

- Open the deployed application and check there are no configuration or database errors.
- Add a task with a title and description; refresh the page to check persistence.
- Edit the title and description and save; refresh again.
- Mark it complete and incomplete; verify the status survives refresh.
- Delete it and refresh to verify it remains deleted.
- Check on a narrow/mobile screen.

The app uses GET for the list and by-ID reads, POST to create, PATCH to edit/toggle, and DELETE to delete. User content is rendered as text, not HTML. Database failures appear in `status-message`; network requests time out after 15 seconds. Concurrent edits use last-write-wins behavior; Refresh reloads current records. If a write times out, refresh before retrying because the server might have saved it.

### Preparation checks

JavaScript syntax and simulated REST checks passed for creating tasks, retaining records across app reloads, editing, both completion transitions, deleting, whitespace validation, required HTML IDs, rendering user input as text, public-key request headers, and configuration/API error handling. The setup SQL also ran successfully in the actual Supabase project. Separate live REST checks passed for the full CRUD cycle and saved changes. GitHub Pages and partner PRs remain unverified. The local browser preview could not reach the preview server, so the application layout has not been browser-verified.

## 4. Complete the collaboration with another student

Do not add your own contribution files directly to this repository.

1. Find another student with a dedicated course account and their own public `vistula-task-manager` repository.
2. From your account, fork **their** repository and create branch `feature/team-contribution`.
3. Add `contribution.html` and `contribution.json` in **their repository's root**. Use your ID `73259` in the JSON. Follow `PARTNER-GUIDE.md` for the required page behavior.
4. Commit, push, and open a PR to their `main` branch titled `Add contributor page – 73259`.
5. Your partner must review and merge your PR.
6. Your partner repeats the process in your repository with **their own ID**. Review and merge their PR yourself.
7. Confirm both deployed contributor pages and JSON URLs work. Record the two merged PR links below.

### Collaboration evidence — complete after merging

- My PR to my partner's repository: **PENDING — insert merged PR URL**
- Partner's PR to this repository: **PENDING — insert merged PR URL**
- Partner's student ID: **PENDING**
- Partner's repository: **PENDING**

Both PRs must be authored by different students and merged by the receiving repository owners. An open PR does not complete the assignment.

## 5. Submit in Platon

Only after the database, deployment and both merged contributions work, submit only:

https://vistula-team-project-73259.github.io/vistula-task-manager/

Do not submit the ZIP, repository URL, screenshots, or this README.
