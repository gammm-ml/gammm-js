---
title: "GammmJS Documentation"
author: "Angelo S. Octavio"
date: "2026-08-16"
output: github_document
---

# GammmJS

> **Version:** 1.0.0  
> **Author:** Angelo S. Octavio  

A simple JavaScript library that enables you to execute custom JavaScript code, bind data, attach event listeners, and render modular components directly inside HTML code.

---

## Features

- **Embedded JS Execution**: Execute inline JavaScript logic using `<#gammmjs ... #>` tags.
- **Data Binding**: Easily interpolate state values using Mustache-style syntax (`{{ property }}`).
- **Event Delegation**: Bind HTML events using the `gammmjs-[event]="{functionName}"` syntax.
- **Custom Components & Blocks**: Embed sub-components and pass props using `<#blockName key="value" />` syntax.
- **Caret & Focus Management**: Automatically preserves cursor position during input and textarea updates.
- **Lifecycle Hooks**: Trigger logic using `beforeRender` and `afterRender` callbacks.

---

## Key Syntax & Directives

| Feature | Syntax Example | Description |
| :--- | :--- | :--- |
| **Data Binding** | `{{ username }}` | Binds properties defined in the component's `data` object. |
| **Inline Code** | `<#gammmjs ... #>` | Executes inline JS logic. Use `GammmEcho("string")` inside to write output to the HTML. |
| **Event Binding** | `gammmjs-click="{handleClick}"` | Binds DOM events (`click`, `keyup`, etc.) to methods defined in the `events` object. |
| **Component Blocks**| `<#MyComponent propName="value" />` | Embeds a sub-component block and automatically assigns props to global variables matching the block name. |

---

## Quick Start Examples

### 1. Basic Component Rendering

Mount a template to a DOM element, inject reactive data, and bind custom click handlers.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>GammmJS Demo</title>
</head>
<body>

  <!-- Container element -->
  <div id="app"></div>

  <!-- Include GammmJS Library -->
  <script src="gammmjs.js"></script>

  <script>
    // 1. Initialize GammmJS instance
    const app = new GammmJS({
      data: {
        title: "Welcome to GammmJS!",
        count: 0
      },
      events: {
        increment: function(element, event) {
          this.data.count++;
          this.state(); // Re-render state updates
        }
      },
      // Templates use `*` as content delimiters inside backticks
      html: function() {
        /*`
          <div class="card">
            <h1>{{ title }}</h1>
            <p>Current count: <strong>{{ count }}</strong></p>
            <button gammmjs-click="{increment}">Increment</button>
          </div>
        `*/
      }
    });

    // 2. Mount the component to the DOM
    GammmJSDom.load(document.getElementById('app'), app);
  </script>
</body>
</html>
```

---

### 2. Form Input State & Caret Selection Tracking

GammmJS automatically preserves caret position on `<input>` and `<textarea>` elements when re-rendering state.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>GammmJS Form & Selection Example</title>
  <style>
    .form-card {
      font-family: Arial, sans-serif;
      max-width: 500px;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 8px;
    }
    .field-group {
      margin-bottom: 15px;
    }
    label {
      display: block;
      font-weight: bold;
      margin-bottom: 5px;
    }
    input[type="text"], textarea {
      width: 100%;
      padding: 8px;
      box-sizing: border-box;
    }
    .selection-info {
      background: #f4f4f4;
      padding: 10px;
      border-radius: 4px;
      font-size: 0.9em;
    }
  </style>
</head>
<body>

  <div id="form-app"></div>

  <script src="gammmjs.js"></script>
  <script>
    const FormApp = new GammmJS({
      data: {
        username: "Angelo",
        bio: "Building cool JavaScript libraries!",
        selectionStart: 0,
        selectionEnd: 0
      },

      events: {
        // Handles state updates for text inputs
        updateUsername: function(element, event) {
          this.data.username = element.value;
          this.state(); // Re-render state while maintaining focus and caret
        },

        // Updates textarea state and tracks selection positions
        updateBio: function(element, event) {
          this.data.bio = element.value;
          this.data.selectionStart = element.selectionStart;
          this.data.selectionEnd = element.selectionEnd;
          this.state();
        },

        // Tracks cursor positioning on selection/clicks
        trackSelection: function(element, event) {
          this.data.selectionStart = element.selectionStart;
          this.data.selectionEnd = element.selectionEnd;
          
          const statsEl = document.querySelector("#caret-stats");
          if (statsEl) {
            statsEl.innerText = `Caret Position: ${this.data.selectionStart} to ${this.data.selectionEnd}`;
          }
        }
      },

      html: function() {
        /*`
          <div class="form-card">
            <h2>User Profile Editor</h2>

            <div class="field-group">
              <label for="username">Username:</label>
              <input 
                type="text" 
                id="username" 
                value="{{ username }}" 
                gammmjs-keyup="{updateUsername}" 
              />
            </div>

            <div class="field-group">
              <label for="bio">Bio:</label>
              <textarea 
                id="bio" 
                rows="4" 
                gammmjs-keyup="{updateBio}" 
                gammmjs-click="{trackSelection}" 
                gammmjs-select="{trackSelection}"
              >{{ bio }}</textarea>
            </div>

            <div class="selection-info">
              <p><strong>Preview:</strong> {{ username }} - <em>"{{ bio }}"</em></p>
              <p id="caret-stats">Caret Position: {{ selectionStart }} to {{ selectionEnd }}</p>
            </div>
          </div>
        `*/
      }
    });

    GammmJSDom.load(document.getElementById('form-app'), FormApp);
  </script>
</body>
</html>
```

