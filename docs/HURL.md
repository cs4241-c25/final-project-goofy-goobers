# Hurl Testing
[Hurl](https://hurl.dev/) is a command line tool that runs HTTP requests defined in a simple plain text format.

## Installation
It should be noted that this is not required whatsoever, it's just a useful utility for testing.

### macOS
Install via Homebrew: `brew install hurl`

### Windows
Install via the Windows Package Manager: `winget install hurl`.

### Other
For a full list of install methods, please review Hurl's official documentation [here](https://hurl.dev/docs/installation.html).

## Conventions
Hurl files are created with the `.hurl` extension and are located in the `hurl` directory.

The formatting convention can be found [here](https://hurl.dev/docs/hurl-file.html), but a sample `POST` request is provided below.

## Example
```Hurl
# hurl/example.hurl
# refers to path defined in ROUTES.md
POST http://localhost:8082/api/example/login
{
    "username": "gompei",
    "password": "salisbury"
}
```