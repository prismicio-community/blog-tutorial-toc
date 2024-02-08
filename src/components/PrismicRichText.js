import { PrismicNextLink } from "@prismicio/next";
import { PrismicRichText as BasePrismicRichText } from "@prismicio/react";
import { Heading } from "./Heading";
import { slugifyHeading } from "@/lib/slugifyHeading";

/** @type {import("@prismicio/react").JSXMapSerializer} */
const defaultComponents = {
  heading1: ({ children, node }) => (
    <Heading
      as="h2"
      size="3xl"
      className="mb-7 mt-12 first:mt-0 last:mb-0"
      id={slugifyHeading(node)}
    >
      {children}
    </Heading>
  ),
  heading2: ({ children, node }) => (
    <Heading
      as="h3"
      size="2xl"
      className="mb-7 last:mb-0 scroll-mt-6"
      id={slugifyHeading(node)}
    >
      {children}
    </Heading>
  ),
  heading3: ({ children, node }) => (
    <Heading
      as="h4"
      size="xl"
      className="mb-7 last:mb-0 scroll-mt-6"
      id={slugifyHeading(node)}
    >
      {children}
    </Heading>
  ),
  paragraph: ({ children }) => <p className="mb-7 last:mb-0">{children}</p>,
  oList: ({ children }) => (
    <ol className="mb-7 pl-4 last:mb-0 md:pl-6">{children}</ol>
  ),
  oListItem: ({ children }) => (
    <li className="mb-1 list-decimal pl-1 last:mb-0 md:pl-2">{children}</li>
  ),
  list: ({ children }) => (
    <ul className="mb-7 pl-4 last:mb-0 md:pl-6">{children}</ul>
  ),
  listItem: ({ children }) => (
    <li className="mb-1 list-disc pl-1 last:mb-0 md:pl-2">{children}</li>
  ),
  preformatted: ({ children }) => (
    <pre className="mb-7 rounded bg-slate-100 p-4 text-sm last:mb-0 md:p-8 md:text-lg">
      <code>{children}</code>
    </pre>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold">{children}</strong>
  ),
  hyperlink: ({ children, node }) => (
    <PrismicNextLink
      field={node.data}
      className="underline decoration-1 underline-offset-2"
    >
      {children}
    </PrismicNextLink>
  ),
};

export function PrismicRichText({ components, ...props }) {
  return (
    <BasePrismicRichText
      components={{ ...defaultComponents, ...components }}
      {...props}
    />
  );
}
