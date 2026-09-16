import CustomInput from "@/components/Reuasable/CustomInput";
import React from "react";
import { Check } from "lucide-react";
import CustomButton from "@/components/shared/CustomButton";

type CategoryDataType = {
  icon: React.ReactNode;
  title: string;
  description: string;
  service: string;
  job: string;
};

export default function EditCategory({
  category,
  selectedId,
  onClose,
}: {
  category: CategoryDataType[];
  selectedId: number | string | null;
  onClose?: () => void;
}) {
  const selectedCategory =
    selectedId !== null ? category[Number(selectedId)] : null;

  const [name, setName] = React.useState("");
  const [selectedIconIndex, setSelectedIconIndex] = React.useState<
    number | null
  >(null);

  React.useEffect(() => {
    if (selectedCategory) {
      setName(selectedCategory.title);
      const iconIndex = category.findIndex(
        (item) => item.icon === selectedCategory.icon,
      );

      setSelectedIconIndex(iconIndex);
    }
  }, [selectedCategory, category]);

  return (
    <div>
      <hr className="w-full  h-[1px] bg-[#E8E8E8]" />

      <div className="mt-4">
        <CustomInput
          label="Name"
          placeholder="e.g Home & Property"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-11"
        />

        <p className="mt-4 text-[16px] font-medium leading-[160%] text-[#103D5C]">
          Icon
        </p>

        <div className="mt-2 flex gap-3">
          {category.map((item, index) => {
            const isSelected = selectedIconIndex === index;

            return (
              <button
                key={index}
                type="button"
                onClick={() => setSelectedIconIndex(index)}
                className="relative flex h-12 w-12 items-center justify-center rounded-full border border-[#E8E8E8] bg-white"
              >
                {item.icon}

                {isSelected && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#F5B517]">
                    <Check size={12} strokeWidth={3} className="text-white" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div className="mt-6 flex w-full gap-4">
          <CustomButton
            variant="tertiary"
            className="w-full h-11"
            onClick={onClose}
          >
            Cancel
          </CustomButton>

          <CustomButton
            type="button"
            size="sm"
            className="w-full h-11"
            onClick={() => {}}
          >
            Save Changes
          </CustomButton>
        </div>
      </div>
    </div>
  );
}
