"use client";

import { PrismicRichText } from "@prismicio/react";
import { slugifyHeading } from "@/lib/slugifyHeading";
import { clsx } from "clsx";
import { Heading } from "./Heading";
import { asText } from "@prismicio/client";
import { useEffect, useRef, useState } from "react";

// Create an iterable  nav element
const TocNavElement = ({ node, children, level, activeId }) => {
  const id = slugifyHeading(node);

  return (
    <li
      className={clsx("list-disc transition-colors", {
        "pl-2": level === 1,
        "pl-4": level === 2,
        "text-slate-300": id !== activeId,
        "text-blue-700": id === activeId,
      })}
    >
      <a className="block text-slate-700" href={`#${id}`}>
        {children ? children : node.text}
      </a>
    </li>
  );
};

// Create the ToC
export function Toc({ slices, title }) {
  const headingsList = useRef(null); // Reference our list of headings
  const [headings, setHeadings] = useState([]); // Store our headings id and index
  const [activeId, setActiveId] = useState(null); // Store the id of the active heading
  const scrollRef = useRef(0); // Store the previous scroll position

  useEffect(() => {
    if (!headingsList.current) return;

    const firstHeadingId = slugifyHeading({
      text: headingsList.current.childNodes[0].textContent,
    });

    setActiveId(firstHeadingId);

    headingsList.current.childNodes.forEach((heading, index) => {
      const id = slugifyHeading({ text: heading.textContent });

      if (id) {
        setHeadings((headings) => [...headings, { id, index }]);
      }
    });
  }, [headingsList]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute("id");

          if (entry.isIntersecting) {
            setActiveId(id);
            scrollRef.current = window.scrollY;
          } else {
            const diff = scrollRef.current - window.scrollY;
            const isScrollingUp = diff > 0;
            const currentIndex = headings.findIndex(
              (heading) => heading.id === id
            );
            const prevEntry = headings[currentIndex - 1];
            const prevId = prevEntry?.id;

            if (isScrollingUp && prevId) {
              setActiveId(prevId);
            }
          }
        });
      },
      {
        rootMargin: "0px 0px -95% 0px",
      }
    );

    const observeHeadings = () => {
      headings.forEach((heading) => {
        const currentHeading = document.getElementById(heading.id);

        if (currentHeading) {
          observer.observe(currentHeading);
        }
      });
    };

    if (headings.length) {
      observeHeadings();
    }

    return () => {
      headings.forEach((heading) => {
        const currentHeading = document.getElementById(heading.id);

        if (currentHeading) {
          observer.unobserve(currentHeading);
        }
      });
    };
  }, [headings]);

  return (
    <div className="2xl:sticky 2xl:top-4 px-4 md:px-6 w-full">
      <div className="2xl:absolute 2xl:top-0 2xl:left-4">
        <aside className="border p-6 bg-white mx-auto max-w-3xl mt-6 md:mt-0 2xl:w-80">
          <nav aria-labelledby="toc-heading">
            <Heading as="h2" size="xl" id="toc-heading">
              Table of Contents
            </Heading>
            <ol className="pl-4 mt-4" ref={headingsList} role="list">
              {/* For the blog title, create a first nav item */}
              <TocNavElement
                node={{ text: asText(title) }}
                level={1}
                activeId={activeId}
              />
              {/* Loop over our slices and if they are of type "text", render a
              PrismicRichText only configured to return headings of type
              heading1 and heading2 */}
              {slices.map(
                (slice) =>
                  slice.slice_type === "text" && (
                    <PrismicRichText
                      key={slice.id}
                      field={slice.primary.text}
                      components={{
                        heading2: ({ node, children, key }) => (
                          <TocNavElement
                            node={node}
                            children={children}
                            key={key}
                            level={1}
                            activeId={activeId}
                          />
                        ),
                        heading3: ({ node, children, key }) => (
                          <TocNavElement
                            node={node}
                            children={children}
                            key={key}
                            level={2}
                            activeId={activeId}
                          />
                        ),
                        heading1: () => <></>,
                        paragraph: () => <></>,
                        preformatted: () => <></>,
                        strong: () => <></>,
                        em: () => <></>,
                        listItem: () => <></>,
                        oListItem: () => <></>,
                        list: () => <></>,
                        oList: () => <></>,
                        image: () => <></>,
                        embed: () => <></>,
                        hyperlink: () => <></>,
                      }}
                    />
                  )
              )}
            </ol>
          </nav>
        </aside>
      </div>
    </div>
  );
}
