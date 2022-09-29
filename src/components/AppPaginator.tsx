import { useEffect, useState } from "react";
import { Col, Pagination, PaginationItem, PaginationLink, Row } from "reactstrap";

interface PagerData {
  activePage: number;
  totalPages: number;
  pages: number[];
  hasMoreToLeft: boolean;
  hasMoreToRight: boolean;
  pageStart: number;
  pageEnd: number;
  total: number;
}

interface Props {
  page: number;
  total: number;
  onChange: (page: number) => void;
  pageSize: number;
}

const PAGE_COUNT_SHOWN = 5;

export default function AppPaginator({ page, total, onChange, pageSize }: Props) {
  const [pagerConfig, setPagerConfig] = useState<PagerData>({
    activePage: 0,
    hasMoreToLeft: false,
    hasMoreToRight: false,
    pageEnd: 0,
    pageStart: 0,
    pages: [],
    totalPages: 0,
    total: 0,
  });

  useEffect(() => {
    const totalPages = Math.ceil(total / pageSize);

    let pages: number[] = total != pagerConfig.total ? [] : [...pagerConfig.pages];

    if (pages.length === 0) {
      for (var i = page; i <= totalPages && pages.length < PAGE_COUNT_SHOWN; i++) {
        pages.push(i);
      }
    } else if (!pages.includes(page)) {
      const newPages = []
      if (page > pages[pages.length - 1]) {
        for (var i = (page - PAGE_COUNT_SHOWN) + 1; i <= totalPages && newPages.length < PAGE_COUNT_SHOWN; i++) {
          newPages.push(i);
        }
      } else {
        for (var i = page; i <= totalPages && newPages.length < PAGE_COUNT_SHOWN; i++) {
          newPages.push(i);
        }
      }
      pages = newPages;
    }

    const hasMoreToLeft = page > 1;
    const hasMoreToRight = totalPages > page;
    const pageStart = (page - 1) * pageSize + 1;
    let pageEnd = page * pageSize;
    pageEnd = pageEnd > total ? total : pageEnd;

    const config: PagerData = {
      activePage: page,
      totalPages,
      pages,
      hasMoreToLeft,
      hasMoreToRight,
      pageStart,
      pageEnd,
      total
    };
    setPagerConfig(config);
  }, [total, page, pageSize]);

  const handlePageClick = (p: number) => {
    onChange(p);
  }

  if (total == 0) return null;

  return <Row>
    <Col>
      <Pagination>
        <PaginationItem disabled={!pagerConfig.hasMoreToLeft}
          onClick={() => handlePageClick(1)}>
          <PaginationLink first href="#" />
        </PaginationItem>
        <PaginationItem disabled={!pagerConfig.hasMoreToLeft}
          onClick={() => handlePageClick(pagerConfig.activePage > 1 ? pagerConfig.activePage - 1 : 1)}>
          <PaginationLink previous href="#" />
        </PaginationItem>
        {pagerConfig.pages.map((val) => <PaginationItem key={`pagination_${val}`} active={pagerConfig.activePage === val}>
          <PaginationLink href="#"
            onClick={() => handlePageClick(val)}>
            {val}
          </PaginationLink>
        </PaginationItem>)}
        <PaginationItem disabled={!pagerConfig.hasMoreToRight}
          onClick={() => handlePageClick(pagerConfig.activePage < pagerConfig.totalPages ? pagerConfig.activePage + 1 : pagerConfig.totalPages)}>
          <PaginationLink next href="#" />
        </PaginationItem>
        <PaginationItem disabled={!pagerConfig.hasMoreToRight}
          onClick={() => handlePageClick(pagerConfig.totalPages)}>
          <PaginationLink last href="#" />
        </PaginationItem>
      </Pagination>
    </Col>
    <Col className="text-end">
      {`${pagerConfig.pageStart} - ${pagerConfig.pageEnd} of ${total} records [Page ${pagerConfig.activePage} of ${pagerConfig.totalPages}]`}
    </Col>
  </Row>
}
