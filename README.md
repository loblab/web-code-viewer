# Web code viewer

View specified source code in browser with syntax highlight.

- Ver: 0.3.0
- Updated: 8/20/2023
- Created: 8/19/2023
- Author: loblab

## Features

- Easy to deploy, pure client side solution
- Show line number
- Jump to specified line
- Only show text file (detected by file extensions, content types, file size)

## Usage

Clone this repository to your web site,
say, http://your.site/wcv/
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