---

### 3. Inline Script Blocks (`<#gammmjs ... #>`)

Execute inline logic such as loops or conditional logic inside your HTML structure.

```javascript
const UserList = new GammmJS({
  data: {
    users: ["Alice", "Bob", "Charlie"]
  },
  html: function() {
    /*`
      <div>
        <h3>User Directory</h3>
        <ul>
          <#gammmjs
            for (var i = 0; i < ThisGammmJS.data.users.length; i++) {
              GammmEcho("<li>User: " + ThisGammmJS.data.users[i] + "</li>");
            }
          #>
        </ul>
      </div>
    `*/
  }
});

GammmJSDom.load(document.getElementById('app'), UserList);
```

---

### 4. Component Nesting & Props

Inject child component blocks inside parent templates using the `<#BlockName prop="value" />` syntax.

```javascript
// 1. Define Child Block globally so window['HeaderBlock'] can be referenced by the parser
window.HeaderBlock = new GammmJS({
  data: {
    title: "Dashboard"
  },
  html: function() {
    /*`
      <header>
        <h2>{{ title }}</h2>
      </header>
    `*/
  }
});

// 2. Define Parent Component embedding the child block
const MainApp = new GammmJS({
  html: function() {
    /*`
      <div class="main-layout">
        <#HeaderBlock title="Custom Title" />
        <main>
          <p>Main content area.</p>
        </main>
      </div>
    `*/
  }
});

GammmJSDom.load(document.getElementById('app'), MainApp);
```

---

## API Reference

### `GammmJS(options)`
Constructor that accepts a configuration object with the following properties:

- **`data`** *(Object)*: Key-value map of properties accessible via `{{ property }}` placeholders.
- **`events`** *(Object)*: Methods bound through `gammmjs-[event]="{methodName}"`.
- **`html`** *(Function)*: Template wrapper returning string contents inside `/*` ... `*/` comment blocks.
- **`element`** *(HTMLElement, optional)*: Target DOM node. Automatically renders the component upon instantiation if passed.
- **`className`** *(String, optional)*: Custom CSS class applied to the wrapper element (`<span>`).
- **`beforeRender`** *(Function, optional)*: Callback triggered prior to component compilation.
- **`afterRender`** *(Function, optional)*: Callback triggered after template processing completes.
- **`debug`** *(Boolean, optional)*: Enables internal console execution timers.

### Instance Methods

- **`this.state()`**: Triggers a complete cycle re-compile and re-render of template strings, data updates, events, and nested block stacks.

### `GammmJSDom`
Static DOM management helper containing mounting utilities:

- **`GammmJSDom.load(targetElement, ...gammmInstances)`**: Mounts one or multiple `GammmJS` instances inside the specified target element.
- **`GammmJSDom.generateGUID()`**: Utility function generating unique element string IDs.
