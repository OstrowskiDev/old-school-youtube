
# YouTube HTML elements hierarchy and behavior
Purpose of this file is to gather data on behavior of specific YT html elements.
This matters a lot for this extension as its code is heavily based on what elements should be observed and deactivated by mutationObservers. 

## Homepage Shorts:
1. **`#contents.ytd-rich-grid-renderer`**
   - Top-level container for content on homepage. Contains videos, shorts, prompts.
2. **`ytd-rich-section-renderer`**
   - child of 1, parent of 3
   - currently contains only shorts
   - currently only one element with this selector is rendered on home page
3. **`content.ytd-rich-section-renderer`**
   - child of 2
   - dedicated for rendering shorts


## Search Results Page Shorts:

1. **`#container.ytd-search`**
   - Top-level container for search results. 
   - Unique element on search results page.

2. **`#contents.ytd-section-list-renderer`**
   - Lowest top-level container for search results that is an ancestor for all shorts containers.
   - This element gets created multiple times between page navigations to search results.
   - Old elements are grayed out but can still be targeted by selectors.

3. **`ytd-item-section-renderer`**
   - Direct child of `#contents.ytd-section-list-renderer`. 
   - May be set to invisible between page navigations.
   - Rendered multiple times while scrolling down.
   - Each section contains deeply nested shorts.

4. **`ytd-reel-shelf-renderer`**
   - Shorts container.
   - Rendered multiple times while scrolling down.

## Channel Page Shorts:

1. **`ytd-browse`**
   - Top level container for channel content. Sometimes. Sometimes is deactivated and other elements take its place as top level container for channel content. 
   - Because of above is not good for targeting with mutationObserver.

2. **`ytd-section-list-renderer`**
   - Low level container for channel videos and shorts section. 
   - Can get deactivated between page navigations.

3. **`ytd-reel-shelf-renderer`**
   - Shorts container.
   - Currently channel page has only one section with shorts.


## Homepage Premium Music Prompt:

1. **`#contents.ytd-rich-grid-renderer`**
   - Top-level container for content on homepage. Contains videos, shorts, prompts.

2. **'ytd-statement-banner-renderer'**
   - Contains only premium music prompt
   - Is rendered very rarely. Users may encounter it once or twice a week.


## Homepage Premium Account Prompt:

1. **`ytd-rich-section-renderer`**
   - top level container for premium account prompt
   - is rendered very rarely, approximately once a month 
   - rendered once on homepage
2 **`#content.ytd-rich-section-renderer`**
   - child of 1
3 **`ytd-statement-banner-renderer`**
   -child of 2

## Important!:

**`:not([hidden]):not([style*="display: none"])`** its recommended to add this selector to targeted elements (Top-levels containers don't need it). YT SPA will make some of its elements hidden between page navigations. This ensures that observers will not watch those inactive elements. 

## Tests:
Section for ideas regarding selectors:

**`#content`** selector is used as common ancestor on many different pathnames. If this is always true for every pathname that contains shorts it could be used to simplify the code significantly.