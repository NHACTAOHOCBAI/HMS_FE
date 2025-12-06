import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Medicine } from "@/interfaces/medicine";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

export const medicineListColumns = (
    handleOpenDelete: (id: string) => void,
    handleOpenUpdate: (medicine: Medicine) => void
) => [
        { key: "id", label: "ID", sortable: true },
        { key: "name", label: "Name", sortable: true },
        { key: "activeIngredient", label: "Active Ingredient" },
        { key: "unit", label: "Unit" },
        { key: "concentration", label: "Concentration" },
        { key: "packaging", label: "Packaging" },
        { key: "quantity", label: "Quantity" },
        { key: "purchasePrice", label: "Purchase Price" },
        { key: "sellingPrice", label: "Selling Price" },
        { key: "expiresAt", label: "Expires At" },
        { key: "manufacturer", label: "Manufacturer" },
        {
            key: "category",
            label: "Category",
            render: (medicine: Medicine) => medicine.category?.name || "-"
        },
        { key: "createdAt", label: "Created At" },
        {
            key: "action",
            label: "Actions",
            render: (medicine: Medicine) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>

                        <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => handleOpenUpdate(medicine)}>
                            <Pencil className="w-4 h-4 mr-2" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenDelete(medicine.id)}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },];
