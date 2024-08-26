
# YouTube HTML elements hierarchy and behavior
Purpose of this file is to gather data on behavior of specific YT html elements.
This matters a lot for this extension as its code is heavily based on what elements should be observed and deactivated by mutationObservers. 

## Search results page:

1. **`#container.ytd-search`**
   - Top-level container for search results.

2. **`#contents.ytd-section-list-renderer`**
   - Lowest top-level container for search results that is an ancestor for all shorts containers.
   - This element gets created multiple times between page navigations to search results.
   - Old elements are grayed out but can still be targeted by selectors.

3. **`ytd-item-section-renderer`**
   - Direct child of `#contents.ytd-section-list-renderer`. Because of that may also get grayed out between page navigations.
   - Rendered multiple times while scrolling down.
   - Each section contains deeply nested shorts.

4. **`ytd-reel-shelf-renderer`**
   - Shorts container.
   - Rendered multiple times while scrolling down.

## Channel page:

1. **`ytd-browse`**
   - Top level container for channel content. 

2. **`ytd-section-list-renderer`**
   - Low level container for channel videos and shorts section. 
   - Can get deactivated between page navigations.

3. **`ytd-reel-shelf-renderer`**
   - Shorts container.
   - Currently channel page has only one section with shorts.


## Premium Music:

1. **'ytd-statement-banner-renderer'**
   - Top level container