import { useKioskInventory } from "@/features/inventory/api/useKioskInventory";
import { InventoryBoard } from "@/features/inventory/components/InventoryBoard";

export default function Inventory() {
	const {
		data: locations,
		isLoading,
		isError,
		dataUpdatedAt,
		refetch,
	} = useKioskInventory();

	return (
		<div className="bg-[#F8F9FA] flex-1 flex flex-col">
			<div className="w-full p-4 sm:p-6 lg:p-8 font-sans relative">
				<InventoryBoard
					locations={locations}
					isLoading={isLoading}
					isError={isError}
					dataUpdatedAt={dataUpdatedAt}
					refetch={refetch}
				/>
			</div>
		</div>
	);
}
