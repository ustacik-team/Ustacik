import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, DollarSign, Users, Briefcase, Activity } from "lucide-react";

// Dummy data
const stats = [
  { title: "Total Revenue", value: "$45,231.89", icon: DollarSign, change: "+20.1%" },
  { title: "Active Users", value: "2,350", icon: Users, change: "+180" },
  { title: "Jobs Posted", value: "1,423", icon: Briefcase, change: "+12" },
  { title: "Conversion Rate", value: "12.5%", icon: Activity, change: "+2.3%" },
];

const recentJobs = [
  { id: 1, title: "Plumbing Repair", status: "In Progress", priority: "High", date: "2025-02-10" },
  { id: 2, title: "Electrical Wiring", status: "Completed", priority: "Medium", date: "2025-02-09" },
  { id: 3, title: "Roof Inspection", status: "Pending", priority: "Low", date: "2025-02-08" },
  { id: 4, title: "Kitchen Renovation", status: "In Progress", priority: "High", date: "2025-02-07" },
  { id: 5, title: "Bathroom Tiling", status: "Completed", priority: "Medium", date: "2025-02-06" },
  { id: 6, title: "Window Installation", status: "Pending", priority: "Low", date: "2025-02-05" },
  { id: 7, title: "Garden Landscaping", status: "In Progress", priority: "High", date: "2025-02-04" },
  { id: 8, title: "Appliance Repair", status: "Completed", priority: "Medium", date: "2025-02-03" },
  { id: 9, title: "Fence Building", status: "Pending", priority: "Low", date: "2025-02-02" },
  { id: 10, title: "Interior Painting", status: "In Progress", priority: "High", date: "2025-02-01" },
];

const statusColors = {
  "In Progress": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  "Completed": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  "Pending": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
} as const;

const priorityColors = {
  High: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  Medium: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  Low: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
} as const;

export default function CustomerDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Overview</CardTitle>
          <CardDescription>
            Daily active users and job requests over the past 30 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full rounded-md bg-muted/30 flex items-center justify-center text-muted-foreground text-sm">
            📊 Chart (dummy) – Replace with real chart library
          </div>
        </CardContent>
      </Card>

      {/* Recent Jobs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Job Requests</CardTitle>
          <CardDescription>
            Latest jobs posted by customers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={statusColors[job.status as keyof typeof statusColors]}>
                      {job.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={priorityColors[job.priority as keyof typeof priorityColors]}>
                      {job.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>{job.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Extra long text section to ensure scrolling */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 border-b pb-2 last:border-0 last:pb-0">
                <div className="rounded-full bg-primary/10 p-2">
                  <ArrowUpRight className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Action #{i + 1}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date('2025-02-10T00:00:00.000Z').toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-lg border p-3">
                <h4 className="font-medium">Tip #{i + 1}</h4>
                <p className="text-sm text-muted-foreground">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Footer spacer to ensure enough scroll */}
      <div className="h-4" />
    </div>
  );
}