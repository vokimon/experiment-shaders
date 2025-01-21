#!/bin/bash

error() {
    echo -e "\033[31;1m$@\033[0m"
}
warn() {
    echo -e "\033[33;1m$@\033[0m"
}

FRAGMENT_PAGE=$(cat <<EOF
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TITLE</title>
    <script type="text/javascript" src="https://rawgit.com/patriciogonzalezvivo/glslCanvas/master/dist/GlslCanvas.js"></script>
    <link rel="icon" type="image/x-icon" href="texture.png">
    <style>
        :root {
          background-color: #010101;
          color: #aae;
        }
        .glslCanvas {
            position: fixed;
            onset: 0 0 0 0; 
        }
        body { margin: 0; position: relative;}
        canvas { display: block; }
    </style>
</head>
<body>
<h1>TITLE</h1>
<canvas class="glslCanvas" data-fragment-url="SHADER" data-textures="texture.png" style="position: fixed; top: 0; width: 100%; height: 100vh"></canvas>
</body>
</html>
EOF
)

cat > index.html <<EOF
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TITLE</title>
    <link rel="icon" type="image/x-icon" href="texture.png">
    <script type="text/javascript" src="https://rawgit.com/patriciogonzalezvivo/glslCanvas/master/dist/GlslCanvas.js"></script>
    <style>
        :root {
          background-color: #010101;
          color: #aae;
        }
    </style>
</head>
<body>
<ul>
EOF

for shader in *frag
do
    shader_title=$(cat "${shader}" | grep Title | sed 's/.*Title: \(.*\)$/\1/')
    [ -z $shader_title ] && {
        warn "Missing title in shader $shader"
        shader_title="${shader/.frag/}"
    }
    echo TITLE: "$shader_title"
    shader_page="${shader/.frag/.html}"
    echo Generating $shader_page...
    echo "$FRAGMENT_PAGE" \
        | sed 's/TITLE/'"$shader_title"'/' \
        | sed 's/SHADER/'"$shader"'/' \
        > "$shader_page"
    echo "<li><a href='$shader_page'>$shader_title</a></li>" >> index.html

done


cat >> index.html <<EOF
</ul>
</body>
</html>
EOF
