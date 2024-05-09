export type Calendar = {
  kind: "calendar#calendar";
  etag: unknown;
  id: string;
  summary: string;
  description: string;
  location: string;
  timeZone: string;
  conferenceProperties: {
    allowedConferenceSolutionTypes: string[];
  };
};

/**
 * ListCalendar vs Calendar:
 * https://developers.google.com/calendar/api/concepts/events-calendars#calendar_list
 */
export type ListCalendar = {
  kind: "calendar#calendarListEntry";
  etag: unknown;
  id: string;
  summary: string;
  description: string;
  location: string;
  timeZone: string;
  summaryOverride: string;
  colorId: string;
  backgroundColor: string;
  foregroundColor: string;
  hidden: boolean;
  selected: boolean;
  accessRole: string;
  defaultReminders: [
    {
      method: string;
      minutes: number;
    }
  ];
  notificationSettings: {
    notifications: [
      {
        type: string;
        method: string;
      }
    ];
  };
  primary: boolean;
  deleted: boolean;
  conferenceProperties: {
    allowedConferenceSolutionTypes: string[];
  };
};

export type SavedCalendarEvent = {
  kind: string;
  etag: unknown;
  id: string;
  status: string;
  htmlLink: string;
  created: string;
  updated?: string;
  summary?: string;
  description?: string;
  location?: string;
  colorId?: string;
  // custom to axcess. used to indicate overlapping event order
  reservationCount?: number;
  totalStackedEvents?: number;
  creator: {
    id: string;
    email: string;
    displayName: string;
    self: boolean;
  };
  organizer?: {
    id: string;
    email: string;
    displayName: string;
    self: boolean;
  };
  start: {
    date: string;
    dateTime: string;
    timeZone: string;
  };
  end: {
    date: string;
    dateTime: string;
    timeZone: string;
  };
  endTimeUnspecified: boolean;
  recurrence: string[];
  recurringEventId: string;
  originalStartTime: {
    date: string;
    dateTime: string;
    timeZone: string;
  };
  transparency: string;
  visibility: string;
  iCalUID: string;
  sequence: number;
  attendees: 
    {
      id: string;
      email: string;
      displayName: string;
      organizer?: boolean;
      self?: boolean;
      resource?: boolean;
      optional?: boolean;
      responseStatus: unknown;
      comment: string;
      additionalGuests: number;
    }[];
  attendeesOmitted: boolean;
  extendedProperties: {
    private: {
      [k: string]: string;
    };
    shared: {
      [k: string]: string;
    };
  };
  hangoutLink: string;
  conferenceData?: {
    createRequest: {
      requestId: string;
      conferenceSolutionKey: {
        type: string;
      };
      status: {
        statusCode: string;
      };
    };
    entryPoints: 
      {
        entryPointType: string;
        uri: string;
        label: string;
        pin: string;
        accessCode: string;
        meetingCode: string;
        passcode: string;
        password: string;
      }[];
    conferenceSolution: {
      key: {
        type: string;
      };
      name: string;
      iconUri: string;
    };
    conferenceId: string;
    signature: string;
    notes: string;
  };
  gadget?: {
    type: string;
    title: string;
    link: string;
    iconLink: string;
    width: number;
    height: number;
    display: string;
    preferences: {
      [k: string]: string;
    };
  };
  anyoneCanAddSelf?: boolean;
  guestsCanInviteOthers?: boolean;
  guestsCanModify?: boolean;
  guestsCanSeeOtherGuests?: boolean;
  privateCopy?: boolean;
  locked?: boolean;
  reminders: {
    useDefault: boolean;
    overrides?: 
      {
        method: string;
        minutes: number;
      }[];
  };
  source?: {
    url: string;
    title: string;
  };
  workingLocationProperties?: {
    type: string;
    homeOffice: unknown;
    customLocation: {
      label: string;
    };
    officeLocation: {
      buildingId: string;
      floorId: string;
      floorSectionId: string;
      deskId: string;
      label: string;
    };
  };
  outOfOfficeProperties?: {
    autoDeclineMode: string;
    declineMessage: string;
  };
  focusTimeProperties?: {
    autoDeclineMode: string;
    declineMessage: string;
    chatStatus: string;
  };
  attachments?: 
    {
      fileUrl: string;
      title: string;
      mimeType: string;
      iconLink: string;
      fileId: string;
    }[];
  eventType: "default" | "outOfOffice" | "focusTime" | "workingLocation";
};

export type NewCalendarEvent = Omit<SavedCalendarEvent, 'id'> & { id?: null };

export type CalendarEvent = SavedCalendarEvent | NewCalendarEvent; 