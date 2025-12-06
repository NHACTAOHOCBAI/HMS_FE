import {
  getInvoices,
  getInvoice,
  createPayment,
  getInvoiceSummary,
  cancelInvoice,
  getPayments,
  getInvoicesByPatient,
} from "@/services/billing.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useInvoices = (
  page: number,
  limit: number,
  search?: string,
  status?: string,
  startDate?: string,
  endDate?: string,
  sort?: string
) => {
  return useQuery({
    queryKey: ["invoices", page, limit, search, status, startDate, endDate, sort],
    queryFn: () =>
      getInvoices({ page, limit, search, status, startDate, endDate, sort }),
  });
};

export const useInvoice = (id: string) => {
  return useQuery({
    queryKey: ["invoice", id],
    queryFn: () => getInvoice(id),
    enabled: !!id,
  });
};

export const useInvoiceSummary = () => {
  return useQuery({
    queryKey: ["invoiceSummary"],
    queryFn: getInvoiceSummary,
  });
};

export const usePatientInvoices = (patientId: string, status?: string) => {
  return useQuery({
    queryKey: ["patientInvoices", patientId, status],
    queryFn: () => getInvoicesByPatient(patientId),
    enabled: !!patientId,
    select: (data) =>
      status && status !== "ALL"
        ? data.filter((inv) => inv.status === status)
        : data,
  });
};

export const useCreatePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPayment,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["invoice", variables.invoiceId],
      });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoiceSummary"] });
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
    onError: (error: any) => {
      const code = error?.response?.data?.error?.code;
      const msg =
        {
          DUPLICATE_PAYMENT: "Payment already processed",
          INVOICE_ALREADY_PAID: "Invoice is already fully paid",
          INVOICE_CANCELLED: "Cannot pay a cancelled invoice",
          VALIDATION_ERROR: "Please check payment details",
        }[code] || "Failed to record payment";
      import("sonner").then(({ toast }) => toast.error(msg));
    },
  });
};

export const useCancelInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      cancelInvoice(id, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["invoice", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoiceSummary"] });
    },
  });
};

export const usePayments = (
  page: number,
  limit: number,
  search?: string,
  method?: string,
  startDate?: string,
  endDate?: string
) => {
  return useQuery({
    queryKey: ["payments", page, limit, search, method, startDate, endDate],
    queryFn: () =>
      getPayments({ page, limit, search, method, startDate, endDate }),
  });
};
