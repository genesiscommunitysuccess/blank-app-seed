import { createLogicSuite } from '@genesislcap/foundation-testing';

const isHelloWorld = (arg) => arg === 'Hello world';

const Suite = createLogicSuite('isHelloWorld');
Suite('isHelloWorld should provide expected results', ({ runCases }) => {
  runCases(isHelloWorld, [
    [['1'], false],
    [[123], false],
    [['Hello world'], true],
  ]);
});

Suite.run();
