systemDefinition {
    global {
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
        item(name = "DbMode", value = "VANILLA")
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

        system(name = "DEV") {

            hosts {
                host(LOCAL_HOST)
            }

            item(name = "DbNamespace", value = "{{appName}}")
            item(name = "ClusterPort", value = "6000")
            item(name = "location", value = "LO")
            item(name = "LogFramework", value = "LOG4J2")
            item(name = "LogFrameworkConfig", value = "log4j2-default.xml")
        }

    }

}
