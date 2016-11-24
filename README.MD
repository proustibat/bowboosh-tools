![Dependencies Updates Status](https://david-dm.org/proustibat/bowboosh-tools.svg)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Setup](#setup)
- [Usage](#usage)
- [Methods](#methods)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

#Bowboosh Tools

:warning: Work in progress

## Setup
use `npm install --save-dev bowboosh-tools`

## Usage
Require and init as following :

```
tools = require( 'bowboosh-tools' );
tools.init( gulp, config, package, bower );
```
## Methods

Then you can use `tools.spy`, `tools.stringSrc`, `tools.errorHandler`, `tools.throwError` methods and access to `tools.banner` property.

