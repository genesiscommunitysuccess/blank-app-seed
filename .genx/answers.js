const {writeFile} = require('@genesislcap/foundation-cli/dist/utils');

const read = () => {
  const publicAns = require('./answers.json');
  let privateAns = {};
  try {
    privateAns = require('./answers.private.json');
  } catch (e) {
    /**
     * We can safely ignore a read error here as if you're a collaborator and weren't responsible for the initial
     * creation of this project, or haven't re-configured it, you likely won't have a answers.private.json file.
     */
  }
  return {
    ...publicAns,
    ...privateAns,
  }
};

const write = data => {
  /**
   * Remove user specific values before saving, as devs will collaborate. We could use the replacer to whitelist, but we
   * can't know all the keys the CLI might use. It's better to just remove the ones we know we don't need to save.
   */
  const {
    directory,
    appDirectory,
    targetDirectory,
    workspaceName,
    ...answers
  } = data;
  writeFile(`${__dirname}/answers.json`, JSON.stringify(answers, null, 2));

  /**
   * Add user specific values to private answers file which is not committed to source control
   */
  writeFile(`${__dirname}/answers.private.json`, JSON.stringify({
    directory,
    appDirectory,
    targetDirectory,
  }, null, 2));

  /**
   * Currently the CLI will write some .env files to the root however we may wish to take control of this here.
   */
}

module.exports = {
  write,
  read,
}
