# Web code viewer

View specified source code in browser with syntax highlight.

- Ver: 0.3.0
- Updated: 8/20/2023
- Created: 8/19/2023
- Author: loblab

## Features

- Easy to deploy, pure client side solution, based on [highlight.js](https://highlightjs.org/)
- Show line number, by [highlightjs-line-numbers.js](https://github.com/wcoder/highlightjs-line-numbers.js)
- Specify source file in url (?file-url)
- Jump to specified line (specified in url, #num)
- Only show text file (detected by file extensions, content types, file size)

![Code inside site with absolute path](https://raw.githubusercontent.com/loblab/web-code-viewer/main/screenshot1.png)

![Code cross site and jump to line](https://raw.githubusercontent.com/loblab/web-code-viewer/main/screenshot2.png)

## Usage

Clone this repository to your web site, e.g. http://your.site/wcv/

then you can view the source code:
- http://your.site/wcv/ : this index.html
- http://your.site/wcv/?main.js : this main.js
- http://your.site/wcv/?/other/source/code.cpp : other source code in your site
- http://your.site/wcv/?/other/source/code.cpp#123 : jump to line 123
- http://your.site/wcv/?http://other.site/other/source/code.cpp#123 : show file in other site (with CORS enabled)

## History

- 0.3 (08/20/2023): Accept/reject by file extensions, content types, file size
- 0.2 (08/19/2023): Jump to specified line number
- 0.1 (08/19/2023): First working version with syntax highlight, line number
