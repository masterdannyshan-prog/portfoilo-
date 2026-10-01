export type SiteScopeMedia = {
  label: string;
  caption?: string;
  src?: string;
  width?: number;
  height?: number;
};

export type SiteScopeSection = {
  title: string;
  paragraphs?: string[];
  points?: string[];
  flow?: string[];
  media?: SiteScopeMedia[];
  layout?: "compact" | "rows";
};

export const siteScopeCaseStudy = {
  sourceLabel: "SiteScope / UI/UX case study",
  title: "SiteScope - Full Case Study",
  sections: [
    {
      title: "Overview",
      paragraphs: [
        "SiteScope is a free website audit tool. Paste a URL and it brings design issues, performance, accessibility, SEO, and code-quality findings into one report. No account or setup is needed to begin.",
        "I started with a familiar problem: checking one website meant moving between several specialist tools and translating their results into a useful next step. SiteScope brings those signals together and makes the report easier to scan and act on.",
      ],
    },
    {
      title: "My Role",
      layout: "compact",
      paragraphs: ["UI/UX Designer and AI-assisted Builder"],
    },
    {
      title: "Timeline",
      layout: "compact",
      paragraphs: ["3 days"],
    },
    {
      title: "The Problem",
      paragraphs: [
        "Website quality checks are fragmented. Performance, accessibility, SEO, code quality, and design feedback often live in separate tools. A freelancer, founder, or small team can spend more time gathering and interpreting results than deciding what to improve.",
        "The design challenge was to make a broad audit feel approachable: one entry point, a clear overview, and useful detail only when someone needs it.",
      ],
      media: [{
        label: "Diagram showing one website audit split across performance, accessibility, SEO, broken-link, and manual design-review tools",
        src: "/images/sitescope/problem-workflow.png",
        width: 1375,
        height: 768,
      }],
    },
    {
      title: "Research Direction",
      paragraphs: [
        "I drew on my own experience reviewing websites and used ChatGPT and Claude to support market and UX desk research. I considered the needs of freelancers presenting work to clients, founders checking a site they manage, and developers doing a quick pre-launch review. These were working assumptions, not findings from user interviews.",
        "The common need was a fast way to understand the overall picture, identify what matters, and know what to do next.",
      ],
    },
    {
      title: "Competitor Research",
      paragraphs: [
        "I compared PageSpeed Insights and Lighthouse for technical depth, WAVE for accessibility, and Semrush Site Audit for breadth. Each is useful in its own context, but switching between specialist views adds effort for someone who wants one understandable report. That gap shaped SiteScope's overview-first approach.",
      ],
    },
    {
      title: "Design System",
      paragraphs: [
        "I defined a small visual system in Figma before designing the screens. It gives the landing page and report a consistent language without making the report feel heavy.",
      ],
      points: [
        "Colors: #4A5CF0 is the accent, #0A0A0B is black, #52525B is gray, and #FAFAFA is the background. Severity colors communicate priority separately from the brand accent.",
        "Typography: Geist is the heading font, and Inter is the supporting body-text font. The goal was clear hierarchy and comfortable reading across a long report.",
        "Spacing: a shared 4, 8, 12, 16, 24, 32, 48, 64, and 100 pixel scale keeps sections and components aligned.",
        "Report components: URL input, mode selector, tabs, overview tiles, severity badges, and expandable finding cards use repeatable states and spacing.",
      ],
      media: [{
        label: "SiteScope design system showing the four color values and Geist and Inter typography",
        src: "/images/sitescope/design-system.png",
        width: 1909,
        height: 1765,
      }],
      layout: "rows",
    },
    {
      title: "Design Process",
      paragraphs: [
        "I designed the landing page first so a visitor could understand the tool and start an audit quickly. The prominent URL input makes the primary action clear; the audit mode selector lets people choose the kind of report they need.",
        "The report was the more complex design problem. I used an overview-first tab order to establish the big picture before the detailed categories. Finding cards keep their title and severity visible, then reveal the explanation and suggested fix on demand.",
      ],
      media: [{
        label: "Figma design process showing the SiteScope landing page, loading screen, and audit report",
        src: "/images/sitescope/design-process.png",
        width: 1920,
        height: 1020,
      }],
    },
    {
      title: "The Process",
      flow: [
        "Idea",
        "AI-assisted research",
        "Design system",
        "Figma design",
        "Build with Claude Code",
        "GitHub",
        "Vercel and Render",
      ],
      paragraphs: [
        "I made the product and design decisions, created the design system and Figma screens, and directed revisions. Claude Code translated the designs into most of the frontend and backend, then helped connect the pieces and deploy them.",
      ],
    },
    {
      title: "Implementation with Claude Code",
      paragraphs: [
        "At a high level, the frontend accepts a URL, shows audit progress, and presents the report. The backend visits the site, runs the audit checks, assembles the findings, and returns the results for the interface to display.",
        "I focused my feedback on the product behavior and clarity of the experience: what the visitor sees first, how report categories are organized, and whether a finding explains both the issue and a useful next step. Claude Code handled most of the frontend and backend implementation with my direction and revisions.",
      ],
    },
    {
      title: "UX Principles",
      points: [
        "Progressive disclosure: show the overview first, then let people explore a category or finding in more detail.",
        "Plain language: explain findings in terms someone outside the implementation team can understand.",
        "Actionable feedback: pair an issue with a suggested fix rather than a score alone.",
        "Visual priority: use severity consistently so the most important issues stand out.",
        "Low-friction entry: make the URL input the obvious first action, without account setup.",
      ],
      layout: "rows",
    },
    {
      title: "UX Decisions Made",
      paragraphs: [
        "Landing page: the URL input is the primary visual element. The audit mode selector gives different visitors a useful starting point without forcing them through setup.",
        "Report navigation: the Overview tab comes first to provide orientation before the detailed categories.",
        "Finding cards: the collapsed view shows a title and severity. Expanding it reveals the explanation and suggested fix, keeping long reports easier to scan.",
      ],
      media: [
        {
          label: "SiteScope landing page with notes identifying the main URL input and audit start action",
          src: "/images/sitescope/ux-landing-page.png",
          width: 1306,
          height: 816,
        },
        {
          label: "SiteScope landing page with notes explaining the available audit modes",
          src: "/images/sitescope/ux-audit-modes.png",
          width: 1514,
          height: 704,
        },
        {
          label: "SiteScope report screen with notes about overview-first navigation and audit findings",
          src: "/images/sitescope/ux-report-overview.png",
          width: 1061,
          height: 1008,
        },
      ],
    },
    {
      title: "Final Designs",
      paragraphs: [
        "The finished landing page invites a quick audit, while the report organizes findings into an overview and focused detail views.",
      ],
      media: [{
        label: "Final SiteScope landing page design",
        src: "/images/sitescope/final-design.png",
        width: 1440,
        height: 912,
      }],
    },
    {
      title: "Tools Used",
      points: [
        "Figma: I created the visual design and design system.",
        "ChatGPT and Claude: supported market and UX desk research and helped me explore ideas; this was not user interviewing.",
        "Claude Code: implemented the frontend and backend with my direction and revisions.",
        "GitHub: repository and deployment connection.",
        "Vercel: frontend hosting.",
        "Render: backend hosting.",
      ],
      paragraphs: [
        "What powers SiteScope: the product uses Next.js, FastAPI, Playwright, Lighthouse, axe-core, and Supabase. These are technologies used by the product, not a list of systems I personally coded.",
      ],
      layout: "rows",
    },
    {
      title: "Outcomes",
      paragraphs: [
        "SiteScope is live as a working product. It lets someone start with a URL and move from a broad overview to individual findings in one interface. The project gave me a way to bring a design concept through implementation and deployment with AI-assisted development.",
      ],
    },
    {
      title: "Limitations and Next Steps",
      paragraphs: [
        "SiteScope currently uses Render's free tier. Audits of some resource-heavy sites may take longer or fail because of hosting limits. More hosting capacity and further optimization may improve reliability, but a paid plan alone would not guarantee that every site can be audited successfully.",
        "A shareable report and earlier feedback from real users are valuable next steps. I would validate which parts of the report are most useful before expanding the feature set.",
      ],
    },
    {
      title: "Reflection",
      paragraphs: [
        "The central design challenge was making complex information feel simple. An overview, clear severity, and expandable explanations helped shape a report that can be scanned before it is studied in depth.",
        "This project also clarified my role: I can lead the product thinking and visual system, then use Claude Code to help turn those decisions into a working product without presenting myself as a frontend or backend engineer.",
      ],
    },
  ] satisfies SiteScopeSection[],
};
