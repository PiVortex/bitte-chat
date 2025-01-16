import { memo, useMemo } from "react";

import { TrendingDown, TrendingUp } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { AreaChart } from "./AreaChart";
import { BarChart } from "./BarChart";
import { CandleChart } from "./CandleChart"; 
import { LineChart } from "./LineChart";
import {
  formatValue,
  getDateFormatter,
  type ChartWrapperProps,
} from "../../../lib/chart-helpers";

const CHART_COMPONENTS = {
  candle: CandleChart,
  area: AreaChart,
  bar: BarChart,
  line: LineChart,
} as const;

export const ChartWrapper = memo(
  ({
    title,
    description,
    chartConfig,
    chartData,
    metricData,
    chartType = "line",
    dataFormat = "currency",
  }: ChartWrapperProps) => {
    const ChartComponent = CHART_COMPONENTS[chartType];

    const [timeKey, ...metricKeys] = Object.keys(chartConfig);

    const { startTimeValue, endTimeValue } = useMemo(
      () => ({
        startTimeValue: chartData[0][timeKey as keyof (typeof chartData)[0]],
        endTimeValue:
          chartData[chartData.length - 1][
            timeKey as keyof (typeof chartData)[0]
          ],
      }),
      [chartData, timeKey]
    );

    const dateFormatter = useMemo(
      () =>
        getDateFormatter({
          startTimeValue,
          endTimeValue,
        }),
      [startTimeValue, endTimeValue]
    );

    const valueFormatter = useMemo(
      () =>
        (value: unknown, compact = false) =>
          formatValue({ value, dataFormat, compact }),
      [dataFormat]
    );

    const showMetricData = metricData && metricData.length > 0;

    const startDate = useMemo(
      () => dateFormatter(startTimeValue, false),
      [dateFormatter, startTimeValue]
    );

    const endDate = useMemo(
      () => dateFormatter(endTimeValue, false),
      [dateFormatter, endTimeValue]
    );

    return (
      <Card className='max-lg:-mx-4 max-lg:p-2'>
        <CardHeader className='max-lg:p-2'>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className='pb-0 max-lg:p-2'>
          <ChartComponent
            chartConfig={chartConfig}
            timeKey={timeKey}
            metricKeys={metricKeys}
            chartData={chartData}
            dateFormatter={dateFormatter}
            valueFormatter={valueFormatter}
          />
        </CardContent>
        {showMetricData ? (
          <CardFooter className='pt-2'>
            <div className='grid w-full grid-cols-2 gap-2 text-sm'>
              {metricData.map(
                ({ metric, percentageChange, isPositive, isCandle }) => (
                  <div key={metric} className='grid gap-2'>
                    <div className='flex items-center gap-2 font-medium leading-none'>
                      {isCandle ? null : (
                        <div className='flex items-center gap-2'>
                          <div
                            className='size-4 rounded-sm'
                            style={{
                              backgroundColor: chartConfig[metric].color,
                            }}
                          />
                          {chartConfig[metric].label || metric}
                        </div>
                      )}
                      {isPositive ? "Trending Up" : "Trending Down"} by{" "}
                      {Math.abs(percentageChange).toFixed(1)}%{" "}
                      {isPositive ? (
                        <TrendingUp className='size-4 text-shad-green-success' />
                      ) : (
                        <TrendingDown className='size-4 text-shad-red-100' />
                      )}
                    </div>
                  </div>
                )
              )}
              <div className='col-span-2 flex items-center gap-2 leading-none text-muted-foreground'>
                {startDate} - {endDate}
              </div>
            </div>
          </CardFooter>
        ) : null}
      </Card>
    );
  }
);

ChartWrapper.displayName = "ChartWrapper";
