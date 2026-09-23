/**
 * System              : Genesis Business Library
 * Sub-System          : multi-pro-code-test Configuration
 * Version             : 1.0
 * Copyright           : (c) Genesis
 * Date                : 2022-03-18
 * Function : Provide system definition config for multi-pro-code-test.
 *
 * Modification History
 */
systemDefinition {
    global {
{{#if AI.enabled}}
        // AI chat. The two keys are DELIBERATELY EMPTY: set the one your app uses in the environment
        // that starts the server (GENESIS_SYSDEF_AI_ANTHROPIC_API_KEY or GENESIS_SYSDEF_AI_GEMINI_API_KEY),
        // never here, where it would live in source control. AI_ALLOWED_MODELS bounds which models the
        // chat may ask for, and AI_MAX_OUTPUT_TOKENS caps the output size a single call can request.
        item(name = "AI_ANTHROPIC_API_KEY", value = "")
        item(name = "AI_GEMINI_API_KEY", value = "")
        item(name = "AI_ALLOWED_MODELS", value = "{{AI.allowedModels}}")
        item(name = "AI_MAX_OUTPUT_TOKENS", value = "{{AI.maxOutputTokens}}")
{{/if}}

    }

    systems {

    }

}