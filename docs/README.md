# wipro
weather forecast app

# Install

Assuming you already have an ode environment installed.


Assuming you’ve already installed Node.js, make this folder your working directory.

$ cd wipro

Use the npm install command to install moduels in package.json.

$ npm install

This command installs the moduels needed to run this app. Simply hit RETURN after entering your command.

There are many commands available to help you build and test sites. Here are a few highlights to get started with.

## Watch For Changes & Automatically Refresh Across Devices

```sh
$ gulp serve
```
Please use gulp serve command to run my solution once you have followed the instructions in the README file.

This outputs an IP address you can use to locally test and another that can be used on devices
connected to your network.
`serve` does not use [service worker](http://www.html5rocks.com/en/tutorials/service-worker/introduction/)
caching, so your site will stop being available when the web server stops running.

## Build & Optimize

```sh
$ gulp
```

Build and optimize the current project, ready for deployment.
This includes linting as well as image, script, stylesheet and HTML optimization and minification.


## Serve the Fully Built & Optimized Site

```sh
$ gulp serve:dist
```

This outputs an IP address you can use to locally test and another that can be used on devices
connected to your network.
`serve:dist` includes will serve a local copy of the built and optimized site generated as part
of the `default` task.
`serve:dist` uses a different HTTP port than `serve`, which means that the service workers are
kept isolated in different [scopes](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers#Registering_your_worker).

## Difference Between `serve` & `serve:dist`

It is important to note a difference between the `serve` and `serve:dist` tasks.

* `serve` uses a no-op `service-worker.js` and cannot run offline.
* `serve:dist` uses the `sw-precache`-generated output and can run offline.

The `serve` task runs on port 3000 and `serve:dist` runs on port 3001.


PLEASE USE THE GULP SRVE COMMAND TO RUN MY SOLUTION ONCE YOU HAVE FINSHED READING THE CONTENTS OF THIS README FILE.
