# Genesis Product multi-pro-code-test

If you choose name of the project as **multi-pro-code-test**

# Project structure

1. multi-pro-code-test-config -> holds the configuration, including the dictionary(fields, tables, views, -processes.xml, -service-definition, -system-definition)
2. multi-pro-code-test-script-config -> holds the scripts configuration(data-servers, request-replies and event-handlers scripts)
3. multi-pro-code-test-messages -> holds the message classes used in other modules e.g. eventhandler
4. multi-pro-code-test-eventhandler -> holds eventhandler classes(If you want to add custom-event-handlers)
5. multi-pro-code-test-dictionary-cache -> generates dao classes
6. multi-pro-code-test-distribution -> builds the distribution zip

# Adding modules 

Please make sure to add new modules as a dependency to multi-pro-code-test-distribution

# Build generated code 

To build the generated code, please run `gradle build` on multi-pro-code-test-dictionary-cache, this will generated 
the following jars: 

* genesis-generated-sysdef
* genesis-generated-fields
* genesis-generated-dao
* genesis-generated-hft
* genesis-generated-view
