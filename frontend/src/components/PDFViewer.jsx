import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const PDFViewer = ({ pdfUrl }) => {
  const [pdfPath, setPdfPath] = useState("");

  useEffect(() => {
    setPdfPath(pdfUrl); // ✅ Use pdfUrl directly (no need for process.env.PUBLIC_URL)
  }, [pdfUrl]);

  return (
    <div className="flex justify-center items-center h-screen">
      <iframe
        src={pdfPath}
        width="80%"
        height="600px"
        className="border border-gray-300 shadow-lg rounded-lg"
        title="Fitness Website PDF"
      ></iframe>
    </div>
  );
};

// ✅ Fix ESLint warning by adding PropTypes
PDFViewer.propTypes = {
  pdfUrl: PropTypes.string.isRequired,
};

export default PDFViewer;
