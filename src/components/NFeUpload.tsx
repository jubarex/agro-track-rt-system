
import React, { useRef, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { UploadCloud } from "lucide-react";

type NFeData = {
  numero: string;
  dataEmissao: string;
  emitente: string;
  destinatario: string;
  valorTotal: string;
};

const parseNFeXML = (xmlString: string): NFeData | null => {
  try {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlString, "text/xml");
    const ide = xml.querySelector("ide");
    const emit = xml.querySelector("emit");
    const dest = xml.querySelector("dest");
    const total = xml.querySelector("ICMSTot");

    return {
      numero: ide?.querySelector("nNF")?.textContent || "",
      dataEmissao: ide?.querySelector("dhEmi")?.textContent?.slice(0, 10) || "",
      emitente: emit?.querySelector("xNome")?.textContent || "",
      destinatario: dest?.querySelector("xNome")?.textContent || "",
      valorTotal: total?.querySelector("vNF")?.textContent || "",
    };
  } catch {
    return null;
  }
};

const NFeUpload: React.FC = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [nfeData, setNfeData] = useState<NFeData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const xmlContent = evt.target?.result as string;
      const data = parseNFeXML(xmlContent);
      if (data) {
        setNfeData(data);
        setError(null);
      } else {
        setError("Não foi possível ler o arquivo XML da NF-e.");
        setNfeData(null);
      }
    };
    reader.onerror = () => setError("Erro ao ler o arquivo.");
    reader.readAsText(file);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload de NF-e (XML)</CardTitle>
      </CardHeader>
      <CardContent>
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

          {nfeData && (
            <div className="w-full mt-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número</TableHead>
                    <TableHead>Data Emissão</TableHead>
                    <TableHead>Emitente</TableHead>
                    <TableHead>Destinatário</TableHead>
                    <TableHead>Valor Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>{nfeData.numero}</TableCell>
                    <TableCell>{nfeData.dataEmissao}</TableCell>
                    <TableCell>{nfeData.emitente}</TableCell>
                    <TableCell>{nfeData.destinatario}</TableCell>
                    <TableCell>R$ {nfeData.valorTotal}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NFeUpload;
