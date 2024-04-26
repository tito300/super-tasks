### Caching

There are 2 levels of caching

- service level: meant to stop lots of requests in a short period of time. Can't be overriden by the apps
- React query level: this one is longer because it can be overridden by using invalidateCache when needed. It's mainly meant to stop loading data on initial load and when user refocuses page.
