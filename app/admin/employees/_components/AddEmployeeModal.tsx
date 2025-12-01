"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { getDepartments, getPositions, createEmployee } from "@/services/employee.service";
import { Employee } from "@/interfaces/employee";

interface AddEmployeeModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function AddEmployeeModal({ open, onOpenChange, onSuccess }: AddEmployeeModalProps) {
    const [formData, setFormData] = useState({
        fullName: "",
        dateOfBirth: "",
        gender: "Male" as Employee["gender"],
        idCard: "",
        phoneNumber: "",
        email: "",
        address: "",
        position: "",
        department: "",
        baseSalary: "",
        startingDay: "",
    });

    const departments = getDepartments();
    const positions = getPositions();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Submitting form:", formData);

        try {
            await createEmployee({
                ...formData,
                avatar: null,
                status: "Active",
                baseSalary: parseInt(formData.baseSalary),
            });
            console.log("Employee created successfully");

            onSuccess?.();
            onOpenChange(false);
            setFormData({
                fullName: "",
                dateOfBirth: "",
                gender: "Male",
                idCard: "",
                phoneNumber: "",
                email: "",
                address: "",
                position: "",
                department: "",
                baseSalary: "",
                startingDay: "",
            });
        } catch (error) {
            console.error("Error creating employee:", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Add employee &gt; Personal information</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input
                                id="fullName"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dateOfBirth">Birthday</Label>
                            <Input
                                id="dateOfBirth"
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="gender">Gender</Label>
                            <Select
                                value={formData.gender}
                                onValueChange={(val) => setFormData({ ...formData, gender: val as Employee["gender"] })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Male">Male</SelectItem>
                                    <SelectItem value="Female">Female</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="idCard">ID Card</Label>
                            <Input
                                id="idCard"
                                value={formData.idCard}
                                onChange={(e) => setFormData({ ...formData, idCard: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber">Phone number</Label>
                            <Input
                                id="phoneNumber"
                                type="tel"
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                                id="address"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="position">Position</Label>
                            <Select
                                value={formData.position}
                                onValueChange={(val) => setFormData({ ...formData, position: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select position" />
                                </SelectTrigger>
                                <SelectContent>
                                    {positions.map((pos) => (
                                        <SelectItem key={pos} value={pos}>
                                            {pos}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="department">Department</Label>
                            <Select
                                value={formData.department}
                                onValueChange={(val) => setFormData({ ...formData, department: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                                <SelectContent>
                                    {departments.map((dept) => (
                                        <SelectItem key={dept} value={dept}>
                                            {dept}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="baseSalary">Base salary</Label>
                            <Input
                                id="baseSalary"
                                type="number"
                                value={formData.baseSalary}
                                onChange={(e) => setFormData({ ...formData, baseSalary: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="startingDay">Starting day</Label>
                        <Input
                            id="startingDay"
                            type="date"
                            value={formData.startingDay}
                            onChange={(e) => setFormData({ ...formData, startingDay: e.target.value })}
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">Save</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
