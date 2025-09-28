"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationLinkType {
  url: string | null;
  label: string;
  active: boolean;
}

interface PaginationControlsProps {
  links: PaginationLinkType[];
}

export function PaginationControls({ links }: PaginationControlsProps) {
  if (!links.length) return null;

  return (
    <Pagination className="mt-4">
      <PaginationContent>
        {links.map((link, i) => {
          // Disabled link (null URL, e.g. when prev/next is unavailable)
          if (!link.url) {
            return (
              <PaginationItem key={i}>
                <span
                  className="px-3 py-1 text-gray-400 cursor-not-allowed"
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              </PaginationItem>
            );
          }

          // Previous button
          if (link.label.includes("Previous")) {
            return (
              <PaginationItem key={i}>
                <PaginationPrevious size={'default'} href={link.url} />
              </PaginationItem>
            );
          }

          // Next button
          if (link.label.includes("Next")) {
            return (
              <PaginationItem key={i}>
                <PaginationNext size={'default'} href={link.url} />
              </PaginationItem>
            );
          }

          // Numbered page buttons
          return (
            <PaginationItem key={i}>
                  <PaginationLink
                      size={'default'}
                href={link.url}
                isActive={link.active}
                dangerouslySetInnerHTML={{ __html: link.label }}
              />
            </PaginationItem>
          );
        })}
      </PaginationContent>
    </Pagination>
  );
}
