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
        <IconButton
          onClick={prevPage}
          sx={{
            color: "#c9a84c",
            bgcolor: "rgba(201,168,76,0.08)",
            border: "1px solid rgba(201,168,76,0.18)",
            "&:hover": {
              bgcolor: "rgba(201,168,76,0.18)",
              boxShadow: "0 6px 18px rgba(201,168,76,0.25)",
            },
          }}
          aria-label="Previous"
        >
          <ChevronLeft />
        </IconButton>

        <Typography sx={{ color: "#c9a84c", fontWeight: 700, px: 1 }}>
          Page {pageNumber} of {numPages}
        </Typography>

        <IconButton
          onClick={nextPage}
          sx={{
            color: "#c9a84c",
            bgcolor: "rgba(201,168,76,0.08)",
            border: "1px solid rgba(201,168,76,0.18)",
            "&:hover": {
              bgcolor: "rgba(201,168,76,0.18)",
              boxShadow: "0 6px 18px rgba(201,168,76,0.25)",
            },
          }}
          aria-label="Next"
        >
          <ChevronRight />
        </IconButton>
      </Box>

      <Box
        sx={{
          width: desktop ? 600 : 320,
          height: desktop ? 400 : 220,
          mx: "auto",
          overflow: "hidden",
          borderRadius: 1,
          border: "1px solid rgba(201,168,76,0.12)",
          boxShadow: "inset 0 2px 6px rgba(0,0,0,0.25)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0))",
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
