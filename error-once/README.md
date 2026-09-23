# One-time error simulation

Action page: `/error-once/`  
Simulation page: `/error-once/error-simulation/`

Both pages have the same action selectors: `#action-name`, `#priority-normal`, `#priority-high`, `#action-confirm`, and `#action-button`. On the action page, click `#go-to-error-simulation` to open the simulation page. The simulation page provides trigger A as `#trigger-error` and trigger B as `#trigger-error-b`.

Each trigger has a separate counter. Its first click hides the actions and displays `#error-page:not([hidden])` with code `ERR_SIMULATED_ONCE`. There is no automatic retry button. WebRPA's error detection can return to an earlier URL or step, repeat the actions, and open the simulation page again. The next click on the same trigger displays `#simulation-success:not([hidden])`. Trigger B will still error on its first click even after trigger A has already succeeded.

Error status is stored in `sessionStorage` so it survives navigation or browser Back within the same tab. A normal reload or Ctrl+Shift+R resets both counters. You can also use `#reset-simulation` on the action page to reset both manually. These static pages do not require an API.
