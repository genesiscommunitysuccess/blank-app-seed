/**
 * System              : Genesis Business Library
 * Sub-System          : multi-pro-code-test Configuration
 * Version             : 1.0
 * Copyright           : (c) Genesis
 * Date                : 2022-03-18
 * Function : Provide table definition config for multi-pro-code-test.
 *
 * Modification History
 */

tables {

    table (name = "TRADE", id = 2000) {
        sequence(TRADE_ID, "TR")
        QUANTITY
        PRICE
        SYMBOL
        DIRECTION

        primaryKey {
            TRADE_ID
        }
    }
    
}