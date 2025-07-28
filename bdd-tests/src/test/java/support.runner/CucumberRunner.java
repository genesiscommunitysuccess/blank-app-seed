package support.runner;

import global.genesis.cucumber.runner.AbstractGenesisCucumberRunner;
import org.junit.platform.suite.api.IncludeTags;

@IncludeTags({"API","UI"})
public class CucumberRunner extends AbstractGenesisCucumberRunner {
}