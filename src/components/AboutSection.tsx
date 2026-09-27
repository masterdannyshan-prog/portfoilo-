import Image from "next/image";

export function AboutSection() {
  return (
    <section id="about" className="about-section" aria-labelledby="about-title">
      <p className="about-label">About Darshan</p>

      <div className="about-content">
        <figure className="about-portrait">
          <Image
            src="/images/profile/darshan-profile.png"
            alt="Darshan, UI/UX designer and product builder"
            fill
            sizes="(max-width: 760px) calc(100vw - 40px), 320px"
          />
        </figure>

        <div className="about-details">
          <h2 id="about-title">I design products and build them too.</h2>

          <div className="about-copy">
            <p className="about-lede">
              I&apos;m Darshan, a UI/UX designer in Chennai. I turn early ideas
              into clear, useful digital products.
            </p>
            <p>
              Over the last 11 months, I&apos;ve worked across product design,
              visual systems, and frontend execution. Projects such as SiteScope
              and Ghost Frame show how I move from Figma to a deployed product.
            </p>
          </div>

          <dl className="about-facts">
            <div>
              <dt>Based in</dt>
              <dd>Chennai, India</dd>
            </div>
            <div>
              <dt>Experience</dt>
              <dd>11 months</dd>
            </div>
            <div>
              <dt>Current focus</dt>
              <dd>Product design + build</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
