# @cowtech/esm-package-utils

[![Package Version](https://img.shields.io/npm/v/@cowtech/esm-package-utils.svg)](https://npm.im/@cowtech/esm-package-utils)
[![Dependency Status](https://img.shields.io/david/cowtech/esm-package-utils)](https://david-dm.org/cowtech/esm-package-utils)

Small package to help building ESM NPM packages.

https://sw.cowtech.it/esm-package-utils

## Usage

After your files have been compiled, let's say in `dist/mjs` folder, you can run the following (or include in `package.json` scripts):

```sh
renamer --find js --replace mjs dist/mjs/* && esm-pkg-add-imports-extensions -e mjs dist/mjs/**
```

This command will rename any file to `.mjs` extension and will make sure that any local `import ... from` or `export ... from` has `.mjs` or `index.mjs` at the end of the path.

## Contributing to @cowtech/esm-package-utils

- Check out the latest master to make sure the feature hasn't been implemented or the bug hasn't been fixed yet.
- Check out the issue tracker to make sure someone already hasn't requested it and/or contributed it.
- Fork the project.
- Start a feature/bugfix branch.
- Commit and push until you are happy with your contribution.
- Make sure to add tests for it. This is important so I don't break it in a future version unintentionally.

## Copyright

Copyright (C) 2021 and above Shogun <shogun@cowtech.it>.

Licensed under the MIT license, which can be found at https://choosealicense.com/licenses/isc.
