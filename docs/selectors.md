
# YouTube HTML elements hierarchy and behavior
Purpose of this file is to gather data on behavior of specific YT html elements.
This matters a lot for this extension as its code is heavily based on what elements should be observed and deactivated by mutationObservers. 

## Homepage Shorts:
1. **`#contents.ytd-rich-grid-renderer`**
   - Top-level container for content on homepage. Contains videos, shorts, prompts.
2. **`ytd-rich-section-renderer`**
   - currently contains only shorts / and premium video prompts
   - multiple elements can be rendered in homepage, especially if user had history of watching shorts videos


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
   - Because of above its not good for targeting with mutationObserver.

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
   - Contains only premium music prompt.
   - Is rendered very rarely. Users may encounter it once or twice a week.


## Homepage Premium Account Prompt:
Is rendered very rarely, approximately once/twice a month.

1. **`#contents.ytd-rich-grid-renderer`**
   - Currently testing this element as common parent for Premium prompts (Premium Account, Premium Music Section).

2 **`ytd-statement-banner-renderer`**
   - Commonly used as container for homepage prompts: premium account/premium music/premium videos


## Homepage Premium Videos Prompt:
   - same parent and target elements as homepage shorts (description in Homepage Shorts section)

   1. **`#contents.ytd-rich-grid-renderer`**

   2. **`ytd-rich-section-renderer`**


## Shorts on Subscription page:

   1. **'ytd-browse'**
   - recommended as parent selector, elements lower in HTML tree are temporarily disabled during navigation and their children are moved to other HTML elements. This may cause observers to target wrong element or not being able to find parent element at all.

   2. **'ytd-rich-grid-renderer'**
   - not recommended to use as a parent selector, on smaller desktop screens may not render at all or get disabled by yt (children will be moved to other parent)


## Shorts on Video Page:
Video page seems to display shorts section based on how many times user was watching shorts in the past. Because of that users that have avoided shorts may not see this section at all/very rarely. 

1. **`#contents.ytd-item-section-renderer`**
   - top level container
2. **`ytd-reel-shelf-renderer`**
   - shorts container
   - one per vide page

## Important!:

**`:not([hidden]):not([style*="display: none"])`** selector is added to both parent and target observer elements. Reason: YT SPA will make some of its elements hidden between page navigations. This ensures that observers will not accidentally target inactive elements.
