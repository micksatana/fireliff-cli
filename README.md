# fireliff-cli
[![Build Status](https://travis-ci.com/micksatana/fireliff-cli.svg?branch=master)](https://travis-ci.com/micksatana/fireliff-cli)
[![codecov](https://codecov.io/gh/micksatana/fireliff-cli/branch/master/graph/badge.svg)](https://codecov.io/gh/micksatana/fireliff-cli)
[![dependencies Status](https://david-dm.org/micksatana/fireliff-cli/status.svg)](https://david-dm.org/micksatana/fireliff-cli)
![NPM](https://img.shields.io/npm/l/@intocode-io/line-api-cli)
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://paypal.me/micksatana?locale.x=en_GB)

Command line interface for building LIFF app on Firebase. This module will help you handle API to add, update, delete, get LIFF apps and set LIFF IDs in Firebase Functions configuration which can be retrieved in your Functions project.

NOTE: If you do not need to work with Firebase, we recommend our latest package [`@intocode-io/line-api-cli`](https://www.npmjs.com/package/@intocode-io/line-api-cli)

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

### Configure LINE channel access token
There are two approaches to set LINE channel access token

#### A) Use long-lived access token
This approach is quick and easy but less secure because the token we are using here is long-lived access token. You can manually issue this token using [LINE Developers Console](https://developers.line.biz/console).
```
fliff config --token <accessToken>
```

#### B) Use short-lived access token
This approach is recommended. First setup your channel id and secret. They can be found in [LINE Developers Console](https://developers.line.biz/console).
```
fliff config --id <channelId> --secret <channelSecret>
```
After channel ID and secret are configured. Issue a channel access token and save it.
```
fliff token --issue --save
```
In case you want to revoke an access token, you can run with `--revoke` option.
```
fliff token --revoke <accessToken>
```

##### IMPORTANT NOTE
Short-lived access token is valid for 30 days. You should have a process to replace the access token periodically.

### Set Firebase Hosting URL
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
Add LIFF using view `--name` and `--url` options. We make `--type` option as optional in FireLIFF CLI to shorten the command line. So you can omit `--type`, it will be `full` by default. 
```
fliff add --name <viewName> --url <viewUrl>
```
If you prefer to specify type, run with `--type` option. It can be `full`, `tall` or `compact`.
```
fliff add --name <viewName> --url <viewUrl> --type <viewType>
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
To update Bluetooth® Low Energy (BLE) flag, use `--ble` option
```
fliff update --id <liffId> --ble <true|false>
```

#### IMPORTANT NOTE
The Name column in LIFF tab in LINE developers Console is not related to `fliff update --name` option here. According to LINE LIFF API specification, this Name of the LIFF app column is actually `description` in its request body. So If you would like to change this value you can run `fliff update --id <viewId> --description <descripton>`

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
List LIFF apps
```
fliff get
```
List LIFF apps with description and Bluetooth® Low Energy (BLE) flag
```
fliff get --detail
```

### Add RichMenu
To add a new RichMenu
```
richmenu add --name <richMenuName> --data <dataFile> --image <imageFile>
```
#### IMPORTANT NOTE
The richmenu naming cannot be uppercase due to Firebase Functions Configuration specification. It's recommended to use `rich-menu-name` pattern.

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
Set RichMenu for all users using RichMenu name
```
richmenu default --name <richMenuName>
```

### Link a RichMenu to an individual user
Link RichMenu to an individual user using RichMenu ID
```
richmenu link --id <richMenuId> --user <userId>
```
Link RichMenu to an individual user using RichMenu name
```
richmenu link --name <richMenuName> --user <userId>
```

### Unlink RichMenu from an individual user
Unlink RichMenu from an individual user
```
richmenu unlink --user <userId>
```

#### IMPORTANT NOTE
The RichMenu name is the name when you add the RichMenu with `--name` option which will be saved in Firebase Functions Configuration. It is not the same as a `name` property in data file. You can run `richmenu get` to see RichMenu name in the first column.

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

## LINE Things

### Enable LINE Things

To enable LINE Things, read [LINE Things Starter, Enable LINE Things](https://github.com/line/line-things-starter#enable-line-things) section

### LINE Things CLIs

**NOTE**: `things` CLIs send requests and `console.log` back the response data. It will not save any information.

#### Create trial product information

`things create:trial --liff <liffId> --name <productName>`

#### Get trial product information

`things get:trial`

#### Delete trial product information

`things delete:trial --product <productId>`

#### Get product ID and PSDI by device ID

`things get:product --device <deviceId>`

#### Get device information by device ID and user ID

`things get:device --device <deviceId> --user <userId>`

#### Get device information by product ID and user ID

`things get:device --product <productId> --user <userId>`

## LICENSE

MIT License

Copyright (c) 2018-2019 intocode Co., Ltd.

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
