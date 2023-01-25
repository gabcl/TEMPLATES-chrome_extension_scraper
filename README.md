# Chrome Extension Scraper

It scrapes specific data from web pages and display it in a DevTools panel.

## Built with:

- TypeScript
- React
- Webpack

## Main Components

**DevTools Panel**  
Contains the extension's UI.

**Background**  
Background service-worker script. Acts as a bridge for messaging between the DevTools Panel and the Content scripts.

**Content Scripts**  
Running in the same context as web pages, it can retrieve data from them.

## Message Flow

**Messages initiated in panelScript**  
DevTools Panel -> Background -> Content -> Background -> DevTools Panel

## Main components to configure

- .src/models/DataFrame -> Define content scraped and passed through messages.
- .src/pages/Content/modules/parser.ts -> Handles the scraping in the context of web pages.

**Initially forked from:**  
https://github.com/lxieyang/chrome-extension-boilerplate-react
