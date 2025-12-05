"use client";
import z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  RequiredLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { usePatientById, useUpdatePatient } from "@/hooks/queries/usePatient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  patientId: string | null;
}

// ----------------------
// 🟩 Zod Schema
// ----------------------
const UpdatePatientSchema = z.object({
  fullName: z
    .string("Full name is required")
    .max(255, "Full name must be at most 255 characters"),

  dateOfBirth: z
    .string("Date of birth is required")
    .refine(
      (value) => !isNaN(Date.parse(value)),
      "Date of birth must be a valid ISO date (YYYY-MM-DD)"
    ),

  gender: z.enum(["MALE", "FEMALE", "OTHER"], {
    message: "Gender is required",
  }),

  bloodType: z
    .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], {
      message: "Invalid blood type",
    })
    .nullable()
    .optional(),

  phoneNumber: z
    .string("Phone number is required")
    .regex(
      /^(0|\+84)(3|5|7|8|9)\d{8}$/,
      "Phone number must be a valid Vietnamese phone number"
    ),

  email: z.email("Email is invalid"),

  address: z
    .string("Address is required")
    .max(255, "Address must be at most 255 characters"),

  identificationNumber: z
    .string("Identification number is required")
    .regex(/^[0-9]{9,12}$/, "ID must be 9–12 digits"),

  allergies: z.string().optional(),
  relativeFullName: z.string("Relative full name is required"),
  relativePhoneNumber: z
    .string("Relative phone number is required")
    .regex(/^(0|\+84)(3|5|7|8|9)\d{8}$/, "Invalid relative phone number"),
  relativeRelationship: z.string("Relative relationship number is required"),
});

export function UpdatePatientDialog({ open, setOpen, patientId }: Props) {
  const { mutate: updateItem, isPending } = useUpdatePatient();
  const { data: patient } = usePatientById(patientId || "");

  const form = useForm<z.infer<typeof UpdatePatientSchema>>({
    resolver: zodResolver(UpdatePatientSchema),
    defaultValues: {
      fullName: "",
      email: "",
      dateOfBirth: "",
      gender: "MALE",
      phoneNumber: "",
      address: "",
      identificationNumber: "",
      bloodType: null,
      allergies: "",
      relativeFullName: "",
      relativePhoneNumber: "",
      relativeRelationship: "",
    },
  });

  // 🟦 Load form
  useEffect(() => {
    if (patient) {
      form.reset({
        fullName: patient.fullName,
        email: patient.email,
        dateOfBirth: patient.dateOfBirth,
        gender: patient.gender,
        phoneNumber: patient.phoneNumber,
        address: patient.address,
        identificationNumber: patient.identificationNumber,
        bloodType: patient.bloodType as
          | "A+"
          | "A-"
          | "B+"
          | "B-"
          | "AB+"
          | "AB-"
          | "O+"
          | "O-"
          | null
          | undefined,
        allergies: patient.allergies,
        relativeFullName: patient.relativeFullName,
        relativePhoneNumber: patient.relativePhoneNumber,
        relativeRelationship: patient.relativeRelationship,
      });
    }
  }, [patient, form]);

  function onSubmit(values: z.infer<typeof UpdatePatientSchema>) {
    if (!patient) return;

    updateItem(
      {
        id: patient.id,
        data: values,
      },
      {
        onSuccess: () => {
          toast.success("Patient updated");
          handleClose();
        },
        onError: (err) => {
          toast.error(err.message);
        },
      }
    );
  }

  const handleClose = () => {
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Patient</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              {/* FULL NAME */}
              <FormField
                disabled={isPending}
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <RequiredLabel>Full Name</RequiredLabel>
                    </FormLabel>
                    <FormControl>
                      <Input disabled={isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* EMAIL */}
              <FormField
                disabled={isPending}
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <RequiredLabel>Email</RequiredLabel>
                    </FormLabel>
                    <FormControl>
                      <Input disabled={isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* DATE OF BIRTH */}
              <FormField
                disabled={isPending}
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <RequiredLabel>Date of Birth</RequiredLabel>
                    </FormLabel>
                    <FormControl>
                      <Input type="date" disabled={isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* GENDER */}
              <FormField
                disabled={isPending}
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <RequiredLabel>Gender</RequiredLabel>
                    </FormLabel>
                    <Select
                      disabled={isPending}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* PHONE NUMBER */}
              <FormField
                disabled={isPending}
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <RequiredLabel>Phone Number</RequiredLabel>
                    </FormLabel>
                    <FormControl>
                      <Input disabled={isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ADDRESS */}
              <FormField
                disabled={isPending}
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <RequiredLabel>Address</RequiredLabel>
                    </FormLabel>
                    <FormControl>
                      <Input disabled={isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* IDENTIFICATION NUMBER */}
              <FormField
                disabled={isPending}
                control={form.control}
                name="identificationNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <RequiredLabel>Identification Number</RequiredLabel>
                    </FormLabel>
                    <FormControl>
                      <Input disabled={isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* BLOOD TYPE — OPTIONAL */}
              <FormField
                disabled={isPending}
                control={form.control}
                name="bloodType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blood Type</FormLabel>
                    <Select
                      disabled={isPending}
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select blood type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ALLERGIES — OPTIONAL */}
              <FormField
                disabled={isPending}
                control={form.control}
                name="allergies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allergies</FormLabel>
                    <FormControl>
                      <Input disabled={isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full h-px bg-gray-200" />
            {/* RELATIVE FULL NAME */}
            <div className="grid grid-cols-2 gap-4">
              {/* RELATIVE FULL NAME */}
              <FormField
                disabled={isPending}
                control={form.control}
                name="relativeFullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <RequiredLabel>Relative Full Name</RequiredLabel>
                    </FormLabel>
                    <FormControl>
                      <Input disabled={isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* RELATIVE PHONE NUMBER */}
              <FormField
                disabled={isPending}
                control={form.control}
                name="relativePhoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <RequiredLabel>Relative Phone Number</RequiredLabel>
                    </FormLabel>
                    <FormControl>
                      <Input disabled={isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* RELATIVE RELATIONSHIP */}
              <FormField
                disabled={isPending}
                control={form.control}
                name="relativeRelationship"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <RequiredLabel>Relative Relationship</RequiredLabel>
                    </FormLabel>
                    <FormControl>
                      <Input disabled={isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex justify-end gap-3 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                Update
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
