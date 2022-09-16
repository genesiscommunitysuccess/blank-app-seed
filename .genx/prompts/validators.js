/**
 * We may want to depend on @genesislcap/foundation-cli and import the helper functions required to create these
 * prompts etc. Or we create a @genesislcap/cli-utils / plop package that contains various, and both seeds
 * and the cli depends on that. Or we just re-create such helpers locally in the seed.
 */
const safeNameRegex = /^([a-zA-Z0-9\-]+)$/;
const websocketRegex = /wss?:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\b([-a-zA-Z0-9()@:%_\+.~#?&\/=]*)\b\/*$/;
const npmTokenRegex = /^([a-zA-Z0-9\_]+)$/;
const npmPackageRegex = /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/;
const mavenArtifactVersionRegex = /([\d+{1,3}\.A-Z]+)/;

const safeName = value => safeNameRegex.test(value) || 'Name cannot have spaces or special characters other than dashes.';
const websocketValidator = value => websocketRegex.test(value) || 'Not a valid websocket';
const npmTokenValidator = value => npmTokenRegex.test(value) || 'Not a valid .npmrc auth token';
const npmPackageValidator = value => npmPackageRegex.test(value) || 'Not a valid npm package';
const baseDsPackageValidator = value => npmPackageRegex.test(value) || 'Not a valid base design system package';
const mavenArtifactVersionValidator = value => mavenArtifactVersionRegex.test(value) || 'Not a valid version'

module.exports = {
  safeName,
  websocketValidator,
  npmTokenValidator,
  npmPackageValidator,
  baseDsPackageValidator,
  mavenArtifactVersionValidator
}
