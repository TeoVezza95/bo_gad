import React from "react";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
} from "@/components/ui/pagination";

interface CustomPaginationProps {
    currentPage: number;
    totalRecords: number;
    pageSize: number;
    maxVisiblePages?: number;
    onPageChange: (page: number) => void;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
                                                               currentPage,
                                                               totalRecords,
                                                               pageSize,
                                                               maxVisiblePages = 3,
                                                               onPageChange,
                                                           }) => {
    const lastPage = Math.ceil(totalRecords / pageSize);
    // Rimuovo il return null, così visualizziamo comunque la paginazione anche se c'è solo una pagina.
    // if (lastPage <= 1) return null;

    const halfMax = Math.floor(maxVisiblePages / 2);
    let startPage = Math.max(1, currentPage - halfMax);
    let endPage = startPage + maxVisiblePages - 1;
    if (endPage > lastPage) {
        endPage = lastPage;
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const handlePageChange = (page: number) => {
        if (page !== currentPage && page >= 1 && page <= lastPage) {
            onPageChange(page);
        }
    };

    return (
        <Pagination>
            <PaginationContent className="flex flex-wrap">
                <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
                {startPage > 1 && (
                    <>
                        <PaginationItem>
                            <PaginationLink onClick={() => handlePageChange(1)}>
                                1
                            </PaginationLink>
                        </PaginationItem>
                        {startPage > 2 && <PaginationEllipsis />}
                    </>
                )}
                {Array.from({ length: endPage - startPage + 1 }, (_, idx) => {
                    const page = startPage + idx;
                    return (
                        <PaginationItem key={page}>
                            <PaginationLink
                                onClick={() => handlePageChange(page)}
                                isActive={page === currentPage}
                            >
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    );
                })}
                {endPage < lastPage && (
                    <>
                        {endPage < lastPage - 1 && <PaginationEllipsis />}
                        <PaginationItem>
                            <PaginationLink onClick={() => handlePageChange(lastPage)}>
                                {lastPage}
                            </PaginationLink>
                        </PaginationItem>
                    </>
                )}
                <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={currentPage === lastPage ? "pointer-events-none opacity-50" : ""}
                />
            </PaginationContent>
        </Pagination>
    );
};

export default CustomPagination;
