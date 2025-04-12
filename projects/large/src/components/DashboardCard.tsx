import { Card, CardContent, Typography } from "@mui/material";

type Props = {
  title: string;
};

export default function DashboardCard({ title }: Props) {
  return (
    <Card sx={{ width: 200, height: 100 }}>
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="body2">Metric value: {Math.floor(Math.random() * 100)}</Typography>
      </CardContent>
    </Card>
  );
}
