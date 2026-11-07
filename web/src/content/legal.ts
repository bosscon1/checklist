export const LEGAL_EFFECTIVE = "November 7, 2026";

export const LEGAL_DRAFT_NOTE =
  "These are drafts for legal review. They describe the Checklist in this source repository as of November 7, 2026: the shared list opened with an owner key, and the optional bot API. They are not legal advice, a certification, or a description of any other product that uses the name Checklist.";

type Paragraph = { type: "p"; text: string };
type BulletList = { type: "ul"; items: string[] };
export type LegalBlock = Paragraph | BulletList;

export type LegalSection = {
  id: string;
  heading: string;
  blocks: LegalBlock[];
};

export type LegalDocument = {
  kind: "privacy" | "terms";
  title: string;
  description: string;
  effective: string;
  draftNote: string;
  sections: LegalSection[];
};

const privacy: LegalDocument = {
  kind: "privacy",
  title: "Privacy Policy",
  description: "Draft privacy policy for the owner-key Checklist in this repository.",
  effective: LEGAL_EFFECTIVE,
  draftNote: LEGAL_DRAFT_NOTE,
  sections: [
    {
      id: "scope",
      heading: "What this page covers",
      blocks: [
        {
          type: "p",
          text: "Checklist in this repository is one shared list. A person opens it by typing an owner key. There is no sign-up form, no profile, and no separate account for each person. A bot can also read and change the list when the operator has given that bot its own token.",
        },
        {
          type: "p",
          text: "This page covers the checklist screens, the checklist API, and the bot tools shipped in this repository. It also covers the SiteGround package in this repository, which stores the same kind of list in MySQL. The operator's legal name, mailing address, and privacy contact are not in this repository, so this draft does not invent them.",
        },
      ],
    },
    {
      id: "information",
      heading: "Information the checklist stores",
      blocks: [
        {
          type: "p",
          text: "Each item can include the words on the line (up to 280 characters), a status of open, done, or dismissed, whether the item was added by a person or by the bot, who last changed the status, a bot key when a bot created the item (up to 80 characters, with no spaces), an id, and the time it was created and last updated.",
        },
        {
          type: "p",
          text: "The owner key is saved in the browser under the localStorage name checklist-owner-key. The page sends that key on each request as a bearer token. Choosing Lock, or sending a key the server rejects, removes it from that browser. The server compares the key with the owner secret configured for that deployment. The secret is an environment or config value. It is not a row in the checklist table.",
        },
        {
          type: "p",
          text: "The checklist screens do not ask for a name, email address, phone number, or date of birth.",
        },
      ],
    },
    {
      id: "bot",
      heading: "The bot",
      blocks: [
        {
          type: "p",
          text: "If the operator sets a bot token, a program with that token can read every item, add items, change the wording of an open item, and mark an open item done. The bot API leaves a dismissed item dismissed. The bot tools in this repository can also keep a memory of bot keys, and a short snapshot of those items, in the bot host's key-value store under the name checklist:added.",
        },
        {
          type: "p",
          text: "The checklist server does not, by itself, call out to an AI vendor. The bot reaches in with the token. What the bot host keeps, and which company runs that bot, depends on how the operator installs it. This repository does not record that choice for a live deployment.",
        },
      ],
    },
    {
      id: "storage",
      heading: "Where items are stored",
      blocks: [
        {
          type: "p",
          text: "In the Node application, items go to Postgres when DATABASE_URL is set. Comments in the code mention Neon as one kind of Postgres host. This repository does not show the host, region, or vendor used by any live deployment. When DATABASE_URL is unset, the Node application stores items in an embedded database on the machine that is running the app.",
        },
        {
          type: "p",
          text: "The SiteGround package stores items in MySQL. The host, port, database name, and passwords come from a config file on that server. The sample config uses localhost. The sample describes the sample file, and it does not identify a live server.",
        },
        {
          type: "p",
          text: "This repository does not show which of those copies, if either, is the one a particular person is using.",
        },
      ],
    },
    {
      id: "retention",
      heading: "How long items stay",
      blocks: [
        {
          type: "p",
          text: "Nothing in this code deletes items on a timer. Marking an item dismissed keeps the row. Restore brings it back. There is no control on the page that erases the list, the server-side owner secret, or the database. How long a host keeps backups, logs, or copies is not written down in this repository.",
        },
      ],
    },
    {
      id: "cookies",
      heading: "Cookies, fonts, and connection records",
      blocks: [
        {
          type: "p",
          text: "The checklist screens do not set their own cookie, and they do not load an analytics or advertising script. They do load font files from fonts.googleapis.com and fonts.gstatic.com, so the browser contacts Google for those files. A service worker is registered for /checklist/. It does not keep a copy of the list. API requests stay on the network.",
        },
        {
          type: "p",
          text: "A hosting company, database host, font host, or network in front of the site can still record that a browser connected, which can include an IP address and a user agent. This draft does not claim those records are absent, and it does not say where they are kept or how long they last. A review of this source code cannot answer that.",
        },
      ],
    },
    {
      id: "sharing",
      heading: "Who can receive the list",
      blocks: [
        {
          type: "p",
          text: "Anyone with the owner key can read and change the whole list. Anyone with the bot token can use the bot API. The database and the server that run the list receive the item text because that is how the list is saved. A connected bot receives item text when it calls the API.",
        },
        {
          type: "p",
          text: "The checklist code has no feature for selling item text and no feature for sending it to an advertising network. That is a statement about this source code. It is not a finding about every host, database vendor, font host, or bot the operator might connect, and it is not a promise that those parties refrain from using connection data for their own purposes.",
        },
      ],
    },
    {
      id: "security",
      heading: "Security",
      blocks: [
        {
          type: "p",
          text: "The server checks the owner key and the bot token by comparing hashes in a timing-safe way. The owner key sits in localStorage, so script that runs on this site's origin can read it. This repository does not describe encryption at rest, a security certification, or a guarantee against loss, interception, or access by someone who has the key, the token, the database, or the server.",
        },
      ],
    },
    {
      id: "choices",
      heading: "Your choices and how to ask",
      blocks: [
        {
          type: "p",
          text: "With the owner key, you can add items and change their status, including dismiss and restore. The page does not offer a file download of the list, and it does not offer a way to erase the stored rows. Lock removes the key from that browser only.",
        },
        {
          type: "p",
          text: "This repository does not publish a privacy email, phone number, or mailing address for the checklist operator. An email address and a street address for Pfeifer Building Company appear in older website files that stayed in the repository after the checklist was split out of that site. This draft does not treat that company, or that address, as the checklist operator or the checklist contact. A request to see, correct, or delete stored items has to go to the person who runs the copy you use, through a contact they have already given you.",
        },
        {
          type: "p",
          text: "If a privacy law gives you a right to access, correct, or delete information, this app does not include a tool that performs that request. Whether a particular law applies depends on who operates the deployment and where the people and the servers are. Those facts are not in this repository.",
        },
      ],
    },
    {
      id: "children",
      heading: "Children",
      blocks: [
        {
          type: "p",
          text: "The checklist does not ask for age and does not check age. It is written as a personal list for whoever holds the owner key. It is not presented as a product for children.",
        },
      ],
    },
    {
      id: "changes",
      heading: "Changes to this draft",
      blocks: [
        {
          type: "p",
          text: "The effective date on this page is November 7, 2026. If the words change, the date on the page should change with them. The code does not send an email or other notice when the page changes.",
        },
      ],
    },
  ],
};

