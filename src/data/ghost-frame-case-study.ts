export type GhostFrameMedia = {
  assetKey: string;
  label: string;
  caption: string;
  src?: string;
  width?: number;
  height?: number;
};

export type GhostFrameDecision = {
  heading: string;
  explanation: string;
  media: GhostFrameMedia;
};

export type GhostFrameSection = {
  title: string;
  paragraphs?: string[];
  flow?: string[];
  media?: GhostFrameMedia[];
  decisions?: GhostFrameDecision[];
  note?: string;
  layout?: "compact";
};

export const ghostFrameCaseStudy = {
  sourceLabel: "Ghost Frame / UI/UX case study",
  title: "Ghost Frame",
  description:
    "A browser-based creative image-effects studio where you can upload a photo, explore effects, adjust the result, and export it.",
  heroVideo: {
    assetKey: "ghost-frame-hero-video",
    label: "Hero product video",
    caption: "A short walkthrough of the finished Ghost Frame experience.",
    src: "/videos/ghost-frame-hero.mp4",
  },
  sections: [
    {
      title: "Overview",
      paragraphs: [
        "Ghost Frame is a creative image-effects studio that runs in the browser. Someone can upload a JPG, PNG, or WebP image, browse 39 effects across six categories, adjust the result, and export a PNG.",
        "The editor and export are available without an account. Signing in is needed when someone wants to save work to Projects.",
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
        "Some creative tools take time to learn, while simple filters offer little control. I wanted a middle ground: distinctive results with an editing experience that stays focused on the image.",
        "The design challenge was to help someone understand the possibilities quickly, try an effect without setup, and keep enough control to make the result feel intentional.",
      ],
      media: [
        {
          assetKey: "ghost-frame-problem",
          label: "Problem image",
          caption: "The design motivation: creative control without a steep learning curve.",
          src: "/images/ghost-frame/problem.png",
          width: 1376,
          height: 768,
        },
      ],
    },
    {
      title: "Research and Product Direction",
      paragraphs: [
        "My exploration centered on what a first-time visitor needs to see: examples of the effects, a clear way into the editor, and room to experiment before making an account. The landing page shows the results visually; the editor keeps creation focused on one image and its controls.",
      ],
    },
    {
      title: "Design System",
      paragraphs: [
        "I used Syne for the product typography and kept the interface predominantly black (#000000) and white (#FFFFFF). Orange (#FFB42B) highlights selected effects and active controls, while secondary text, restrained surfaces, and fine borders support the layout without competing with the work.",
        "This keeps the uploaded image and its effects as the strongest visual focus. The system stays consistent across the landing page, gallery, and editor.",
      ],
      media: [
        {
          assetKey: "ghost-frame-design-system",
          label: "Design system graphic",
          caption: "Syne typography, monochrome UI, and image-led color.",
          src: "/images/ghost-frame/design-system.png",
          width: 1909,
          height: 1765,
        },
      ],
    },
    {
      title: "Design Process",
      flow: [
        "Idea",
        "Research and exploration",
        "Design system",
        "Figma design",
        "Build and iterate with Claude Code",
        "Deploy",
      ],
      paragraphs: [
        "I established the main layouts, cards, and image placement in Figma. As Claude Code helped build the site, I reviewed the working experience and directed changes to interactions and animation until they supported the design.",
      ],
      media: [
        {
          assetKey: "ghost-frame-figma-design",
          label: "Figma design screenshot",
          caption: "Core layouts and image placement from the Figma file.",
          src: "/images/ghost-frame/figma-design.png",
          width: 1920,
          height: 1080,
        },
      ],
    },
    {
      title: "UX Decisions Made",
      decisions: [
        {
          heading: "01 / Show the creative result early",
          explanation:
            "I used the landing-page hero video, effect imagery, and before-and-after comparison to show the kind of work Ghost Frame can make. Seeing the result first helps someone decide whether to open the editor and try it with a photo.",
          media: {
            assetKey: "ghost-frame-ux-result-early",
            label: "Annotated landing-page screenshot",
            caption: "Hero imagery and before-and-after interaction show the result early.",
            src: "/images/ghost-frame/ux-result-early-v2.png",
            width: 1278,
            height: 816,
          },
        },
        {
          heading: "02 / Keep the image central",
          explanation:
            "I gave the canvas the main space and grouped source, effects, adjustments, presets, and export in the sidebar. The visible Try a Sample Image action lets someone explore the editor before choosing a photo of their own.",
          media: {
            assetKey: "ghost-frame-ux-image-central",
            label: "Annotated editor-layout screenshot",
            caption: "The canvas remains central while the controls stay together.",
            src: "/images/ghost-frame/ux-image-central-v2.png",
            width: 1306,
            height: 816,
          },
        },
        {
          heading: "03 / Make effects easier to navigate",
          explanation:
            "I grouped the effects into searchable, collapsible categories, with Basic open first. Intensity and an effect-specific control provide a predictable way to adjust a result, while presets offer quick starting points. This structure is meant to make a large catalogue feel easier to explore.",
          media: {
            assetKey: "ghost-frame-ux-effect-navigation",
            label: "Annotated effects-sidebar screenshot",
            caption: "Categories, search, adjustments, and presets in the editor sidebar.",
            src: "/images/ghost-frame/ux-effect-navigation-v2.png",
            width: 1306,
            height: 816,
          },
        },
      ],
      note:
        "Account choice: editing and PNG export work without signing in. Saving a result to Projects asks the person to sign in when that benefit becomes relevant.",
    },
    {
      title: "Motion and Interaction",
      paragraphs: [
        "The hero video introduces the visual possibilities; effect-card reveals invite exploration; the before-and-after control makes a change easy to understand. In the editor, visible feedback helps someone stay oriented while adjusting an image. I refined motion ideas with Claude Code during implementation by reviewing the working interactions.",
      ],
    },
    {
      title: "The Architecture Change",
      paragraphs: [
        "The first approach proposed processing images through a Python/FastAPI server. For an exploratory editor, each adjustment would have needed a server round trip. I changed direction so the main effects use browser-based Canvas processing and respond as someone works.",
        "There are deliberate exceptions: background removal uses an external service through an Edge Function, and Supabase supports accounts and saved projects. The aim was responsive editing, not a claim that the entire product has no backend.",
      ],
    },
    {
      title: "Final Designs",
      paragraphs: [
        "This finished landing-page screenshot shows how Ghost Frame introduces its image effects and invites visitors into the editor.",
      ],
      media: [
        {
          assetKey: "ghost-frame-final-landing",
          label: "Final landing-page screenshot",
          caption: "Landing page: introduce the tool through finished image work.",
          src: "/images/ghost-frame/final-landing.png",
          width: 1440,
          height: 921,
        },
      ],
    },
    {
      title: "Tools and Implementation",
      paragraphs: [
        "I used Figma for the layouts and visual direction. Claude Code helped implement and refine the site, with GitHub for the repository and Vercel for hosting.",
        "The product uses browser Canvas processing for the main effects and Supabase for accounts and saved projects. My role was to direct the design and review the implementation, not to write every effect algorithm or backend system myself.",
      ],
    },
    {
      title: "Outcome",
      paragraphs: [
        "Ghost Frame is live. A visitor can explore the effects, try the editor with a sample or their own image, adjust the result, and download a PNG. An account becomes useful when they want to save work to Projects.",
      ],
    },
    {
      title: "Limitations and Next Steps",
      paragraphs: [
        "The mobile editor works, but its layout could be stronger. There is no undo history, so exploring several changes can be harder than it should be. The discovery and social ideas in the early draft also need more work before I would present them as a central part of the product.",
      ],
    },
    {
      title: "Reflection",
      paragraphs: [
        "This project taught me to keep the image and the result at the center of the experience. It also made the design process more iterative: I could review a working interaction with Claude Code, see where it felt unclear, and redirect it while the product took shape.",
      ],
    },
  ] satisfies GhostFrameSection[],
};
