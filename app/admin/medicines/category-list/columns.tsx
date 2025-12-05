import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Category } from "@/interfaces/category";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

export const categoryListColumns = (
    handleOpenDelete: (id: string) => void,
    handleOpenUpdate: (category: Category) => void
) => [
        // export interface Category {
        //     id: string;
        //     name: string;
        //     description: string;
        //     createdAt: string;
        // }

        // export interface CategoryResponse {
        //     status: string;
        //     data: {
        //         content: Category[];
        //         page: number;
        //         size: number;
        //         totalElements: number;
        //         totalPages: number;
        //     };
        // }
        {
            key: "name",
            label: "Category Name",
            sortable: true,
        },
        {
            key: "description",
            label: "Description",
        },
        {
            key: "action",
            label: "Actions",
            render: (category: Category) => (
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

                        <DropdownMenuItem onClick={() => handleOpenUpdate(category)}>
                            <Pencil className="w-4 h-4 mr-2" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenDelete(category.id)}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },];
