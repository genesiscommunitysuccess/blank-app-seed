package scripts

router {
    cookieAuthentication {
      enabled = true
      httpOnly = true
      secure = false
      sameSite = SameSite.Lax
    }
}
