#!/bin/bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
echo "Building Syntax Error Sound Plugin in $DIR..."

JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
JAVAC="$JAVA_HOME/bin/javac"
JAR="$JAVA_HOME/bin/jar"

BUILD_DIR="$DIR/build"
CLASSES_DIR="$BUILD_DIR/classes"
DIST_DIR="$BUILD_DIR/distributions"

rm -rf "$BUILD_DIR"
mkdir -p "$CLASSES_DIR"
mkdir -p "$DIST_DIR"

echo "Compiling Java classes..."
"$JAVAC" -cp "/Applications/Android Studio.app/Contents/lib/*" \
  -d "$CLASSES_DIR" \
  "$DIR/src/main/java/com/syntaxerror/sound/"*.java

echo "Copying resources..."
cp -r "$DIR/src/main/resources/"* "$CLASSES_DIR/"

echo "Packaging plugin JAR..."
"$JAR" cf "$DIST_DIR/syntax-error-sound.jar" -C "$CLASSES_DIR" .

echo "Creating plugin ZIP distribution..."
ZIP_STAGE="$BUILD_DIR/zip-stage/syntax-error-sound/lib"
mkdir -p "$ZIP_STAGE"
cp "$DIST_DIR/syntax-error-sound.jar" "$ZIP_STAGE/"
(cd "$BUILD_DIR/zip-stage" && /usr/bin/zip -q -r "$DIST_DIR/syntax-error-sound-plugin.zip" syntax-error-sound)

echo "Deploying to Android Studio plugins directory..."
for pdir in ~/Library/Application\ Support/Google/AndroidStudio*; do
  if [ -d "$pdir" ]; then
    mkdir -p "$pdir/plugins/syntax-error-sound/lib"
    cp "$DIST_DIR/syntax-error-sound.jar" "$pdir/plugins/syntax-error-sound/lib/"
    echo " -> Deployed to $pdir"
  fi
done

echo "Build complete! Plugin zip available at:"
echo "$DIST_DIR/syntax-error-sound-plugin.zip"
