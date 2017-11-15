@linkexchange/widgets [![](https://data.jsdelivr.com/v1/package/npm/@linkexchange/widgets/badge)](https://www.jsdelivr.com/package/npm/@linkexchange/widgets)  

## Development instructions:
- [`yarn`](https://yarnpkg.com/en/docs/install)
- `cd apps/$APP_TO_DEVELOP`
- `yarn start`

## Build for serving locally:

    mkdir -p /tmp/somedir
    cd /tmp/somedir
    python3 -m http.server

## In another terminal (inside Apps repository):

    docker build . -t a; docker run -it -v /tmp/somedir:/builddir  a /bin/bash -c "cp -r /release/* /builddir"
