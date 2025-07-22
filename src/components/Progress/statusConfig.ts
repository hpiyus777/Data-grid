import {
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  FileText,
  RefreshCw,
} from "lucide-react";
import type { StatusConfig } from "../../actions/types";

export const statusConfig: Record<string, StatusConfig> = {
  Completed: {
    color: "bg-[#00798c]",
    icon: CheckCircle,
    bgColor: "bg-[#f6f7ef]",
    textColor: "text-[#00798c]",
  },
  Approved: {
    color: "bg-[#679436]",
    icon: CheckCircle,
    bgColor: "bg-[#f6f7ef]",
    textColor: "text-[#679436]",
  },
  "On Hold": {
    color: "bg-[#5b4fff]",
    icon: Clock,
    bgColor: "bg-[#f6f7ef]",
    textColor: "text-[#5b4fff]",
  },
  Estimating: {
    color: "bg-[#393e41]",
    icon: Clock,
    bgColor: "bg-[#f6f7ef]",
    textColor: "text-[#393e41]",
  },
  "Pending Approval": {
    color: "bg-[#e94f37]",
    icon: AlertCircle,
    bgColor: "bg-[#f6f7ef]",
    textColor: "text-[#e94f37]",
  },
  "Re-Estimating": {
    color: "bg-[#5b4fff]",
    icon: RefreshCw,
    bgColor: "bg-[#f6f7ef]",
    textColor: "text-[#5b4fff]",
  },
  Lost: {
    color: "bg-[#e94f37]",
    icon: XCircle,
    bgColor: "bg-[#f6f7ef]",
    textColor: "text-[#e94f37]",
  },
  Template: {
    color: "bg-[#393e41]",
    icon: FileText,
    bgColor: "bg-[#f6f7ef]",
    textColor: "text-[#393e41]",
  },
};
