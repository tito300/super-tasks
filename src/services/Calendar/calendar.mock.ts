import { DeepPartial } from "react-hook-form";
import { deepmerge } from "@mui/utils";
import { CalendarEvent, NewCalendarEvent } from "@src/calendar.types";

const eventMock: NewCalendarEvent = {
  kind: "calendar#event",
  etag: "mockEtag",
  id: null,
  status: "mockStatus",
  htmlLink: "mockHtmlLink",
  created: "mockCreated",
  updated: "mockUpdated",
  summary: "mockSummary",
  description: "mockDescription",
  location: "mockLocation",
  colorId: "mockColorId",
  creator: {
    id: "mockCreatorId",
    email: "mockCreatorEmail",
    displayName: "mockCreatorDisplayName",
    self: true,
  },
  organizer: {
    id: "mockOrganizerId",
    email: "mockOrganizerEmail",
    displayName: "mockOrganizerDisplayName",
    self: true,
  },
  start: {
    date: "mockStartDate",
    dateTime: "mockStartDateTime",
    timeZone: "mockTimeZone",
  },
  end: {
    date: "mockEndDate",
    dateTime: "mockEndDateTime",
    timeZone: "mockTimeZone",
  },
  endTimeUnspecified: true,
  recurrence: ["mockRecurrence"],
  recurringEventId: "mockRecurringEventId",
  originalStartTime: {
    date: "mockOriginalStartDate",
    dateTime: "mockOriginalStartDateTime",
    timeZone: "mockTimeZone",
  },
  transparency: "mockTransparency",
  visibility: "mockVisibility",
  iCalUID: "mockICalUID",
  sequence: 1,
  attendees: [
    {
      id: "mockAttendeeId",
      email: "mockAttendeeEmail",
      displayName: "mockAttendeeDisplayName",
      organizer: true,
      self: true,
      resource: true,
      optional: true,
      responseStatus: "mockResponseStatus",
      comment: "mockComment",
      additionalGuests: 1,
    },
  ],
  attendeesOmitted: true,
  extendedProperties: {
    private: {
      mockPrivateProperty: "mockPrivateValue",
    },
    shared: {
      mockSharedProperty: "mockSharedValue",
    },
  },
  hangoutLink: "mockHangoutLink",
  conferenceData: {
    createRequest: {
      requestId: "mockRequestId",
      conferenceSolutionKey: {
        type: "mockConferenceSolutionType",
      },
      status: {
        statusCode: "mockStatusCode",
      },
    },
    entryPoints: [
      {
        entryPointType: "mockEntryPointType",
        uri: "mockEntryPointUri",
        label: "mockEntryPointLabel",
        pin: "mockEntryPointPin",
        accessCode: "mockEntryPointAccessCode",
        meetingCode: "mockEntryPointMeetingCode",
        passcode: "mockEntryPointPasscode",
        password: "mockEntryPointPassword",
      },
    ],
    conferenceSolution: {
      key: {
        type: "mockConferenceSolutionType",
      },
      name: "mockConferenceSolutionName",
      iconUri: "mockConferenceSolutionIconUri",
    },
    conferenceId: "mockConferenceId",
    signature: "mockSignature",
    notes: "mockNotes",
  },
  gadget: {
    type: "mockGadgetType",
    title: "mockGadgetTitle",
    link: "mockGadgetLink",
    iconLink: "mockGadgetIconLink",
    width: 100,
    height: 100,
    display: "mockGadgetDisplay",
    preferences: {
      mockGadgetPreference: "mockGadgetPreferenceValue",
    },
  },
  anyoneCanAddSelf: true,
  guestsCanInviteOthers: true,
  guestsCanModify: true,
  guestsCanSeeOtherGuests: true,
  privateCopy: true,
  locked: true,
  reminders: {
    useDefault: true,
    overrides: [
      {
        method: "mockReminderMethod",
        minutes: 10,
      },
    ],
  },
  source: {
    url: "mockSourceUrl",
    title: "mockSourceTitle",
  },
  workingLocationProperties: {
    type: "mockWorkingLocationType",
    homeOffice: "mockHomeOffice",
    customLocation: {
      label: "mockCustomLocationLabel",
    },
    officeLocation: {
      buildingId: "mockBuildingId",
      floorId: "mockFloorId",
      floorSectionId: "mockFloorSectionId",
      deskId: "mockDeskId",
      label: "mockOfficeLocationLabel",
    },
  },
  outOfOfficeProperties: {
    autoDeclineMode: "mockAutoDeclineMode",
    declineMessage: "mockDeclineMessage",
  },
  focusTimeProperties: {
    autoDeclineMode: "mockAutoDeclineMode",
    declineMessage: "mockDeclineMessage",
    chatStatus: "mockChatStatus",
  },
  attachments: [
    {
      fileUrl: "mockFileUrl",
      title: "mockAttachmentTitle",
      mimeType: "mockAttachmentMimeType",
      iconLink: "mockAttachmentIconLink",
      fileId: "mockAttachmentFileId",
    },
  ],
  eventType: "default",
};


export function createMockCalendarEvent(
  data?: DeepPartial<CalendarEvent>
): CalendarEvent {
  return deepmerge(eventMock, { ...data });
}
