# ha-theme-generator-card
Home Assistant Theme Generator Card

## Installation
Create a file **ha-theme-generator-card.js** in the folder **/homeassistant/www** and copy/pase the code.

## Add card to dashboard
Add a custom card and specify the following config:
```type: custom:ha-theme-generator-card
title: Theme
samples: 5
invert: false
changeTextColor: false
primary_color: darkest
accent_color: least_dominant
dark_primary_color: most_dominant
light_primary_color: lightest```

## Configuration properties
There are some properties that can be configured:

```samples [int]```
This will specify the amount of samples to take from the background image

```invert [true/false]```
This will invert the dark with the light colors

```changeTextColor [true/false]```
Speicify if text color should be changed



