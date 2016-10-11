RequirementsBazaar-WebFrontend
==============================

This project is a web interface to the requirements bazaar service. The project aims to offer user and developers a platform on which to cooperate. To read more about the idea behind requirements bazaar read the service page. This Web interface is built as a single page application using web components library, Polymer 1.0.


Develop
----------
To start developing on the project. Make sure you have a running requirements bazaar service, which comes with demo data, otherwise you won’t be able to see much. Then check out this project and then run following commands.

Make sure node.js and git are installed
```
node --version && npm --version && git --version
```
Install bower and gulp
```
npm install --global bower gulp
```
Navigate to project folder and install dependencies and bower components with
```
npm install
bower install
```

Start locally in browser
```
gulp serve
```

Usage / Deployment
----------
If you are not interested in developing the project, then you can just build the project, then follow the steps in develop section until ```gulp serve```. In order to build the project and vulcanise ready for deployment you can just run ```gulp serve:dist```. This will create a dist folder where it will minimize all components and styling data in compact files ready to upload.


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