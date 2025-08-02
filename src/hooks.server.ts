import { deleteSessionTokenCookie, sessionCookieName, setSessionTokenCookie, validateSessionToken } from "@/server/auth";
import type { Handle } from "@sveltejs/kit";

process.env.TZ = 'America/Los_Angeles';

export const handle: Handle = async ({ event, resolve }) => {
    const token = event.cookies.get(sessionCookieName);
    const { session, user } = await validateSessionToken(token);

    if (session) {
        setSessionTokenCookie(token!, session.expiresAt);
    } else  {
        deleteSessionTokenCookie();
    }

    event.locals.session = session;
    event.locals.user = user;

    return resolve(event);
}