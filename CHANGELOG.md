# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres
to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Releases prior to v2.0.1 are only documented on
the [GitHub Release Page](https://github.com/rwth-acis/RequirementsBazaar-WebFrontend/releases)

## [Unreleased]


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
