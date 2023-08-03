const websocketRegex = /wss?:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\b([-a-zA-Z0-9()@:%_\+.~#?&\/=]*)\b\/*$/;
const mavenArtifactVersionRegex = /([\d+{1,3}\.A-Z]+)/;

const websocketValidator = value => websocketRegex.test(value) || 'Not a valid websocket';
const mavenArtifactVersionValidator = value => mavenArtifactVersionRegex.test(value) || 'Not a valid version'

module.exports = {
  websocketValidator,
  mavenArtifactVersionValidator
}
