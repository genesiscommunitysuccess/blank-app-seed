package scripts

router {
    webPort = 9064
    socketPort = 9065

    cookieAuthentication {
      enabled = true
      httpOnly = true
      secure = false
      sameSite = SameSite.Lax
    }
}