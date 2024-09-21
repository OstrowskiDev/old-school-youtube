# URL Formats For YouTube Channel Page:

## Legacy URLs:
/user/channelName: This format was commonly used for YouTube channels.
/channelName: Some channels could be accessed directly using this format.

## Current URLs:
/@channelName: This is the modern format for YouTube channel URLs.
/c/channelName: This format is also used for custom URLs.

## Example:
Legacy URL: https://www.youtube.com/user/ExampleChannel
Current URL: https://www.youtube.com/@ExampleChannel
Custom URL: https://www.youtube.com/c/ExampleChannel

## RegEx:
const userPattern = /\/user\/([^\/]+)/;
const atPattern = /\/@([^\/]+)/;
const customPattern = /\/c\/([^\/]+)/;
const legacyPattern = /\/([^\/]+)/;

## Strings for RegExp constructor:
regex: '^/@',
regex: '^/user/',
regex: '^/c/',
combined: ^/@|^/user/|^/c/