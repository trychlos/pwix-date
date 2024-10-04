# pwix:date

## What is it ?

A Meteor package to manage dates formats and conversions.

Should probably rather a NPMJS package. To be done someday.

## Installation

This Meteor package is installable with the usual command:

```sh
    meteor add pwix:date
```

## Usage

```js
    import { DateJs } from 'meteor/pwix:date';
```

## Provides

### `DateJs`

The exported `DateJs` global object provides following items:

#### Functions

##### `DateJs.compare( a<Date|String|unset>, b<Date|String|unset>, opts<Object> )`

Compare two dates, returning:

- -1 if a lesser (is before) b
- 0 if a equal b
- +1 if a greater (is after) b.

`opts` is an optional options object with following keys:

- `start`: whether an undefined, or null, or invalid date is considered to be the infinite start, defaulting to `true`. Set to `false` to consider an infinite end.

##### `DateJs.compute( date<Date|String|unset>, days<Integer> )`

Compute the resulting date+days.

Returns its result as a Date object.

Note that an undefined, or null, or invalid date is considered to be an infinite one, and cannot be computed here. We return `null` in this case.

##### `DateJs.configure( o<Object> )`

See [below](#configuration)

Acts both as a getter and a setter.

A reactive data source.

##### `DateJs.i18n.namespace()`

Returns the i18n namespace used by the package. Used to add translations at runtime.

Available both on the client and the server.

##### `DateJs.isInfinite( date<Date|String|unset> )`

Returns `true` if the provided date is infinite whether it is infinite start or infinite end, `false` else.

Any null, or invalid or unset date is considered infinite.

##### `DateJs.isValid( date<Date|String|unset> )`

Returns `true` if the provided date is valid.

Any null, or invalid or unset date is considered invalid.

##### `DateJs.sanitize( date<Date|String|unset> )`

Sanitize the provided date, returning:

- either a valid `Date` object if the date is valid,

- or `null` if the date is invalid.

##### `DateJs.strftime2jquery( format<String> )`

Tries to convert a `strftime` date-time format to its `jQuery` equivalent.

Returns a jQuery-compatible format string.

##### `DateJs.toMs( date<Date|String|unset>, defaultValue<Date|String|Integer|unset> )`

Returns the milliseconds since Epoch of the provided date, defaulting to the provided default value, defaulting to the current local date.

##### `DateJs.toString( date<Date|String|unset>, opts<Object> )`

Returns the date as a string.

`opts` is an optional options object with following keys:

- `format`: the `strftime` desired format, defaulting to '%Y-%m-%d'

- `default`: the string to return if date is not set or empty, defaulting to ''.

## Configuration

The package's behavior can be configured through a call to the `DateJs.configure()` method, with just a single javascript object argument, which itself should only contains the options you want override.

Known configuration options are:

- `verbosity`

    Define the expected verbosity level.

    The accepted value can be any or-ed combination of following:

    - `DateJs.C.Verbose.NONE`

        Do not display any trace log to the console

    - `DateJs.C.Verbose.CONFIGURE`

        Trace `DateJs.configure()` calls and their result

Please note that `DateJs.configure()` method should be called in the same terms both in client and server sides.

Remind too that Meteor packages are instanciated at application level. They are so only configurable once, or, in other words, only one instance has to be or can be configured. Addtionnal calls to `DateJs.configure()` will just override the previous one. You have been warned: **only the application should configure a package**.

`DateJs.configure()` is a reactive data source.

## NPM peer dependencies

Starting with v 1.0.0, and in accordance with advices from [the Meteor Guide](https://guide.meteor.com/writing-atmosphere-packages.html#peer-npm-dependencies), we no more hardcode NPM dependencies in the `Npm.depends` clause of the `package.js`.

Instead we check npm versions of installed packages at runtime, on server startup, in development environment.

Dependencies as of v 1.0.0:

```js
    'lodash': '^4.17.0',
    'strftime': '^0.10.2'
```

Each of these dependencies should be installed at application level:

```sh
    meteor npm install <package> --save
```

## Translations

New and updated translations are willingly accepted, and more than welcome. Just be kind enough to submit a PR on the [Github repository](https://github.com/trychlos/pwix-date/pulls).

## Cookies and comparable technologies

None at the moment.

## Issues & help

In case of support or error, please report your issue request to our [Issues tracker](https://github.com/trychlos/pwix-date/issues).

---
P. Wieser
- Last updated on 2024, Oct. 4th
