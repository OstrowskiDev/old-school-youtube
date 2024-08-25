Purpose of this file is to gather data on behavior of specific YT html elements.
So it is clear why some selectors are used and others not.

Search results page shorts elements hierarchy and behavior:
- #container.ytd-search: top level container for search results
- #contents.ytd-section-list-renderer: lowest top level container for search results that is ancestor for all shorts containers. But it gets created multiple times between page navigations to search results. Old elements are grayed out but still can get targeted by selectors.
- ytd-item-section-renderer: direct child of element above, rendered multiple times while scrolling down, each section contains deeply nested shorts
- ytd-reel-shelf-renderer: shorts container, it is rendered multiple times while scrolling down