import { site } from '../config/site';

/*
  Plain language legal pages describing how this website actually works.
  Review them (ideally with a legal adviser) before launch and update the date when they change.
*/

const Mail = () => (
  <a className="font-semibold text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-ink" href={`mailto:${site.email}`}>
    {site.email}
  </a>
);

export const pages = {
  privacy: {
    title: 'Privacy policy',
    updated: 'November 2026',
    sections: [
      {
        h: 'Who we are',
        body: (
          <p>
            This website is run by KV DEV STUDIO, a creative digital studio. If you have any question about your
            information, email <Mail /> or call <span className="whitespace-nowrap">{site.phoneDisplay}</span>.
          </p>
        ),
      },
      {
        h: 'Information you share with us',
        body: (
          <p>
            When you use the contact form, you can give us your name, email address, phone number, the service you are
            interested in and a message. When you message us on WhatsApp or by email, we receive whatever you choose to send.
          </p>
        ),
      },
      {
        h: 'How the contact form works',
        body: (
          <p>
            The form does not store your details on this website. When you press send, WhatsApp opens with your message
            filled in, addressed to our business number. Your message only reaches us when you send it from WhatsApp.
          </p>
        ),
      },
      {
        h: 'How we use your information',
        body: (
          <p>
            We use the details you send only to reply to your enquiry, prepare a quote and work with you on your project. We
            do not sell your information or share it with anyone for marketing.
          </p>
        ),
      },
      {
        h: 'Cookies and tracking',
        body: (
          <p>
            This website does not use cookies, analytics or advertising trackers. Fonts are served from this website, not
            from a third party.
          </p>
        ),
      },
      {
        h: 'Third party services',
        body: (
          <p>
            If you contact us through WhatsApp or your email provider, their own privacy policies apply to how they handle
            your messages.
          </p>
        ),
      },
      {
        h: 'Your choices',
        body: (
          <p>
            You can ask us to show, correct or delete the information you sent us at any time by emailing <Mail />.
          </p>
        ),
      },
    ],
  },
  terms: {
    title: 'Terms of use',
    updated: 'November 2026',
    sections: [
      {
        h: 'Using this website',
        body: <p>By using this website you agree to these terms. If you do not agree, please do not use the website.</p>,
      },
      {
        h: 'Content and ownership',
        body: (
          <p>
            The text, designs, illustrations and logo on this website belong to KV DEV STUDIO unless stated otherwise. Please
            do not copy or reuse them without written permission.
          </p>
        ),
      },
      {
        h: 'Concept projects',
        body: (
          <p>
            Portfolio items marked &ldquo;Concept&rdquo; are demonstration designs made by the studio. They are not client
            projects, and the brand names shown in them are fictional.
          </p>
        ),
      },
      {
        h: 'Project agreements',
        body: (
          <p>
            Information on this website is a general description of our services, not an offer. The scope, price and
            timeline of any project are agreed with you separately before work begins.
          </p>
        ),
      },
      {
        h: 'Links to other services',
        body: (
          <p>
            This website links to services such as WhatsApp and your email app. We are not responsible for how those services
            work or for their content.
          </p>
        ),
      },
      {
        h: 'Changes and contact',
        body: (
          <p>
            We may update these terms from time to time. The date at the top shows the latest version. For any question,
            email <Mail />.
          </p>
        ),
      },
    ],
  },
};
