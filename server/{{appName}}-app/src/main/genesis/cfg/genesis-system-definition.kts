systemDefinition {
    global {
        item(name = "DbNamespace", value = "{{localGenId}}")
        item(name = "PrimaryIfSingleNode", value = "true")
        item(name = "ClusterPort", value = "6000")
        item(name = "Location", value = "LO")
        item(name = "LogFramework", value = "LOG4J2")
        item(name = "LogFrameworkConfig", value = "log4j2-default.xml")
        item(name = "DbLayer", value = "SQL")
        item(name = "SqlEnableSequenceGeneration", value = true)
        item(name = "DictionarySource", value = "DB")
        item(name = "DbHost", value = "jdbc:h2:file:~/genesis-local-db/{{appName}}/h2/test;DB_CLOSE_DELAY=-1;NON_KEYWORDS=VALUE,KEY;AUTO_SERVER=TRUE")
        item(name = "DbQuotedIdentifiers", value = true)
        item(name = "DEPLOYED_PRODUCT", value = "{{appName}}")
        item(name = "MqLayer", value = "ZeroMQ")
        item(name = "AliasSource", value = "DB")
        item(name = "HookStateStore", value = "DB")
        item(name = "MetricsEnabled", value = "false")
        item(name = "ZeroMQProxyInboundPort", value = "5001")
        item(name = "ZeroMQProxyOutboundPort", value = "5000")
        item(name = "DbUsername", value = "Enter DB Username")
        item(name = "DbPassword", value = "Enter DB Password")
        item(name = "DbSqlConnectionPoolSize", value = "3")
        item(name = "GenesisNetProtocol", value = "V2")
        item(name = "ResourcePollerTimeout", value = "5")
        item(name = "ReqRepTimeout", value = "60")
        item(name = "MetadataChronicleMapAverageKeySizeBytes", value = "128")
        item(name = "MetadataChronicleMapAverageValueSizeBytes", value = "1024")
        item(name = "MetadataChronicleMapEntriesCount", value = "512")
        item(name = "DaemonServerPort", value = "4568")
        item(name = "DaemonHealthPort", value = "4569")
        item(
            name = "JVM_OPTIONS",
            value = "-XX:MaxHeapFreeRatio=70 -XX:MinHeapFreeRatio=30 -XX:+UseG1GC -XX:+UseStringDeduplication -XX:OnOutOfMemoryError=\"handleOutOfMemoryError.sh %p\""
        )
    }

    systems {

        //Template setup for a cluster of hosts to help when setting up the application for a HA Prod environment
        //If you are looking to use containers, the system definition block is not needed and can be removed
        //  Please see the following docs for container setup guidance : https://docs.genesis.global/docs/build-deploy-operate/deploy/hosting-infrastructure/containers/
        system(name = "PROD") {

            hosts {
                //Change these to list each of the servers in your production cluster when known, more than one host being defined means they will try to operate as a cluster
                //Ensure that firewall is configured for the hosts to be able to communicate per https://docs.genesis.global/docs/build-deploy-operate/deploy/supporting-infrastructure/#firewall
                host("app-prod-host1")
                host("app-prod-host2")
            }

            //ZeroMQ settings required for cluster operation : Read more at https://docs.genesis.global/docs/build-deploy-operate/operate/update-queue#zeromq-configuration-options
            item(name = "ZeroMqProxyModeEnabled", value = "true")
            item(name = "ZeroMQProxyUnicastRelayEnabled", value = "true")

        }

        system(name = "DEV") {

            hosts {
                //This block is used to run the application locally and will take your local machine host name
                host(LOCAL_HOST)
            }

            //ZeroMQ settings required for running the app locally : Read more at https://docs.genesis.global/docs/build-deploy-operate/operate/update-queue#zeromq-configuration-options
            item(name = "ZeroMQConnectToLocalhostViaLoopback", value = "true")

        }

    }

}
