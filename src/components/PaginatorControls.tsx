import { useEffect, useState } from "react";
import CustomSelect from "@/components/CustomSelect";
import CustomPagination from "@/components/CustomPagination";

interface PaginationControlsProps {
    pageOptions: number[];
    totalRecords: number;
    initialPage?: number;
    initialPageSize?: number;
    onPaginationChange: (currentPage: number, pageSize: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
                                                                   pageOptions,
                                                                   totalRecords,
                                                                   initialPage = 1,
                                                                   initialPageSize = 10,
                                                                   onPaginationChange,
                                                               }) => {
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [pageSize, setPageSize] = useState(initialPageSize);

    // Chiamata al callback quando cambiano currentPage o pageSize
    useEffect(() => {
        onPaginationChange(currentPage, pageSize);
    }, [currentPage, pageSize]);

    useEffect(() => {
        setCurrentPage(1);
    }, [totalRecords]);

    const handlePageSizeChange = (newPageSize: number) => {
        setCurrentPage(1); // Resetto a pagina 1 quando il pageSize cambia
        setPageSize(newPageSize);
    };

    return (
        <div className="flex justify-evenly items-center w-full h-full my-4 p-1 mr-4">
            <CustomSelect
                items={pageOptions}
                defaultValue={pageSize}
                onChange={(newPageSize) => handlePageSizeChange(parseInt(newPageSize))}
            />
            <CustomPagination
                currentPage={currentPage}
                totalRecords={totalRecords}
                pageSize={pageSize}
                onPageChange={(page) => setCurrentPage(page)}
            />
            <div className="whitespace-nowrap font-extralight">
                {`${pageSize * currentPage < totalRecords ? pageSize * currentPage : totalRecords} of ${totalRecords}`}
            </div>
        </div>
    );
};

export default PaginationControls;
