"use strict";

(() => {
  const $ = (id) => document.getElementById(id);
  const form = $("task-form");
  const title = $("task-title");
  const description = $("task-description");
  const submit = $("task-submit");
  const cancel = $("cancel-edit");
  const refresh = $("refresh-tasks");
  const list = $("task-list");
  let config;
  let tasks = [];
  let editingId = null;
  let busy = false;

  function status(message, kind = "info") {
    $("status-message").textContent = message;
    $("status-message").dataset.kind = kind;
  }

  function setBusy(value) {
    busy = value;
    for (const control of [title, description, submit, cancel, refresh, ...list.querySelectorAll("button")]) {
      control.disabled = value || !config;
    }
    list.setAttribute("aria-busy", String(value));
  }

  async function api(method = "GET", id = null, record = null) {
    const url = new URL(`${config.supabaseUrl}/rest/v1/tasks`);
    url.searchParams.set("select", "*");
    if (id !== null) url.searchParams.set("id", `eq.${id}`);
    else if (method === "GET") url.searchParams.set("order", "id.desc");
    const headers = { apikey: config.supabasePublishableKey };
    if (record !== null) headers["Content-Type"] = "application/json";
    if (method !== "GET") headers.Prefer = "return=representation";
    let response;
    try {
      response = await fetch(url, {
        method, headers, cache: "no-store",
        ...(record !== null ? { body: JSON.stringify(record) } : {}),
        signal: AbortSignal.timeout(15000)
      });
    } catch (error) {
      throw new Error(error.name === "TimeoutError"
        ? "The database took too long to respond. Refresh before retrying to check whether your change was saved."
        : "Cannot reach the database. Check your internet connection and Supabase URL. Refresh before retrying a change.");
    }
    const raw = await response.text();
    let data;
    try { data = raw ? JSON.parse(raw) : []; }
    catch { throw new Error(`The database returned an unexpected response (${response.status}).`); }
    if (!response.ok) throw new Error(`Database request failed (${response.status}): ${data.message || data.hint || "Check your public key, tasks table, and RLS policies."}`);
    if (!Array.isArray(data)) throw new Error("The database response was not a task list.");
    if (id !== null && data.length === 0) throw new Error("This task is no longer available or access was denied. Refresh the task list.");
    return data;
  }

  function element(tag, className, text) {
    const node = document.createElement(tag);
    node.className = className;
    node.textContent = text;
    return node;
  }

  function render() {
    list.replaceChildren();
    const completed = tasks.filter((task) => task.completed).length;
    $("task-summary").textContent = `${tasks.length} ${tasks.length === 1 ? "task" : "tasks"} · ${completed} completed · ${tasks.length - completed} remaining`;
    if (!tasks.length) {
      const empty = element("div", "empty-state", "Add your first task using the form.");
      empty.prepend(element("strong", "", "A fresh start."));
      list.append(empty);
    }
    for (const task of tasks) {
      const item = element("article", `task-item${task.completed ? " is-completed" : ""}`, "");
      item.dataset.id = String(task.id);
      const top = element("div", "task-top", "");
      top.append(element("h3", "task-title", task.title), element("span", "task-status", task.completed ? "Completed" : "Incomplete"));
      item.append(top, element("p", "task-description", task.description || ""));
      const actions = element("div", "task-actions", "");
      for (const [className, text, action] of [
        ["toggle-task", task.completed ? "Mark incomplete" : "Mark complete", () => toggleTask(task)],
        ["edit-task", "Edit", () => editTask(task)],
        ["delete-task", "Delete", () => deleteTask(task)]
      ]) {
        const button = element("button", className, text);
        button.type = "button";
        button.setAttribute("aria-label", `${text}: ${task.title}`);
        button.disabled = busy;
        button.addEventListener("click", action);
        actions.append(button);
      }
      item.append(actions);
      list.append(item);
    }
  }

  function resetForm() {
    editingId = null;
    form.reset();
    $("form-heading").textContent = "Create a task";
    submit.textContent = "Add task";
    cancel.hidden = true;
  }

  async function run(action) {
    if (busy || !config) return;
    setBusy(true);
    try { await action(); }
    catch (error) { status(error.message, "error"); }
    finally { setBusy(false); }
  }

  async function loadTasks() {
    tasks = await api();
    render();
  }

  async function reloadAfterChange(message) {
    try { await loadTasks(); status(message); }
    catch (error) { status(`${message} The list could not refresh: ${error.message}`, "error"); }
  }

  function editTask(task) {
    return run(async () => {
      // Read the current database record before filling the edit form.
      const [latest] = await api("GET", task.id);
      editingId = latest.id;
      title.value = latest.title;
      description.value = latest.description || "";
      $("form-heading").textContent = "Edit task";
      submit.textContent = "Save changes";
      cancel.hidden = false;
      status("Edit your task, then save your changes.");
    }).then(() => { if (editingId !== null) title.focus(); });
  }

  function toggleTask(task) {
    return run(async () => {
      const [latest] = await api("GET", task.id);
      await api("PATCH", task.id, { completed: !latest.completed });
      await reloadAfterChange(latest.completed ? "Task marked incomplete." : "Task completed.");
    });
  }

  function deleteTask(task) {
    if (busy || !window.confirm(`Delete “${task.title}”?`)) return;
    return run(async () => {
      await api("DELETE", task.id);
      if (String(editingId) === String(task.id)) resetForm();
      await reloadAfterChange("Task deleted.");
    });
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const trimmedTitle = title.value.trim();
    if (!trimmedTitle) {
      title.setCustomValidity("Enter a title containing more than spaces.");
      title.reportValidity();
      return;
    }
    run(async () => {
      const editing = editingId !== null;
      const record = { title: trimmedTitle, description: description.value.trim() };
      if (!editing) record.completed = false;
      await api(editing ? "PATCH" : "POST", editingId, record);
      resetForm();
      await reloadAfterChange(editing ? "Task updated." : "Task added.");
    });
  });
  title.addEventListener("input", () => title.setCustomValidity(""));
  cancel.addEventListener("click", () => { resetForm(); status("Editing cancelled."); });
  refresh.addEventListener("click", () => run(async () => { await loadTasks(); status("Tasks refreshed."); }));

  async function init() {
    setBusy(true);
    try {
      const response = await fetch("config.json", { cache: "no-store" });
      if (!response.ok) throw new Error("Cannot load config.json. Make sure it is in the same folder as index.html.");
      const candidate = await response.json();
      if (!candidate.supabaseUrl || !candidate.supabasePublishableKey) throw new Error("Database setup is required: add your Supabase project URL and public publishable key to config.json. See README.md.");
      const url = new URL(candidate.supabaseUrl);
      if (url.protocol !== "https:" || !url.hostname.endsWith(".supabase.co") || url.pathname !== "/" || url.username || url.password || url.search || url.hash) throw new Error("Use your Supabase project URL in the format https://PROJECT_ID.supabase.co.");
      if (!/^sb_publishable_[A-Za-z0-9_-]+$/.test(candidate.supabasePublishableKey)) throw new Error("Use a public Supabase publishable key beginning sb_publishable_. Never use a secret key.");
      if (candidate.tableName !== "tasks") throw new Error('config.json tableName must be "tasks".');
      config = { ...candidate, supabaseUrl: url.origin };
      await loadTasks();
      status("");
    } catch (error) { status(error.message, "error"); }
    finally { setBusy(false); }
  }
  init();
})();
