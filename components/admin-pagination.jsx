import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

function buildPaginationHref(pathname, searchParams, page) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams || {})) {
    if (key === "page") {
      continue;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        if (item) {
          params.append(key, item);
        }
      }

      continue;
    }

    if (value !== undefined && value !== null && value !== "") {
      params.set(key, value);
    }
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const queryString = params.toString();

  return queryString ? `${pathname}?${queryString}` : pathname;
}

function PaginationButton({ disabled, href, children }) {
  if (disabled) {
    return (
      <Button type="button" variant="outline" size="sm" disabled>
        {children}
      </Button>
    );
  }

  return (
    <Button asChild variant="outline" size="sm">
      <Link href={href}>{children}</Link>
    </Button>
  );
}

export default function AdminPagination({
  pathname,
  page,
  totalPages,
  searchParams,
}) {
  if (!totalPages || totalPages <= 1) {
    return null;
  }

  const currentPage = Math.min(page, totalPages);

  return (
    <nav
      aria-label="Paginazione"
      className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-sm text-muted-foreground">
        Pagina {currentPage} di {totalPages}
      </p>

      <div className="flex items-center gap-2">
        <PaginationButton
          disabled={currentPage <= 1}
          href={buildPaginationHref(pathname, searchParams, currentPage - 1)}
        >
          <ChevronLeft />
          Precedente
        </PaginationButton>

        <PaginationButton
          disabled={currentPage >= totalPages}
          href={buildPaginationHref(pathname, searchParams, currentPage + 1)}
        >
          Successiva
          <ChevronRight />
        </PaginationButton>
      </div>
    </nav>
  );
}