const terms: LegalDocument = {
  kind: "terms",
  title: "Terms of Service",
  description: "Draft terms of service for the owner-key Checklist in this repository.",
  effective: LEGAL_EFFECTIVE,
  draftNote: LEGAL_DRAFT_NOTE,
  sections: [
    {
      id: "agreement",
      heading: "These drafts",
      blocks: [
        {
          type: "p",
          text: "These terms are drafts for a lawyer to review. They are not a finished contract. They do not name a company, because this repository does not name the operator of Checklist. If you use a copy of the list, you are dealing with the person who runs that copy. A separate written agreement with that person controls where it says something different from this page.",
        },
      ],
    },
    {
      id: "service",
      heading: "The service",
      blocks: [
        {
          type: "p",
          text: "Checklist is one shared list of short text items. You open it with an owner key. There is no sign-up form on this list. A bot can add items, reword open items, and mark open items done when it has the bot token. Dismissed items stay dismissed against the bot.",
        },
      ],
    },
    {
      id: "use",
      heading: "Acceptable use",
      blocks: [
        {
          type: "p",
          text: "Use the list only with an owner key or bot token the operator gave you. Do not try to obtain, guess, or reuse a key or token that was not given to you. Do not use the list to break the law, to attack or overload the service, or to store material you have no right to store. Item text has to fit in 280 characters. The service rejects text that does not meet the rules in the code.",
        },
      ],
    },
    {
      id: "content",
      heading: "Your text",
      blocks: [
        {
          type: "p",
          text: "The words on the list come from the person using the owner key and from a connected bot. You are responsible for the words you add. This repository does not take ownership of those words. It also does not promise that the words stay hidden from anyone who has the owner key, the bot token, or access to the server or the database.",
        },
      ],
    },
    {
      id: "availability",
      heading: "Availability",
      blocks: [
        {
          type: "p",
          text: "The list is available when the server and the database are available. This repository does not promise uptime, backups, support, or that an item will be kept. Items can be lost if the database is lost. Dismissing an item leaves it stored. There is no coded export and no coded way to erase the database.",
        },
      ],
    },
    {
      id: "disclaimers",
      heading: "Disclaimers",
      blocks: [
        {
          type: "p",
          text: "Checklist is a list of text. It is not legal, medical, financial, or other professional advice. It is provided as the software runs. To the extent the law allows a disclaimer, there is no warranty of accuracy, security, uninterrupted access, or fitness for a particular purpose.",
        },
      ],
    },
    {
      id: "liability",
      heading: "Liability",
      blocks: [
        {
          type: "p",
          text: "To the extent the law allows, the people who publish or run a copy of this checklist are not liable for lost items, a lost or stolen key, unauthorized access, or other harm from using the list. Some laws do not allow certain limits or exclusions. Where a law does not allow a limit, the limit does not apply, and this page does not waive a right that cannot be waived.",
        },
        {
          type: "p",
          text: "These drafts do not choose a country, a state, a court, or an arbitration program. That choice is not in this repository.",
        },
      ],
    },
    {
      id: "changes",
      heading: "Changes",
      blocks: [
        {
          type: "p",
          text: "The effective date on this page is November 7, 2026. Read the page that is published on the copy you use. The code does not require an email notice before the words on this page change. If the words change, the date on the page should change with them.",
        },
      ],
    },
  ],
};

export const legalDocuments = {
  privacy,
  terms,
} as const;

export function legalPlainText(doc: LegalDocument): string {
  const parts = [
    doc.title,
    `Effective ${doc.effective}`,
    doc.draftNote,
    ...doc.sections.flatMap((section) => [
      section.heading,
      ...section.blocks.flatMap((block) => (block.type === "p" ? [block.text] : block.items)),
    ]),
  ];
  return parts.join("\n\n");
}
