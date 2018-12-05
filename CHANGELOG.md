# Changelog
## [Unreleased]
### Fixed
 - Fixed unknown option

## [1.4.1] - 2018-12-02
### Added
 - `--help` option to display usages of CLIs

## [1.4.0] - 2018-11-30
### Added
 - `fliff update` can update partially
 - `fliff update` can update `features.ble` and `description`
 - `fliff add` can omit `type` option, it will be `full` by default
 - `fliff add` auto correct `name` option before set to Firebase Functions configuration to avoid error
 - `fliff add` can add `features.ble` and `description`
 - `fliff add` without `description` will set default description with `name` option
 - `fliff config` can set channel ID and secret
 - `fliff token` can issue and revoke short-lived access token
 - `fliff get` support `--detail` option to display Description and BLE

## [1.3.0] - 2018-11-20
### Added
 - `richmenu default` to set default RichMenu for all users
 - `richmenu link` to link RichMenu to an individual user
 - `richmenu unlink` to unlink RichMenu from an individual user

## [1.2.0] - 2018-10-26
### Added
 - `fliff init`
    - Can generate LIFF app project in `web-views` folder

## [1.1.0] - 2018-09-26
### Added
 - `richmenu`
    - Can add & upload, get, delete RichMenu

## [1.0.1] - 2018-09-21
### Fixed
 - Fixed minor bug

## [1.0.0] - 2018-09-21
### Added
 - `fliff`
    - Can add, update, get, delete LIFF apps
