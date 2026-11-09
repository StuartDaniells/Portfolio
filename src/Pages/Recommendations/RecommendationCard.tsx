import { useState } from "react";
import { FaQuoteLeft } from "react-icons/fa";
import { FiChevronDown, FiExternalLink } from "react-icons/fi";
import {
  LINKEDIN_RECOMMENDATIONS_URL,
  type Recommendation,
} from "../../content/recommendations";

interface RecommendationCardProps {
  recommendation: Recommendation;
  local: string | null;
}

/**
 * A single written recommendation.
 *
 * Collapsed state shows the featured excerpt; the button reveals the complete
 * text. Both blocks share one grid cell that morphs between `0fr` and `1fr`,
 * so the card grows smoothly without fixed heights or measured content.
 * Whichever block is hidden is also `aria-hidden`, so the quotation is never
 * announced or found twice.
 */
const RecommendationCard = ({ recommendation, local }: RecommendationCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const bodyId = `recommendation-${recommendation.id}-full`;
  const toggleLabel = expanded ? "Show less" : "Read more";

  return (
    <article
      style={{
        background: local === "dark" ? "transparent" : recommendation.bg,
      }}
      className="flex h-full flex-col rounded-lg p-5 transition-colors duration-300 ease-in-out motion-reduce:transition-none sm:p-6 lg:min-h-[26rem] dark:border-2 dark:border-[#212425]"
    >
      <FaQuoteLeft
        aria-hidden="true"
        className="shrink-0 text-2xl text-[#FA5252]"
      />

      <blockquote className="mt-4 text-[15px] leading-7 text-gray-lite dark:text-[#A6A6A6]">
        <div
          aria-hidden={expanded}
          className="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none"
          style={{ gridTemplateRows: expanded ? "0fr" : "1fr" }}
        >
          <div className="overflow-hidden">
            <p className="text-pretty">{recommendation.excerpt}</p>
          </div>
        </div>

        <div
          id={bodyId}
          aria-hidden={!expanded}
          className="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none"
          style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
        >
          <div className="overflow-hidden">
            {recommendation.body.map((paragraph, index) => (
              <p
                key={paragraph}
                className={`text-pretty ${index > 0 ? "mt-4" : ""}`}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </blockquote>

      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={bodyId}
        aria-label={`${toggleLabel}: ${recommendation.name}'s recommendation`}
        onClick={() => setExpanded((previous) => !previous)}
        className="mt-3 inline-flex w-fit items-center gap-1.5 self-start rounded-sm text-tiny font-medium text-[#FA5252] transition-colors duration-300 ease-in-out hover:text-[#DD2476] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FA5252] focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:hover:text-[#DD2476] dark:focus-visible:ring-offset-[#111111]"
      >
        {toggleLabel}
        <FiChevronDown
          aria-hidden="true"
          className={`text-base transition-transform duration-300 ease-out motion-reduce:transition-none ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </button>

      <div className="mt-5">
        <p className="text-[15px] font-semibold text-[#1C1C1C] dark:text-white">
          {recommendation.name}
        </p>

        {recommendation.headline ? (
          <p className="mt-1 text-tiny leading-6 text-gray-lite dark:text-[#A6A6A6]">
            {recommendation.headline}
          </p>
        ) : null}

        <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-tiny text-gray-lite dark:text-[#A6A6A6]">
          <span>{recommendation.relationship}</span>
          <span
            aria-hidden="true"
            className="h-1 w-1 rounded-full bg-gray-lite dark:bg-[#A6A6A6]"
          />
          <time dateTime={recommendation.date}>
            {recommendation.dateLabel}
          </time>
        </p>
      </div>

      <div className="mt-auto pt-6">
        <div className="border-t border-black/5 pt-4 dark:border-white/10">
          <a
            href={LINKEDIN_RECOMMENDATIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View on LinkedIn: Stuart Daniells' Recommendations page (opens in a new tab), recommendation from ${recommendation.name}`}
            className="group inline-flex items-center gap-2 rounded-sm text-tiny font-medium text-[#FA5252] transition-colors duration-300 ease-in-out hover:text-[#DD2476] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FA5252] focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:hover:text-[#DD2476] dark:focus-visible:ring-offset-[#111111]"
          >
            View on LinkedIn
            <FiExternalLink
              aria-hidden="true"
              className="text-base transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0"
            />
          </a>
        </div>
      </div>
    </article>
  );
};

export default RecommendationCard;
