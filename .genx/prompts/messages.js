/**
 * Common prompt feedback messages
 */

const {dsIntro, scopedPackageIntro, Code, Text, createLink} = require('@genesislcap/foundation-cli');
const {summary} = require('../details');

const seedSelection = () => console.log(`
  Thanks for choosing this seed.
  ${summary}`);

const inputStepThanks = () => console.log(`
  Great, thank you!
`);

const almostThere = () => console.log(`
  Great, we're almost there!
`);

const lastBits = () => console.log(`
  Last bits...
`);

module.exports = {
  Code,
  Text,
  createLink,
  almostThere,
  dsIntro,
  inputStepThanks,
  lastBits,
  scopedPackageIntro,
  seedSelection,
}
