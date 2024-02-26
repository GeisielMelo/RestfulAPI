import { CookieOptions } from 'express'

/** Default configuration to create a secure cookie for 30 days. */
export const COOKIE_SET_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: true,
  // sameSite: 'none',
  maxAge: 30 * 24 * 60 * 60 * 1000,
}

/** Default configuration to delete cookie data. */
export const COOKIE_UNSET_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
}
