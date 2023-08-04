import { __is_prod__ } from ".";

export const BASE_URL = __is_prod__
  ? "https://webmarkserver.up.railway.app"
  : `http://127.0.0.1:5000`;
export const REDIRECT_URI = `${BASE_URL}/callback/google`;

const GOOGLE_CLIENT_ID =
  "881365933465-8p88663jo662djd5kllfc0sudnq6lclj.apps.googleusercontent.com";

export function getGoogleOAuthURL(redirect?: string) {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";

  const options = {
    redirect_uri: redirect
      ? `${REDIRECT_URI}?redirect_uri=${redirect}`
      : REDIRECT_URI,
    client_id: GOOGLE_CLIENT_ID,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/drive.metadata.readonly",
      "https://www.googleapis.com/auth/drive.readonly",
    ].join(" "),
  };

  console.log(options.redirect_uri);

  const qs = new URLSearchParams(options);

  return `${rootUrl}?${qs.toString()}`;
}
