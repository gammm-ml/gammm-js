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
- **Lifecycle Hooks**: Trigger logic using `beforeRender` and `afterRender` callbacks.

---

## Template Syntax

When using the `html` property, templates are declared inside a function using template literal backticks enclosed with `*` delimiters:

```javascript
html: function() {
  `*
    <div>
      <h1>{{ title }}</h1>
    </div>
  *`
}
```

The library automatically parses and compiles the string located between `` `* `` and `` *` ``.

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
      html: function() {
        `*
          <div class="card">
            <h1>{{ title }}</h1>
            <p>Current count: <strong>{{ count }}</strong></p>
            <button gammmjs-click="{increment}">Increment</button>
          </div>
        *`
      }
    });

    // 2. Mount the component to the DOM
    GammmJSDom.load(document.getElementById('app'), app);
  </script>
</body>
</html>
```

---

### 2. Handling Form Input State

Capture user input events (`keyup`, `change`, etc.) to update state values dynamically.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>GammmJS Form Example</title>
  <style>
    .form-card {
      font-family: Arial, sans-serif;
      max-width: 400px;
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
  </style>
</head>
<body>

  <div id="form-app"></div>

  <!-- Include GammmJS Library -->
  <script src="gammmjs.js"></script>
  <script>
    const FormApp = new GammmJS({
      data: {
        username: "Angelo",
        bio: "Building cool JavaScript libraries!"
      },

      events: {
        updateUsername: function(element, event) {
          this.data.username = element.value;
          this.state();
        },

        updateBio: function(element, event) {
          this.data.bio = element.value;
          this.state();
        }
      },

      html: function() {
        `*
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
              >{{ bio }}</textarea>
            </div>

            <div class="preview">
              <p><strong>Preview:</strong> {{ username }} - <em>"{{ bio }}"</em></p>
            </div>
          </div>
        *`
      }
    });

    GammmJSDom.load(document.getElementById('form-app'), FormApp);
  </script>
</body>
</html>
```

---

### 3. Inline Script Blocks (`<#gammmjs ... #>`)

Execute inline logic such as loops or conditional statements inside your HTML structure.

```javascript
const UserList = new GammmJS({
  data: {
    users: ["Alice", "Bob", "Charlie"]
  },
  html: function() {
    `*
      <div>
        <h3>User Directory</h3>
        <ul>
          <#gammmjs
            for (var i = 0; i < ThisGammmJS.data.users.length; i++) {
              <li>
              {{'User: ' + ThisGammmJS.data.users[i] }}
              </li>
            }
          #>
        </ul>
      </div>
    *`
  }
});

GammmJSDom.load(document.getElementById('app'), UserList);
```

---

### 4. Component Nesting & Props

Inject child component blocks inside parent templates using the `<#BlockName prop="value" />` syntax.

```javascript
// 1. Define Child Block globally so window['HeaderBlock'] can be referenced by the parser
window.HeaderBlock = function(title){
	return new GammmJS({
	  data: {
		title: title
	  },
	  html: function() {
		`*
		
		  <header>
			<h2>{{ title }}</h2>
		  </header>
		  
		*`
	  }
	});
}

var ReUseBlock = HeaderBlock("Dashboard Component");

// 2. Define Parent Component embedding the child block
const MainApp = new GammmJS({
  html: function() {
    `*
      <div class="main-layout">
	  
        <#ReUseBlock />
		
        <main>
          <p>Main content area.</p>
        </main>
      </div>
    *`
  }
});

GammmJSDom.load(document.getElementById('app'), MainApp);
```

---

## Scope & Limitations

* **Inline Scripting Context**: Logic written inside `<#gammmjs ... #>` tags runs in an isolated execution scope. Global references should explicitly target `window` or use `ThisGammmJS`.
* **String Literals in Interpolation**: Any hardcoded string literal inside data-binding braces must use single quotes (`{{ '[string]' }}`).
* **HTML Element Formatting**: HTML tags within template literals must always start on a new line to ensure the parser correctly processes block tokens and DOM nodes.

---
## API Reference

### `GammmJS(options)`
Constructor that accepts a configuration object with the following properties:

- **`data`** *(Object)*: Key-value map of properties accessible via `{{ property }}` placeholders.
- **`events`** *(Object)*: Methods bound through `gammmjs-[event]="{methodName}"`.
- **`html`** *(Function)*: Template wrapper returning string contents inside `` `* `` ... `` *` `` delimiters.
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
