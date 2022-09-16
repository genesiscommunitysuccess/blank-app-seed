/**
 * Common prompt feedback messages
 */

/**
 * TODO: Revisit these exports in the cli
 */
const {dsInto, scopedPackageInto} = require('@genesislcap/foundation-cli/dist/plop/messages');
const {Code, Text} = require('@genesislcap/foundation-cli/dist/plop/messages/color');
const {createLink} = require('@genesislcap/foundation-cli/dist/plop/messages/link');
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
  dsInto,
  inputStepThanks,
  lastBits,
  scopedPackageInto,
  seedSelection,
}
