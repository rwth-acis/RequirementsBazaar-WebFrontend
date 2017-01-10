Requirements Bazaar Web Frontend
================================

This repository contains the Web interface of the Requirements Bazaar. The project aims to offer users and developers of
any kind of applications, tools or services a platform on which they can collaborate and cooparate. This Web application
is built as a single-page application using Web Components with the Polymer 1.0 library.


Develop
----------
To start developing on the project. Make sure you have a running Requirements Bazaar service, which comes with demo
data, otherwise you won’t be able to see much. Then check out this project and then run following commands.

Make sure node.js is installed, you need it for the development process.
```
node --version && npm --version
```
Install polymer-cli and bower
```
npm install --global polymer-cli bower
```
Navigate to project folder and install dependencies and bower components with
```
npm install
bower install
```

Start locally in browser
```
polymer serve
```

Build / Deploy
----------
If you are not interested in developing the project, you can just build it. In order to build the project, run
```
polymer build
```
In the `build` folder you will find two built versions: `bundled` for serving over HTTP/2 and `unbundled` for serving
to traditional HTTP clients.


License
-------

```
The Requirements Bazaar Web Frontend is licensed under the MIT License. However, it is based on the Polymer Starter Kit
from Google, thus you find both licenses in the `LICENSE.md`file.

Copyright 2017 Advanced Community Information Systems (ACIS) Group, Chair of Computer Science 5 (Databases & Information
Systems), RWTH Aachen University, Germany

```
