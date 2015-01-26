RequirementsBazaar-WebFrontend
==============================

A Web frontend for the Requirements Bazaar.


How to run
----------
Make sure node.js and git are installed
```
node --version && npm --version && git --version
```
Install bower and grunt
```
npm install --global bower grunt-cli
```
Navigate to project folder and install dependencies and bower components with
```
npm install
bower install
```

Start in browser
```
grunt serve
```

How to build using Docker
-------------------------
Docker is providing the simplest way to run the Requirement Bazaar Web-Frontend. Just follow the following steps if Docker is already installed on your system:

 1. `git clone this repo` 
 2. `docker build -t rwthacis/reqbaz-webfrontend .` 
 3. ``docker run -i -t --rm -v `pwd`:/build rwthacis/reqbaz-webfrontend``


License
-------

```
Copyright 2014 RWTH Aachen University

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
