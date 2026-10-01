import Image from "next/image";

export function CursorFillLabel({
  children,
  showArrow = true,
}: {
  children: string;
  showArrow?: boolean;
}) {
  return (
    <div className="project-action-row">
      <span className="project-action" aria-hidden="true">
        <span className="project-action-content">
          {children}
          {showArrow ? (
            <Image
              src="/images/icons/arrow-up-right.svg"
              className="project-action-icon"
              width={17}
              height={17}
              alt=""
              aria-hidden="true"
            />
          ) : null}
        </span>
      </span>
    </div>
  );
}
