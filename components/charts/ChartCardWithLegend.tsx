"use client";

import { Card, CardHeader, CardBody, CardTitle } from "@kaiserinc/react";
import { ChartLegend } from "./ChartLegend";
import type { LegendItem } from "@/lib/chartTheme";

interface Props {
  title: React.ReactNode;
  icon: React.ReactNode;
  legend: LegendItem[];
  children: React.ReactNode;
  scrollable?: boolean;
}

export function ChartCardWithLegend({ title, icon, legend, children, scrollable = false }: Props) {
  return (
    <Card className="flex flex-col" style={{ minHeight: 380 }}>
      <CardHeader>
        <CardTitle>
          <span className="flex items-center gap-2">
            {icon}
            {title}
          </span>
        </CardTitle>
      </CardHeader>
      <CardBody className="flex-1 flex flex-col">
        <div style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          ...(scrollable ? {
            maxHeight: 420,
            overflowY: "auto",
            overflowX: "hidden",
            scrollbarWidth: "thin",
            scrollbarColor: "var(--border-default) transparent",
          } : {}),
        }}>
          {children}
        </div>
        <ChartLegend items={legend} />
      </CardBody>
    </Card>
  );
}
