# Contributor page requirements

These are instructions for a real student contributor, not completed collaboration evidence.

The contributor must add these two files through a PR from their own dedicated course GitHub account. Use the contributor's student ID, never the receiving repository owner's ID.

## contribution.json

Create a root-level JSON object with one field, `contributorStudentId`, whose value is the contributor's actual student ID as a string. When student 73259 contributes to a partner's repository, that value is `73259`. In student 73259's repository, it must be the other student's ID.

## contribution.html

Build a complete HTML page with:

- Page title and an h1 displaying **Team Contribution**.
- A button with `id="load-contributor"` and text **Show Contributor**.
- An element with `id="contributor-student-id"` (preferably `aria-live="polite"`).
- A link back to `index.html`.
- A click handler that fetches the relative URL `contribution.json`, checks `response.ok`, parses JSON, reads `contributorStudentId`, and displays `Contributor Student ID: ` followed by that value using `textContent`. Do not hardcode the displayed ID in JavaScript.
- A useful error message when fetching or parsing fails.

Keep both files self-contained or use only files already in the receiving repository. Do not change the Task Manager unnecessarily. The receiving repository owner reviews and merges the PR. Verify the page and JSON on GitHub Pages after deployment.
