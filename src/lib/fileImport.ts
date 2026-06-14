import type { ImportedTextSource } from "../types/accounting";

export type FileImportProgress = {
  stage: "reading" | "pdf" | "ocr" | "done";
  message: string;
  progress?: number;
};

export const extractTextFromFile = async (
  file: File,
  onProgress?: (progress: FileImportProgress) => void
): Promise<ImportedTextSource> => {
  const lowerName = file.name.toLowerCase();

  if (file.type.startsWith("text/") || lowerName.endsWith(".txt")) {
    onProgress?.({ stage: "reading", message: "Lettura file di testo", progress: 0.2 });
    return {
      fileName: file.name,
      fileType: "text",
      text: await file.text(),
      warnings: []
    };
  }

  if (file.type === "application/pdf" || lowerName.endsWith(".pdf")) {
    return extractTextFromPdf(file, onProgress);
  }

  if (file.type.startsWith("image/")) {
    return extractTextFromImage(file, onProgress);
  }

  throw new Error("Formato non supportato. Usa TXT, PDF o immagine.");
};

const extractTextFromPdf = async (
  file: File,
  onProgress?: (progress: FileImportProgress) => void
): Promise<ImportedTextSource> => {
  onProgress?.({ stage: "pdf", message: "Analisi PDF", progress: 0.05 });
  const pdfjs = await import("pdfjs-dist");
  const worker = await import("pdfjs-dist/build/pdf.worker.mjs?url");
  pdfjs.GlobalWorkerOptions.workerSrc = worker.default;

  const bytes = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: bytes }).promise;
  const pages: string[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ")
      .replace(/\s{2,}/g, " ")
      .trim();
    pages.push(pageText);
    onProgress?.({
      stage: "pdf",
      message: `Lettura PDF pagina ${pageNumber}/${pdf.numPages}`,
      progress: pageNumber / pdf.numPages
    });
  }

  const text = pages.join("\n");
  const warnings =
    text.trim().length === 0
      ? ["Il PDF non contiene testo selezionabile: prova a caricare una foto o immagine della traccia per OCR."]
      : [];

  return {
    fileName: file.name,
    fileType: "pdf",
    text,
    warnings
  };
};

const extractTextFromImage = async (
  file: File,
  onProgress?: (progress: FileImportProgress) => void
): Promise<ImportedTextSource> => {
  onProgress?.({ stage: "ocr", message: "Preparazione OCR immagine", progress: 0.05 });
  const { createWorker } = await import("tesseract.js");
  const worker = await createWorker("ita+eng", 1, {
    logger: (message) => {
      if (message.status) {
        onProgress?.({
          stage: "ocr",
          message: `OCR: ${message.status}`,
          progress: typeof message.progress === "number" ? message.progress : undefined
        });
      }
    }
  });

  try {
    const result = await worker.recognize(file);
    const text = result.data.text.trim();

    return {
      fileName: file.name,
      fileType: "image",
      text,
      warnings:
        text.length === 0
          ? ["OCR completato ma non e stato trovato testo leggibile."]
          : ["Testo estratto con OCR: controlla sempre importi e mappature prima di importare."]
    };
  } finally {
    await worker.terminate();
  }
};
