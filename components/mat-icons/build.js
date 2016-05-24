/*jslint browser: true, devel: true, node: true, ass: true, nomen: true, unparam: true, indent: 4 */

/**
 * @license
 * Copyright (c) 2015 The ExpandJS authors. All rights reserved.
 * This code may only be used under the BSD style license found at https://expandjs.github.io/LICENSE.txt
 * The complete set of authors may be found at https://expandjs.github.io/AUTHORS.txt
 * The complete set of contributors may be found at https://expandjs.github.io/CONTRIBUTORS.txt
 */
(function () {
    "use strict";

    // Vars
    var fs      = require('fs'),
        XP      = require('expandjs'),
        dir     = '../material-design-icons',
        exclude = ['sprites'],
        groups  = {};

    // Extracting (groups)
    XP.forEach(fs.readdirSync(dir), function (sub) {

        // Checking
        if (!fs.statSync(dir + '/' + sub).isDirectory() || exclude.indexOf(sub) >= 0) { return; }

        // Vars
        var group    = groups[sub] = {},
            items    = fs.readdirSync(dir + '/' + sub + '/svg/production'),
            filtered = XP.filter(items, function (item) { return item.match(/24px/); });

        // Extracting (items)
        XP.forEach(filtered, function (item) {

            // Vars
            var id  = item.replace('ic_', '').replace('_24px.svg', '').replace(/_/g, '-'),
                svg = fs.readFileSync(dir + '/' + sub + '/svg/production/' + item, 'utf-8');

            // Setting
            group[id] = svg.replace(/<svg.*?>/, '').replace('</svg>', '');
        });
    });

    // Writing
    XP.forOwn(groups, function (icons, name) {

        // Vars
        var text = '<link rel="import" href="../xp-iconset/xp-iconset.html">\n';

        // Build: header
        text += '\n';
        text += '<xp-iconset name="' + name + '">\n';
        text += '    <svg>\n';
        text += '        <defs>\n';

        // Build: icons
        XP.forOwn(icons, function (svg, id) {
            text += '            <g id="' + id + '">' + svg + '</g>\n';
        });

        // Build: footer
        text += '        </defs>\n';
        text += '    </svg>\n';
        text += '</xp-iconset>';

        // Writing
        fs.writeFileSync(__dirname + '/' + name + '-icons.html', text);
    });

    // Logging
    console.log('ICONS UPDATED!');

}());
