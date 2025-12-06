import { Button } from "@/components/ui/button"
import {
    Card,

} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import MedicineCard from "./medicine-list/MedicineCard"
import CategoryCard from "./category-list/CategoryCard"


const MedicinePage = () => {
    return (
        <>
            {/* LABEL */}
            <div>
                <h1 className="text-gray-900 mb-2 text-2xl font-bold tracking-tight sm:text-3xl">Quản lý Thuốc</h1>
                <p className="text-gray-600">Quản lý kho thuốc và danh mục phân loại</p>
            </div>
            {/* TAB */}
            <div className="mt-4 flex w-full flex-col gap-6">
                <Tabs defaultValue="medicine">
                    <TabsList>
                        <TabsTrigger value="medicine">Thuốc</TabsTrigger>
                        <TabsTrigger value="category">Loại Thuốc</TabsTrigger>
                    </TabsList>
                    <TabsContent value="medicine">
                        <MedicineCard />
                    </TabsContent>
                    <TabsContent value="category">
                        <CategoryCard />
                    </TabsContent>
                </Tabs>
            </div>
        </>
    )
}

export default MedicinePage