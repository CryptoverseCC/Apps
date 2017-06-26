Build for serving locally:

    mkdir -p ~/apps
    cd ~
    python3 -m http.server

In another terminal (inside Apps repository):

    docker build . -t a; docker run -it -v ~/apps:/builddir  a /bin/bash -c "cp -r /release/* /builddir"