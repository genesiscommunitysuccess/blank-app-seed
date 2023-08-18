#!/usr/bin/env sh

if [ ! -d "$HOME/.gradle" ]; then
  mkdir "$HOME/.gradle"
fi

if [ ! -d "$HOME/.m2" ]; then
  mkdir "$HOME/.m2"
fi

if [ -f "$HOME/.gradle/gradle.properties" ]; then
  rm "$HOME/.gradle/gradle.properties"
fi

touch $HOME/.gradle/gradle.properties

echo genesisArtifactoryUser="$genesisArtifactoryUser" >> $HOME/.gradle/gradle.properties
echo genesisArtifactoryPassword="$genesisArtifactoryPassword" >> $HOME/.gradle/gradle.properties

echo systemProp.org.gradle.internal.http.connectionTimeout=180000 >> $HOME/.gradle/gradle.properties
echo systemProp.org.gradle.internal.http.socketTimeout=180000 >> $HOME/.gradle/gradle.properties