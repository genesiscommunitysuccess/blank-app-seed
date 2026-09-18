package scripts

router {
    webPort = 9064
    socketPort = 9065
{{#if AI.enabled}}

    // Raised for the AI chat proxy: a chat turn carrying history and tool definitions exceeds the
    // platform default of 262144 bytes, and the router refuses an oversized request before the
    // handler sees it.
    httpObjectAggregator {
        maxContentLength = 5242880
    }
{{/if}}

    cookieAuthentication {
      enabled = true
      httpOnly = true
      secure = false
      sameSite = SameSite.Lax
    }
}