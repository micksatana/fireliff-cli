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
npm i -g @intocode-io/fireliff-cli
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

### Init LIFF project
This command should be run first time under Firebase project root folder which containing `firebase.json`.
```
fliff init
```
After run successfully, you will get a `web-views` LIFF project folder. This sub-project is a boilerplate with Parcel Bundler. You can change directory into `web-views` and run `npm run dev` to start LIFF App development. See [Develop LIFF Web Views](#develop-liff-web-views)


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

### Add RichMenu
To add a new RichMenu
```
richmenu add --name <richMenuName> --data <dataFile> --image <imageFile>
```
IMPORTANT NOTE: The richmenu naming cannot be uppercase due to Firebase Functions Configuration specification. It's recommended to use `rich-menu-name` pattern.

### Update RichMenu
LINE Rich Menu API currently not support `PUT` method which means you cannot update the rich menu. The workaround is add new menu and delete the old one.

### Delete RichMenu
Update using RichMenu ID
```
richmenu delete --id <richMenuId>
```
Update using RichMenu name
```
richmenu delete --name <richMenuName>
```

### Get RichMenu
To display existing rich menus, run the following command. This will display existing rich menus in table.
```
richmenu get
```
Or if you need more detail, such as `areas` property, run with `--detail` option. This will display as object.
```
richmenu get --detail
```

### Set RichMenu as default
Set RichMenu for all users using RichMenu ID
```
richmenu default --id <richMenuId>
```
Set RichMenu for all users using RichMenu name. Please note this RichMenu name is the name when you add the RichMenu with `--name` option which will be saved in Firebase Functions Configuration. It is not the same as a `name` property in data file. You can run `richmenu get` to see RichMenu name in the first column.
```
richmenu default --name <richMenuName>
```

## Develop LIFF Web Views
### Performance consideration
Each web view will be loaded inside LINE app when LINE user open a `line://app/{view}`. So to load each web view faster, it's recommended to avoid using single-page app approach but create a set of files for each page using the following pattern instead.
```
web-views/src/some-view.html
web-views/src/some-view.js
web-views/src/some-view.css
```
It's recommended to load only neccessary library in the html file; for example, the LIFF SDK. And use Parcel Bundler to import other libraries as needed. Parcel Bundler will help to several things; including Tree-shaking which will reduce JavaScript payloads.
### Environment file naming
The boilerplate has two environments; `production` and `staging`. But you can create more if needed. Environment file uses the following format
```
web-views/.env.{process.NODE_ENV}
```
### Environment and Firebase project alias
Environment must be aligned with Firebase project alias. Run `firebase use` to see all aliases. If you don't have `staging` and `production` aliases, you can add them by run the following command.
```
firebase use --add
```

### Firebase app initialization
In the environment file, we have two default variables; `FIREBASE_API_KEY` and `FIREBASE_API_PROJECT_ID`, which needed during firebase app initialization.
```
import firebase from 'firebase/app';

firebase.initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
    projectId: process.env.FIREBASE_API_PROJECT_ID
});
```

### LIFF initialization
You can access `liff` variable in any JavaScript file as long as the JavaScript file is loaded in an HTML page which include LIFF SDK script.
```
liff.init(
     data => console.log(data.context),
     error => console.log(error)
);
```

### Deploy to staging environment
```
cd web-views
npm run deploy:staging
```
This command will clean `web-views/dist`, re-build and deploy to Firebase Hosting.

After complete, you can [add LIFF view](#add-liff-view). The command will add LIFF view to LINE and configure Firebase Functions for you.

## How to retrieve LIFF View IDs or RichMenu in Firebase Functions
You can get LIFF view IDs programmatically, in your Firebase Functions project using the following code.
```
import * as functions from 'firebase-functions';
const views = functions.config().views;
const richMenus = functions.config().richmenus;
```
Let's say you previously add a view named `some_view`, you can create URL using LIFF ID in `views` like this.
```
const signUpUrl = `line://app/${views.some_view}`;
```

When LINE user access this view `line://app/${views.some_view}`, the user will see `web-views/src/some-view.html` hosted on Firebase Hosting.

## LICENSE

MIT License

Copyright (c) 2018 intocode Co., Ltd.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
