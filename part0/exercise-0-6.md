# Exercise 0.6

**New note in Single page app diagram**

This diagram depicts the sequence of events when a user creates a new note using the single-page version of the app.

```mermaid
sequenceDiagram
    participant browser
    participant server

    Note right of browser: User writes a note and clicks Save button
    Note right of browser: JavaScript prevents default form submission
    Note right of browser: JavaScript creates new note object and adds it to local notes array
    Note right of browser: JavaScript re-renders the notes list
    Note right of browser: JavaScript sends the new note to server

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    Note right of server: Server processes the JSON data and saves the new note
    server-->>browser: HTTP 201 Created (JSON response)
    deactivate server

    Note right of browser: Page stays the same, no reload needed. The new note is already visible to the user.
```
