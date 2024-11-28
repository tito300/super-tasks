const calendarEvent1 = {
  kind: "calendar#event",
  etag: '"3461951559232000"',
  id: "2gnrr7q6ekg55lquv8h1p5qpfl_R20240321T143000",
  status: "confirmed",
  htmlLink:
    "https://www.google.com/calendar/event?eid=MmducnI3cTZla2c1NWxxdXY4aDFwNXFwZmxfMjAyNDAzMjFUMTQzMDAwWiB0YXJlay5kZW1hY2hraWVAd29ya3dhdmUuY29t",
  created: "2024-01-16T16:30:23.000Z",
  updated: "2024-11-07T10:36:19.616Z",
  summary: "Go to Market Meeting",
  description:
    "<b>Meeting Agenda:</b><br><ul><li><b>Product: </b>Status Updates on GTM plan.</li><li><b>Engineering</b>: Status update on delivery dates.</li>",
  creator: {
    email: "joejeen@gmail.com",
    displayName: "Joe Jeen",
  },
  organizer: {
    email: "joejeen@gmail.com",
    displayName: "Joe Jeen",
  },
  start: {
    dateTime: "2024-11-21T19:00:00.000Z",
    timeZone: "America/New_York",
  },
  end: {
    dateTime: "2024-11-21T20:00:00.000Z",
    timeZone: "America/New_York",
  },
  recurrence: ["RRULE:FREQ=WEEKLY;BYDAY=TH"],
  iCalUID: "2gnrr7q6ekg55lquv8h1p5qpfl_R20240321T143000@google.com",
  sequence: 0,
  attendees: [
    {
      email: "johndoe@gmail.com",
      displayName: "John Doe",
      responseStatus: "needsAction",
    },
    {
      email: "diana@gmail.com",
      displayName: "Diana K",
      responseStatus: "needsAction",
    },
    {
      email: "joejeen@gmail.com",
      self: true,
      responseStatus: "accepted",
    },
  ],
  hangoutLink: "https://meet.google.com/hmr-pnuk-aqc",
  reminders: {
    useDefault: true,
  },
  eventType: "default",
  totalStackedEvents: 1,
  reservationCount: 1,
};

const calendarEvent2 = {
  kind: "calendar#event",
  etag: '"346195155923200034"',
  id: "2gnrr7q6ekg55lquv8h1p5qpfl_R20240fs3e321T143000",
  status: "confirmed",
  htmlLink:
    "https://www.google.com/calendar/event?eid=MmducnI3cTZla2c1NWxxdXY4aDFwNXFwZmxfMjAyNDAzMjFUMTQzMDAwWiB0YXJlay5kZW1hY2hraWVAd29ya3dhdmUuY29t",
  created: "2024-01-16T16:30:23.000Z",
  updated: "2024-11-07T10:36:19.616Z",
  summary: "Joe/John 1:1",
  description:
    "<p>1:1 agenda</p><br><ul><li>Resolve any blockers</li><li>Discuss any new features</li><li>Discuss any new bugs</li></ul>",
  creator: {
    email: "joejeen@gmail.com",
    displayName: "Joe Jeen",
  },
  organizer: {
    email: "joejeen@gmail.com",
    displayName: "Joe Jeen",
  },
  start: {
    dateTime: "2024-11-21T20:30:00.000Z",
    timeZone: "America/New_York",
  },
  end: {
    dateTime: "2024-11-21T21:00:00.000Z",
    timeZone: "America/New_York",
  },
  recurrence: ["RRULE:FREQ=WEEKLY;BYDAY=TH"],
  iCalUID: "2gnrr7q6ekg55lquv8h1p5qpfl_R20240321T143000@google.com",
  sequence: 0,
  attendees: [
    {
      email: "johndoe@gmail.com",
      displayName: "John Doe",
      responseStatus: "needsAction",
    },
    {
      email: "diana@gmail.com",
      displayName: "Diana K",
      responseStatus: "needsAction",
    },
  ],
  hangoutLink: "https://meet.google.com/hmr-pnuk-aqc",
  reminders: {
    useDefault: true,
  },
  eventType: "default",
  totalStackedEvents: 1,
  reservationCount: 1,
};

const calendarEvents = [calendarEvent1, calendarEvent2];

export function getCalendarEvents() {
  return calendarEvents;
}
