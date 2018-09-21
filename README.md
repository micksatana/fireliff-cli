# fireliff-cli
[![Build Status](https://travis-ci.org/intocode-io/fireliff-cli.svg?branch=master)](https://travis-ci.org/intocode-io/fireliff-cli)
[![codecov](https://codecov.io/gh/intocode-io/fireliff-cli/branch/master/graph/badge.svg)](https://codecov.io/gh/intocode-io/fireliff-cli)
[![dependencies Status](https://david-dm.org/intocode-io/fireliff-cli/status.svg)](https://david-dm.org/intocode-io/fireliff-cli)

Command line interface for building LIFF app on Firebase. This module will help you handle API to add, update, delete, get LIFF apps and set LIFF IDs in Firebase Functions configuration which can be retrieved in your Functions project.

## Prerequisite
### Firebase Tools
Firebase tools must be installed
```
npm i -g firebase-tools
```
Firebase project must be initiated with Functions (for Messaging API) and Hosting (for LIFF)
```
firebase init
```
Firebase project must be defined
```
firebase use --add
```

## Installation
Install FireLIFF CLI
```
npm i -g fireliff-cli
```
Set LINE channel access token
```
firebase functions:config:set line.access_token=<channelAccessToken>
```
Set Firebase Hosting URL
```
firebase functions:config:set hosting.url=<hostingUrl>
```
## Usage

### Add LIFF view
```
fliff add --name <viewName> --type <viewType> --url <viewUrl>
```

### Update LIFF view
Update using LIFF ID
```
fliff update --id <liffId> --type <viewType> --url <viewUrl>
```
Update using view name
```
fliff update --name <viewName> --type <viewType> --url <viewUrl>
```

### Delete LIFF view
Update using LIFF ID
```
fliff delete --id <liffId>
```
Update using view name
```
fliff delete --name <viewName>
```

### Get LIFF views
```
fliff get
```

## Accessibility from Functions
LIFF view names can be referred programmatically, in your Firebase Functions project using the following code.
```
import * as functions from 'firebase-functions';
const views = functions.config().views;
```
Let's say you have a view named sign_up, you can create URL using LIFF ID in `views` like this.
```
const signUpUrl = `line://app/${views.sign_up}`;
```

