import React from "react";
import { CategoryType } from "../../types/CategoryType";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { Clock, DollarSign, Layers, Tag } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "../ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";

interface Filters {
  categories: string[];
  priceRange: number[];
  deliveryTime: string;
}

interface FilterColumnProps {
  filters: Filters;
  handleFilterChange: (filter: keyof Filters, value: string | number[]) => void;
  handleCategoryChange: (categoryId: number) => void;
  categories: CategoryType[];
}

const FilterColumn: React.FC<FilterColumnProps> = ({
  filters,
  handleFilterChange,
  handleCategoryChange,
  categories,
}) => {
  return (
    <Card className="w-[280px] fixed top-24 left-4 h-[calc(100vh-120px)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="w-5 h-5" />
          Filters
        </CardTitle>
      </CardHeader>
      <ScrollArea className="h-[calc(100%-80px)] px-6">
        <div className="space-y-6">
          {/* Categories */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              <h3 className="font-semibold">Categories</h3>
            </div>
            <div className="space-y-2">
              {categories.map((category) => (
                <div
                  key={category.categoryId}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={`category-${category.categoryId}`}
                    checked={filters.categories.includes(
                      category.categoryId.toString()
                    )}
                    onCheckedChange={() =>
                      handleCategoryChange(category.categoryId)
                    }
                  />
                  <Label htmlFor={`category-${category.categoryId}`}>
                    {category.categoryName}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Delivery Time */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <h3 className="font-semibold">Delivery Time</h3>
            </div>
            <RadioGroup
              value={filters.deliveryTime}
              onValueChange={(value) =>
                handleFilterChange("deliveryTime", value)
              }
              className="space-y-2"
            >
              {[
                "Up to 7 days",
                "Up to 14 days",
                "Up to 1 month",
                "Anytime",
              ].map((time) => (
                <div key={time} className="flex items-center space-x-2">
                  <RadioGroupItem value={time} id={time} />
                  <Label htmlFor={time}>{time}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <Separator />

          {/* Price Range */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              <h3 className="font-semibold">Price Range</h3>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Minimum: ${filters.priceRange[0]}</Label>
                <Slider
                  min={0}
                  max={1000}
                  step={10}
                  value={[filters.priceRange[0]]}
                  onValueChange={(value) =>
                    handleFilterChange("priceRange", [
                      value[0],
                      filters.priceRange[1],
                    ])
                  }
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Maximum: ${filters.priceRange[1]}</Label>
                <Slider
                  min={0}
                  max={1000}
                  step={10}
                  value={[filters.priceRange[1]]}
                  onValueChange={(value) =>
                    handleFilterChange("priceRange", [
                      filters.priceRange[0],
                      value[0],
                    ])
                  }
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </Card>
  );
};

export default FilterColumn;
