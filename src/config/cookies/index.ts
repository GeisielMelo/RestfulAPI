import { CookieOptions } from 'express'

/** Default configuration to create a secure cookie for 7 days. */
export const REFRESH_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: true,
  // sameSite: 'none',
  maxAge: 7 * 24 * 60 * 60 * 1000,
}

/** Default configuration to create a secure cookie for 6 horas. */
export const ACCESS_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: true,
  // sameSite: 'none',
  maxAge: 6 * 60 * 60 * 1000,
}

/** Default configuration to delete cookie data. */
export const UNSET_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
}
