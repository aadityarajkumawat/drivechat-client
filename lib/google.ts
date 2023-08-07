import { BASE_URL, __is_prod__ } from ".";

export const REDIRECT_URI = `${BASE_URL}/callback/google`;

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string;

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
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/drive.appdata",
      "https://www.googleapis.com/auth/drive.file",
      "https://www.googleapis.com/auth/drive.metadata",
      "https://www.googleapis.com/auth/drive.photos.readonly",
    ].join(" "),
  };

  console.log(options.redirect_uri);

  const qs = new URLSearchParams(options);

  return `${rootUrl}?${qs.toString()}`;
}
