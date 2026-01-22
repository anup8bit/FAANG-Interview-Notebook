Got it 👍 — AutoComplete (or Typeahead) is a classic frontend interview problem because it touches on:

State management

Asynchronous API calls

Debouncing / throttling

Rendering dynamic suggestions

Accessibility and UX

🎯 Interview Problem Statement: AutoComplete

Problem:

Implement an AutoComplete search box component in React.
As the user types in the input field, fetch matching results from a given API and display them in a dropdown.

Requirements:

Input Field – User can type text.

Debounced API Call – Do not call the API on every keystroke. Instead, wait until the user pauses typing (e.g., 300ms).

Async Data Fetching – Fetch suggestions from a provided endpoint (e.g., /api/search?q=<term>).

Loading State – Show a loader/spinner while fetching.

Error State – Display an error message if the request fails.

Empty State – Show “No results found” if API returns an empty list.

Keyboard Navigation – Allow the user to use ↑/↓ to move through suggestions and Enter to select.

Selection Handling – On selecting a suggestion, display it in the input field.


