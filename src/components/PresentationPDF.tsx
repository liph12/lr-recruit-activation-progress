import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Box, Typography, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { useAppProvider } from "../providers/AppProvider";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type PDFLoadSuccess = {
  numPages: number;
};

export default function PresentationPDF({ document }: { document: string }) {
  const { desktop } = useAppProvider();
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);

  const onDocumentLoadSuccess = ({ numPages }: PDFLoadSuccess) => {
    setNumPages(numPages);
  };

  const nextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  };

  const prevPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  return (
    <Box textAlign="center">
      <Box
        sx={{
          my: 2,
          display: "flex",
          gap: 2,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <IconButton onClick={prevPage}>
          <ChevronLeft />
        </IconButton>
        <Typography>
          Page {pageNumber} of {numPages}
        </Typography>
        <IconButton onClick={nextPage}>
          <ChevronRight />
        </IconButton>
      </Box>
      <Box
        sx={{
          width: desktop ? 600 : 320,
          height: desktop ? 400 : 220,
          mx: "auto",
          overflow: "auto",
          border: "1px solid #ddd",
        }}
      >
        <Document file={document} onLoadSuccess={onDocumentLoadSuccess}>
          <Page
            pageNumber={pageNumber}
            width={desktop ? 600 : 320}
            renderAnnotationLayer={false}
            renderTextLayer={false}
          />
        </Document>
      </Box>
    </Box>
  );
}
