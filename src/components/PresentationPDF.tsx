import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Box, Button, Typography } from "@mui/material";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

type PDFLoadSuccess = {
  numPages: number;
};

export default function PresentationPDF({ document }: { document: string }) {
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
      <Document file={document} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} />
      </Document>

      <Typography sx={{ mt: 2 }}>
        Page {pageNumber} of {numPages}
      </Typography>

      <Box
        sx={{
          mt: 2,
          display: "flex",
          gap: 2,
          justifyContent: "center",
        }}
      >
        <Button
          variant="contained"
          disabled={pageNumber <= 1}
          onClick={prevPage}
        >
          Previous
        </Button>

        <Button
          variant="contained"
          disabled={pageNumber >= numPages}
          onClick={nextPage}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}
