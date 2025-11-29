import { Medicine } from "@/interfaces/medicine";
import { Column } from "../../_components/MyTable";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link";
export const medicineColumns: Column<Medicine>[] = [
    { key: "id", label: "Id" },
    { key: "name", label: "Name" },
    { key: "purchasePrice", label: "Purchase Price" },
    { key: "sellingPrice", label: "Selling Price" },
    { key: "expiresAt", label: "Expires At" },
    { key: "unit", label: "Unit" },
    { key: "quantity", label: "Quantity" },


    {
        key: "action",
        label: "Actions",
        render: (medicine) => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>

                    {/* 👁 View */}
                    <Link href={`/admin/medicines/${medicine.id}`}>

                        <DropdownMenuItem>

                            <Eye className=" w-4 h-4 mr-2" />View
                        </DropdownMenuItem>
                    </Link>

                    {/* ✏ Edit */}
                    <DropdownMenuItem onClick={() => console.log("Edit", medicine.id)}>
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit
                    </DropdownMenuItem>

                    {/* 🗑 Delete */}
                    <DropdownMenuItem
                        className="text-red-600 focus:text-red-600"
                        onClick={() => console.log("Delete", medicine.id)}
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu >
        ),
    }

];