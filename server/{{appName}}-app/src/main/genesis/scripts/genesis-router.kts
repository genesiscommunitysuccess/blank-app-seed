package scripts

router {
    webPort = 9064
    socketPort = 9065
{{#if AI.enabled}}

    // Raised for the AI chat proxy: a chat turn carrying history and tool definitions exceeds the
    // platform default of 262144 bytes, and the router refuses an oversized request before the
    // handler sees it. 6 MiB, a little above the proxy's own 5 MiB limit, so a turn just over that
    // limit reaches the proxy and gets its REQUEST_TOO_LARGE code rather than an empty 413.
    httpObjectAggregator {
        maxContentLength = 6291456
    }
{{/if}}

    cookieAuthentication {
      enabled = true
      httpOnly = true
      secure = false
      sameSite = SameSite.Lax
    }
}