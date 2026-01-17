import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

interface OverviewCardProps {
  title: string;
  value: number;
  percentage?: number;
}

export const OverviewCard = ({ title, value }: OverviewCardProps) => {

  return (
    <Card className='max-w-90 bg-card'>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <p className="text-3xl font-bold">{value}</p>
          {/*Add a percentage indicator*/}
        </div>
      </CardContent>
    </Card>
  )
}
