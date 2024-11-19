# 0.6: New note in Single page app diagram

```mermaid
sequenceDiagram
    participant browser
    participant server

    Note right of browser: User types a note in the input field and clicks the "Save" button
    
    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    Note right of server: The server saves the new note in the data store
    server-->>browser: HTTP 201 Created
    deactivate server

    Note right of browser: The browser updates the local state with the new note

    browser->>browser: Re-render the list of notes dynamically
    Note right of browser: The new note appears in the list without a page reload