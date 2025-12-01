"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import MyDatePicker from "@/app/admin/_components/MyDatePicker";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useCreatePatient } from "@/hooks/queries/usePatient";
import { toast } from "sonner";

const AddPatientSchema = z.object({
  fullName: z.string().min(1, "full name is required"),
  dob: z.string().min(1, "dob is required"),
  gender: z.string().min(1, "gender is required"),
  phoneNumber: z.string().min(1, "phone number is required"),
  email: z.string().email("email is invalid"),
  homeAddress: z.string().min(1, "home address is required"),
  cardId: z.string().min(1, "card id is required"),
  contactName: z.string().min(1, "contact name is required"),
  relationshipToPatient: z
    .string()
    .min(1, "relationship to patient is required"),
  contactPhone: z.string().min(1, "contact phone is required"),
});

const AddPatient = () => {
  const form = useForm<z.infer<typeof AddPatientSchema>>({
    resolver: zodResolver(AddPatientSchema),
    defaultValues: {
      gender: "male",
    },
  });
  const { mutate: createItem, isPending } = useCreatePatient();
  const onSubmit = (data: z.infer<typeof AddPatientSchema>) => {
    createItem(data, {
      onSuccess: () => {
        toast.success("Patient has been created");
      },
      onError: (error) => {
        toast.error(`Ohh!!! ${error.message}`);
      },
      onSettled: () => {},
    });
  };

  return (
    <div className="w-[830px] bg-white rounded-[12px] border border-[#E2E8F0] p-6 mx-auto">
      {/* Administrative Info */}
      <div className=" bg-white rounded-[12px] border border-[#E2E8F0] mx-auto">
        <p className="p-6 font-semibold text-[20px] border-b border-[#E2E8F0]">
          Administrative Information
        </p>
        <div className="p-6">
          <Form {...form}>
            {/* FORM START */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Full Name */}
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter patient's full name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* DOB + Gender */}
              <div className="flex gap-6">
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name="dob"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <MyDatePicker
                            value={
                              field.value ? new Date(field.value) : undefined
                            }
                            onChange={(val) =>
                              field.onChange(val?.toISOString())
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <FormControl>
                          <RadioGroup
                            defaultValue="male"
                            value={field.value}
                            onValueChange={field.onChange}
                            className="flex gap-6 mt-[5px]"
                          >
                            <div className="flex items-center gap-3">
                              <RadioGroupItem value="male" id="male" />
                              <Label htmlFor="male">Male</Label>
                            </div>
                            <div className="flex items-center gap-3">
                              <RadioGroupItem value="female" id="female" />
                              <Label htmlFor="female">Female</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Phone + Email */}
              <div className="flex gap-6">
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Address */}
              <FormField
                control={form.control}
                name="homeAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Home Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Card ID */}
              <FormField
                control={form.control}
                name="cardId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card ID</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Emergency Contact */}
              <p className="font-semibold text-[20px] pt-10">
                Emergency Contact Information
              </p>

              <FormField
                control={form.control}
                name="contactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-6">
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name="relationshipToPatient"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Relationship to Patient</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name="contactPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Phone</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-5">
                <Button type="button" variant={"outline"} className="ml-auto">
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
            {/* FORM END */}
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AddPatient;
