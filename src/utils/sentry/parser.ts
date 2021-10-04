type TUser = {
  username: string;
  id: string | number;
};

type TContexts = {
  name: string;
  version: string;
};

type TStacktrace = {
  frames: {
    filename: string;
    lineno: string;
    colno: string;
    pre_context: string[];
    context_line: string;
    post_context: string[];
  }[];
};

type TEvent = {
  platform: string;
  location: string;
  level: string;
  type: string;
  title: string;
  timestamp: number;
  release: string;
  user: TUser;
  message: string;
  stacktrace?: string;
  tags: string[];
  contexts: {
    [key: string]: TContexts;
  };
  extra: {
    [key: string]: string;
  };
  exception: {
    values: {
      stacktrace: TStacktrace[];
    };
  };
};

type TEvent2 = {
  event: TEvent;
  url: string;
};

export function getEvent(issue: TEvent2): TEvent {
  if (issue?.event) return issue?.event;

  return;
}

export function getPlatform(data: TEvent2): string {
  const { event = null } = data ?? {};

  return event?.platform;
}

export function getLanguage(data: TEvent2): string {
  const { event = null } = data ?? {};

  return event.location?.split('.')?.slice(-1)?.[0] || '';
}

export function getContexts(data: TEvent2): string[] {
  const { event = null } = data ?? {};

  const contexts = event?.contexts ?? {};

  const values = Object.values(contexts).map(
    (value: TContexts) => `${value?.name} ${value?.version}`,
  );

  return values ?? [];
}

export function getExtras(data: TEvent2): string[] {
  const { event = null } = data ?? {};

  const extras = event?.extra ?? {};
  const values = Object.entries(extras).map(
    ([key, value]) => `${key}: ${value}`,
  );

  return values ?? [];
}

export function getLink(data: TEvent2): string {
  return data?.url ?? 'https://sentry.io';
}

export function getTags(data: TEvent2): string[] {
  const { event = null } = data ?? {};

  return event?.tags ?? [];
}

export function getLevel(data: TEvent2): string {
  const { event = null } = data ?? {};

  return event?.level;
}

export function getType(data: TEvent2): string {
  const { event = null } = data ?? {};

  return event?.type;
}

export function getTitle(data: TEvent2): string {
  const { event = null } = data ?? {};

  return event?.title ?? 'Sentry Event';
}

export function getTime(data: TEvent2): Date {
  const { event = null } = data ?? {};

  return new Date(event.timestamp * 1000);
}

export function getRelease(data: TEvent2): string {
  const { event = null } = data ?? {};

  return event?.release;
}

export function getUser(data: TEvent2): TUser {
  const { event = null } = data ?? {};

  return event?.user;
}

export function getFileLocation(data: TEvent2): string {
  const { event = null } = data ?? {};

  return event?.location;
}

export function getStacktrace(data: TEvent2): TStacktrace {
  const { event = null } = data ?? {};

  return event?.stacktrace ?? event?.exception?.values[0]?.stacktrace;
}

export function getErrorLocation(data: TEvent2, maxLines = Infinity): string[] {
  const stacktrace = getStacktrace(data);
  const locations = stacktrace?.frames; /*.reverse();*/

  let files = locations?.map(
    location =>
      `${location?.filename}, ${location?.lineno ?? '?'}:${
        location?.colno ?? '?'
      }`,
  );

  if (maxLines < Infinity && files?.length > maxLines) {
    files = files.slice(0, maxLines);
    files.push('...');
  }

  return files;
}

export function getErrorCodeSnippet(issue) {
  const stacktrace = getStacktrace(issue);
  const location = stacktrace?.frames.reverse()[0];

  if (!location) {
    return null;
  }

  // The spaces below are intentional - they help align the code
  // aorund the additional `>` marker
  return ` ${location.pre_context?.join('\n ') ?? ''}\n>${
    location.context_line
  }\n${location.post_context?.join('\n') ?? ''}`;
}

export function getMessage(data: TEvent2): string {
  const { event = null } = data ?? {};
  return event?.message;
}
