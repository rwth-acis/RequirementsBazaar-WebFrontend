# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres
to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Releases prior to v2.0.1 are only documented on
the [GitHub Release Page](https://github.com/rwth-acis/RequirementsBazaar-WebFrontend/releases)

## [Unreleased]

## [2.3.0] - 2022-04-03

### Added

- Add featured projects as well as the 'Requirements Bazaar' project to the landing page
  [#200](https://github.com/rwth-acis/RequirementsBazaar-WebFrontend/pull/200)
- Add tooltips for project card icons
  [#202](https://github.com/rwth-acis/RequirementsBazaar-WebFrontend/pull/202)
- Monthly change indicators for statistics on landing page
  [#203](https://github.com/rwth-acis/RequirementsBazaar-WebFrontend/pull/203)
- Embed Twitter timeline of official @reqbaz account on landing page
  [#207](https://github.com/rwth-acis/RequirementsBazaar-WebFrontend/pull/207)
- System admins can link a Twitter account to Requirements Bazaar, which can then be used by Requirements Bazaar to tweet about different events automatically
  [#220](https://github.com/rwth-acis/RequirementsBazaar-WebFrontend/pull/220)
- Button on 'admin page' to trigger weekly 'new projects tweet' manually
  [#223](https://github.com/rwth-acis/RequirementsBazaar-WebFrontend/pull/223)
- Search and sort parameters for projects are parsed from URL and URL reflects current settings. This enables shareable links to a specifically sorted projects list (e.g., the latest added projects)
  [#224](https://github.com/rwth-acis/RequirementsBazaar-WebFrontend/pull/224)

### Changed

- Replaced hard-coded texts with localized attributes
  [#198](https://github.com/rwth-acis/RequirementsBazaar-WebFrontend/pull/198) and more
- Fixed: sorting projects by last activity returned wrong results [commit 5958b19893e8edaa0b11ea83436bd63b45436f0c](https://github.com/rwth-acis/RequirementsBazaar-WebFrontend/commit/5958b19893e8edaa0b11ea83436bd63b45436f0c)
- Open activity tracker links in same tab
  [commit e7c7e3d3fdfa28e9031d91a19a1ac444e89f02d8](https://github.com/rwth-acis/RequirementsBazaar-WebFrontend/commit/e7c7e3d3fdfa28e9031d91a19a1ac444e89f02d8)
- Fixed 'link to GitHub' not working for older projects
  [#205](https://github.com/rwth-acis/RequirementsBazaar-WebFrontend/pull/205)
- Fixed wrong form validation messages
  [#216](https://github.com/rwth-acis/RequirementsBazaar-WebFrontend/pull/216)
- Reworked requirement detail page: Replaced the reused requirement card from list pages with an actual detail page in the style of project and category page
  [#213](https://github.com/rwth-acis/RequirementsBazaar-WebFrontend/pull/213)
- French translation updates
  [#199](https://github.com/rwth-acis/RequirementsBazaar-WebFrontend/pull/199),
  [#204](https://github.com/rwth-acis/RequirementsBazaar-WebFrontend/pull/204), and
  [#206](https://github.com/rwth-acis/RequirementsBazaar-WebFrontend/pull/206)


## [2.2.1] - 2022-02-10

### Added

- Number of users, projects, comments, and requirements, as well as some feature descriptions on landing page [#184](https://github.com/rwth-acis/RequirementsBazaar-WebFrontend/pull/184)

### Changed

- Some dependency updates [#186](https://github.com/rwth-acis/RequirementsBazaar-WebFrontend/pull/186), [#187](https://github.com/rwth-acis/RequirementsBazaar-WebFrontend/pull/187)
- French translation updates [#189](https://github.com/rwth-acis/RequirementsBazaar-WebFrontend/pull/189)
- Fixed members tab not sowing after a user signed in [#195](https://github.com/rwth-acis/RequirementsBazaar-WebFrontend/pull/195)


## [2.2.0] - 2022-01-29

### Added

- Breadcrumb controls for project internal navigation (between project, categories, and requirement pages).[#171](https://github.com/rwth-acis/RequirementsBazaar-WebFrontend/pull/171)
- Navigate to requirement details page when clicking on title [#170](https://github.com/rwth-acis/RequirementsBazaar-WebFrontend/issues/170)
- Display a date label for each item in the activity tracker [#181](https://github.com/rwth-acis/RequirementsBazaar-WebFrontend/issues/181)

### Changed

- Show active and completed requirements in the designated tabs. Also, added a 'done' label to realized requirements [#164](https://github.com/rwth-acis/RequirementsBazaar-WebFrontend/pull/164)
- Inline link to GitHub issue instead of oversized button [#180](https://github.com/rwth-acis/RequirementsBazaar-WebFrontend/pull/180)
- Show development timeline only for requirements with linked issue [#179](https://github.com/rwth-acis/RequirementsBazaar-WebFrontend/issues/179)
- Disable development timeline in project overview [#175](https://github.com/rwth-acis/RequirementsBazaar-WebFrontend/issues/175)
- Add menu items on requirement card to create and view GitHub issue [#180](https://github.com/rwth-acis/RequirementsBazaar-WebFrontend/pull/180)

### Removed
- Remove GitHub option from share button and disable Twitter and Facebook options [#180](https://github.com/rwth-acis/RequirementsBazaar-WebFrontend/pull/180)

## [2.1.0] - 2022-01-22

### Added

- Timeline for Requirements that shows development progress from a connected GitHub repository
  [#156](https://github.com/rwth-acis/RequirementsBazaar-WebFrontend/pull/156). Includes:
  - A project can be connected to a GitHub repository
  - Requirements can be "shared" on GitHub, which prepares a pre-filled issue in the linked repository that references the requirement
  - Closing a GitHub issue linked to a requirement also changes the development status of the requirement
  - A new release in GitHub is mentioned on the Requirements Bazaar project page
- Better guide users through the process of connecting a GitHub repository to a Requirements Bazaar project [#165](https://github.com/rwth-acis/RequirementsBazaar-WebFrontend/pull/165)

## [2.0.3] - 2021-12-20

### Added

- Project member management (add members, remove members, and change their role) [#143](https://github.com/rwth-acis/RequirementsBazaar-WebFrontend/pull/143)
- Share a link to a single requirement [#144](https://github.com/rwth-acis/RequirementsBazaar-WebFrontend/pull/144)
- Show unhandled API or frontend error messages to the user [#148](https://github.com/rwth-acis/RequirementsBazaar-WebFrontend/pull/148)

### Changed

- Typo on landing page [#149](https://github.com/rwth-acis/RequirementsBazaar-WebFrontend/issues/149)
- Link correct activity tracker in production [#151](https://github.com/rwth-acis/RequirementsBazaar-WebFrontend/issues/151)
- Show default user icon if user profile image cannot be loaded, instead of 404 error. Also, actual profile images of comment creators will be displayed for requirement comments instead of a loading placeholder [#154](https://github.com/rwth-acis/RequirementsBazaar-WebFrontend/pull/154)


## [2.0.2] - 2021-12-20

### Changed

- Hotfix: A wrong header name (access_token) prevented new users from the using the Requirements Bazaar in any way because registration was not possible.
  [#141](https://github.com/rwth-acis/RequirementsBazaar-WebFrontend/pull/141)


## [2.0.1] - 2021-11-18

### Changed

- Fixed project search which did not show projects not loaded on the current page
  [#128](https://github.com/rwth-acis/RequirementsBazaar-WebFrontend/pull/128)

## [2.0.0-rc.1]

Version 2.0.0. of the Requirements Bazaar frontend is a complete rewrite of implemented using Vue.js
started on 09.02.2021. However, there were only two release candidates published on 04.05.2021.

Continuous documentation of changes will start again from version 2.0.1 on.

## [1.5.4] and older

See GH Releases
