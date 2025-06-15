
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";
import { NFeData } from "@/types";
import { toast } from "sonner";

const parseNFeXML = (xmlString: string): Omit<NFeData, "fileName"> | null => {
  try {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlString, "text/xml");
    const ide = xml.querySelector("ide");
    const emit = xml.querySelector("emit");
    const dest = xml.querySelector("dest");
    const total = xml.querySelector("ICMSTot");

    const nfeError = xml.querySelector("parsererror");
    if (nfeError) {
      console.error("XML Parsing Error:", nfeError.textContent);
      return null;
    }

    return {
      numero: ide?.querySelector("nNF")?.textContent || "",
      dataEmissao: ide?.querySelector("dhEmi")?.textContent || "",
      emitente: emit?.querySelector("xNome")?.textContent || "",
      destinatario: dest?.querySelector("xNome")?.textContent || "",
      valorTotal: total?.querySelector("vNF")?.textContent || "",
    };
  } catch (e) {
    console.error("Error parsing XML", e);
    return null;
  }
};

type NFeUploadProps = {
  onNFeParsed: (data: NFeData) => void;
};

const NFeUpload: React.FC<NFeUploadProps> = ({ onNFeParsed }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const xmlContent = evt.target?.result as string;
      const parsedData = parseNFeXML(xmlContent);
      if (parsedData && parsedData.numero) {
        onNFeParsed({ ...parsedData, fileName: file.name });
        toast.success(`Arquivo "${file.name}" lido com sucesso!`);
        if (inputRef.current) {
          inputRef.current.value = ""; // Reset input para permitir upload do mesmo arquivo
        }
      } else {
        setError("Não foi possível ler o arquivo XML da NF-e. Verifique o formato.");
        toast.error("Falha ao ler o arquivo XML da NF-e.");
      }
    };
    reader.onerror = () => {
        setError("Erro ao ler o arquivo.");
        toast.error("Ocorreu um erro ao ler o arquivo.");
    }
    reader.readAsText(file, 'UTF-8');
  };

  return (
    <div className="flex flex-col gap-4">
        <input
            ref={inputRef}
            type="file"
            accept=".xml"
            className="hidden"
            onChange={handleFileChange}
            data-testid="input-nfe-upload"
        />
        <Button
            onClick={() => inputRef.current?.click()}
            variant="outline"
            className="flex gap-2 w-fit"
        >
            <UploadCloud className="w-4 h-4" />
            Carregar NF-e XML
        </Button>

        {error && <span className="text-destructive text-sm">{error}</span>}
    </div>
  );
};

export default NFeUpload;
