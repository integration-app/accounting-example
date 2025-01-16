"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Option {
  id: string;
  name: string;
}

interface Item {
  _id: string;
  name: string;
  mappedId?: string;
}

interface MappingTableProps {
  title: string;
  description: string;
  items: Item[];
  options: Option[];
  leftColumnName: string;
  rightColumnName: string;
  onMap: (itemId: string, optionId: string) => void;
  onUnmap: (itemId: string) => void;
}

export function MappingTable({
  title,
  description,
  items,
  options,
  leftColumnName,
  rightColumnName,
  onMap,
  onUnmap,
}: MappingTableProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{leftColumnName}</TableHead>
              <TableHead>{rightColumnName}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Select
                      value={item.mappedId || ""}
                      onValueChange={(value: string) => onMap(item._id, value)}
                    >
                      <SelectTrigger className="w-[240px] bg-white text-gray-900 border-gray-300 hover:bg-blue-50 cursor-pointer">
                        <SelectValue
                          placeholder="---"
                          className="text-gray-500"
                        />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-300 shadow-lg max-h-[300px]">
                        {options.map((option) => (
                          <SelectItem
                            key={option.id}
                            value={option.id}
                            className="text-gray-900 cursor-pointer hover:text-gray-950"
                          >
                            {option.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {item.mappedId && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onUnmap(item._id)}
                        className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-700"
                        title={`Unmap ${rightColumnName.toLowerCase()}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 