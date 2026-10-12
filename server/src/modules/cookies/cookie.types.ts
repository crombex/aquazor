import { CookieOptions } from "express";

export interface ICookieOptions extends CookieOptions{}

export type TAuthCookies = {
  accessToken?: string;
  refreshToken?: string;
};