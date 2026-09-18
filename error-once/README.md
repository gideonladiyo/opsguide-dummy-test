# One-time error simulation

Action page: `/error-once/`  
Simulation page: `/error-once/error-simulation/`

Both pages have the same action selectors: `#action-name`, `#priority-normal`, `#priority-high`, `#action-confirm`, and `#action-button`. On the action page, click `#go-to-error-simulation` to open the simulation page. Then click `#trigger-error`.

The first click on `#trigger-error` hides the actions and displays `#error-page:not([hidden])` with code `ERR_SIMULATED_ONCE`. There is no automatic retry button. WebRPA's error detection can return to an earlier URL or step, repeat the actions, and open the simulation page again. The next click on `#trigger-error` displays `#simulation-success:not([hidden])`.

Error status is stored in `sessionStorage` so it survives navigation or browser Back within the same tab. A normal reload or Ctrl+Shift+R resets the status, so the next click triggers the error again. You can also use `#reset-simulation` on the action page to reset it manually. These static pages do not require an API.
