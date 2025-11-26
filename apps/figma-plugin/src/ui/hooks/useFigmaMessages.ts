import type { SvgBatchItem } from "@tiny-svg/svg-core";
import { useEffect } from "react";
import type { Config as SvgoConfig } from "svgo";
import { usePluginStore } from "../store/plugin-store";

const defaultSvgoConfig: SvgoConfig = {
  multipass: true,
  plugins: ["preset-default"],
};

interface FigmaMessage {
  type: string;
  data: unknown;
}

interface SelectedSvgsMessage {
  type: "selected-svgs";
  data: {
    nodes: Array<{
      id: string;
      name: string;
      svg: string;
    }>;
  };
}

interface SvgCompressedMessage {
  type: "svgs-compressed";
  data: SvgBatchItem[];
}

interface ErrorMessage {
  type: "error";
  data: {
    message: string;
  };
}

export function useFigmaMessages() {
  const { setSelectedSvgs, setCompressedSvgs, setLoading, setError } =
    usePluginStore();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const msg = event.data.pluginMessage as FigmaMessage;

      switch (msg.type) {
        case "selected-svgs": {
          const { nodes } = (msg as SelectedSvgsMessage).data;
          const svgs: SvgBatchItem[] = nodes.map((node, index) => ({
            id: `svg-${index}-${node.id}`,
            layerName: node.name,
            nodeId: node.id,
            originalSvg: node.svg,
            compressedSvg: "",
            fileName: `${node.name}.svg`,
            svgoConfig: defaultSvgoConfig,
            originalSize: new Blob([node.svg]).size,
            compressedSize: 0,
            compressionRatio: 0,
          }));
          setSelectedSvgs(svgs);
          break;
        }

        case "svgs-compressed": {
          const compressedSvgs = (msg as SvgCompressedMessage).data;
          setCompressedSvgs(compressedSvgs);
          setLoading(false);
          break;
        }

        case "selection-changed": {
          const { nodes } = (msg as SelectedSvgsMessage).data;
          if (nodes.length === 0) {
            setSelectedSvgs([]);
            setCompressedSvgs([]);
          }
          break;
        }

        case "error": {
          const { message } = (msg as ErrorMessage).data;
          setError(message);
          setLoading(false);
          break;
        }

        default:
          console.warn("Unknown message type:", msg.type);
      }
    };

    window.addEventListener("message", handleMessage);

    // Request initial selection
    parent.postMessage({ pluginMessage: { type: "get-selected-svgs" } }, "*");

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [setSelectedSvgs, setCompressedSvgs, setLoading, setError]);
}
