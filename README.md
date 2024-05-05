### Caching

<!-- There are 2 levels of caching -->

<!-- - service level: meant to stop lots of requests in a short period of time. Can't be overriden by the apps
- React query level: this one is longer because it can be overridden by using invalidateCache when needed. It's mainly meant to stop loading data on initial load and when user refocuses page. -->


### State

There are three levels of state:

- settings: This is state that is user controlled and is global. It's divided by app and there is user level settings. Examples:
    - light/dark mode
    - when calendar count down starts showing

- Global state: state that applies across tabs and profiles. Includes global app specific state and global state for all apps.
    - which task list is the last selected. We don't want this to reset per tab. user normally have a primary list and they expect it to be the default everywhere.
    - how many unread alerts there are

- local state: only applies at the tab level 
    - if the accordion is open or closed (unless sync is turned on in the settings then this is global state)


### storage

each top level key in the storage is tracked separately by chrome so it should be thought of as React Context, when any sub property changes, all dependencies of that key are rerendered.