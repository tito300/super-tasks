export function revokeGoogleToken(token: string) {
  const revokeUrl = "https://oauth2.googleapis.com/revoke";

  return fetch(revokeUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `token=${token}`,
  })
    .then((response) => {
      if (response.ok) {
        console.log("Token revoked successfully.");
      } else {
        console.error("Failed to revoke token.");
      }
    })
    .catch((error) => {
      console.error("Error revoking token:", error);
    });
}
