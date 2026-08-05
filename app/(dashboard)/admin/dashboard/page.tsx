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
import {
  ArrowUpRight,
  DollarSign,
  Users,
  Briefcase,
  Activity,
  UserCheck,
  UserX,
  Clock,
  Star,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

// Dummy stats for admin
const stats = [
  {
    title: "Total Users",
    value: "3,847",
    icon: Users,
    change: "+12.5%",
    description: "2,340 customers · 1,507 craftsmen",
  },
  {
    title: "Active Craftsmen",
    value: "1,234",
    icon: UserCheck,
    change: "+8.3%",
    description: "68% verification rate",
  },
  {
    title: "Jobs Completed",
    value: "2,891",
    icon: Briefcase,
    change: "+23.1%",
    description: "342 this month",
  },
  {
    title: "Pending Verifications",
    value: "156",
    icon: ShieldCheck,
    change: "+12",
    description: "Requires manual review",
  },
];

// Dummy verification queue
const verificationQueue = [
  {
    id: 1,
    name: "Ahmet Yılmaz",
    category: "Plumbing",
    region: "Nicosia",
    level: "Verified",
    submitted: "2025-02-10",
    status: "Pending",
  },
  {
    id: 2,
    name: "Mehmet Demir",
    category: "Electrical",
    region: "Famagusta",
    level: "Approved",
    submitted: "2025-02-09",
    status: "In Review",
  },
  {
    id: 3,
    name: "Ayşe Kaya",
    category: "HVAC",
    region: "Kyrenia",
    level: "Registered",
    submitted: "2025-02-08",
    status: "Pending",
  },
  {
    id: 4,
    name: "Mustafa Çelik",
    category: "Carpentry",
    region: "Nicosia",
    level: "Verified",
    submitted: "2025-02-07",
    status: "Approved",
  },
  {
    id: 5,
    name: "Zeynep Öztürk",
    category: "Painting",
    region: "Famagusta",
    level: "Registered",
    submitted: "2025-02-06",
    status: "Rejected",
  },
];

// Dummy recent activity
const recentActivity = [
  {
    action: "New craftsman registration: Ahmet Yılmaz",
    time: "2 hours ago",
    type: "craftsman",
  },
  {
    action: "Verification approved: Mehmet Demir",
    time: "4 hours ago",
    type: "verification",
  },
  {
    action: "New job posted: Kitchen Renovation",
    time: "6 hours ago",
    type: "job",
  },
  {
    action: "Review removed: Inappropriate content",
    time: "1 day ago",
    type: "review",
  },
  {
    action: "User banned: spam account",
    time: "2 days ago",
    type: "user",
  },
  {
    action: "New region added: Güzelyurt",
    time: "3 days ago",
    type: "region",
  },
  {
    action: "Category updated: HVAC & Refrigeration",
    time: "4 days ago",
    type: "category",
  },
  {
    action: "Bulk notification sent to 1,234 craftsmen",
    time: "5 days ago",
    type: "notification",
  },
];

// Dummy top craftsmen
const topCraftsmen = [
  {
    id: 1,
    name: "Ahmet Yılmaz",
    category: "Plumbing",
    rating: 4.9,
    jobs: 47,
    revenue: "$8,240",
  },
  {
    id: 2,
    name: "Mehmet Demir",
    category: "Electrical",
    rating: 4.8,
    jobs: 38,
    revenue: "$6,750",
  },
  {
    id: 3,
    name: "Ayşe Kaya",
    category: "HVAC",
    rating: 4.7,
    jobs: 32,
    revenue: "$5,980",
  },
  {
    id: 4,
    name: "Mustafa Çelik",
    category: "Carpentry",
    rating: 4.9,
    jobs: 29,
    revenue: "$7,120",
  },
  {
    id: 5,
    name: "Zeynep Öztürk",
    category: "Painting",
    rating: 4.6,
    jobs: 24,
    revenue: "$4,560",
  },
];

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  "In Review": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  Approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  Rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
} as const;

export default function AdminDashboardPage() {
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
                <p className="mt-1 text-xs text-muted-foreground/70">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Action Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Verification Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">156</div>
            <p className="text-xs text-muted-foreground">12 new today</p>
          </CardContent>
        </Card>
        <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Reported Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">8</div>
            <p className="text-xs text-muted-foreground">3 need immediate action</p>
          </CardContent>
        </Card>
        <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">New Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
        <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">183</div>
            <p className="text-xs text-muted-foreground">42 in progress</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Growth</CardTitle>
          <CardDescription>
            Users, craftsmen, and jobs over the past 30 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full rounded-md bg-muted/30 flex items-center justify-center text-muted-foreground text-sm">
            📊 Chart (dummy) – Replace with real chart library
          </div>
        </CardContent>
      </Card>

      {/* Two-column: Verification Queue + Top Craftsmen */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Verification Queue */}
        <Card>
          <CardHeader>
            <CardTitle>Verification Queue</CardTitle>
            <CardDescription>
              Pending verification requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {verificationQueue.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.region}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          statusColors[item.status as keyof typeof statusColors]
                        }
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Top Craftsmen */}
        <Card>
          <CardHeader>
            <CardTitle>Top Craftsmen</CardTitle>
            <CardDescription>
              Highest rated and most active
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Jobs</TableHead>
                  <TableHead>Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topCraftsmen.map((craftsman) => (
                  <TableRow key={craftsman.id}>
                    <TableCell className="font-medium">{craftsman.name}</TableCell>
                    <TableCell>{craftsman.category}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                        {craftsman.rating}
                      </div>
                    </TableCell>
                    <TableCell>{craftsman.jobs}</TableCell>
                    <TableCell>{craftsman.revenue}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest admin actions and platform events
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((activity, i) => {
              const Icon = {
                craftsman: Users,
                verification: ShieldCheck,
                job: Briefcase,
                review: Star,
                user: UserCheck,
                region: TrendingUp,
                category: Activity,
                notification: AlertCircle,
              }[activity.type] || Activity;

              return (
                <div
                  key={i}
                  className="flex items-start gap-3 border-b pb-3 last:border-0 last:pb-0"
                >
                  <div className="rounded-full bg-primary/10 p-1.5 mt-0.5">
                    <Icon className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <p className="text-sm">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Admin Quick Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Admin Tips</CardTitle>
            <CardDescription>
              Best practices for platform management
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border p-3 hover:bg-muted/50 transition-colors">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  1
                </span>
                Review Verification Requests Daily
              </h4>
              <p className="mt-1 text-xs text-muted-foreground pl-7">
                Manual verification is our moat. Process requests within 24 hours
                to keep craftsmen engaged.
              </p>
            </div>
            <div className="rounded-lg border p-3 hover:bg-muted/50 transition-colors">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  2
                </span>
                Monitor Review Quality
              </h4>
              <p className="mt-1 text-xs text-muted-foreground pl-7">
                Never hide negative reviews – only remove abusive content. Trust
                is built on transparency.
              </p>
            </div>
            <div className="rounded-lg border p-3 hover:bg-muted/50 transition-colors">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  3
                </span>
                Track Key Metrics
              </h4>
              <p className="mt-1 text-xs text-muted-foreground pl-7">
                Monitor user growth, job completions, and verification rates
                weekly to identify trends and issues.
              </p>
            </div>
            <div className="rounded-lg border p-3 hover:bg-muted/50 transition-colors">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  4
                </span>
                Keep Categories Updated
              </h4>
              <p className="mt-1 text-xs text-muted-foreground pl-7">
                Regularly review the eight service categories and sub-services
                to ensure they reflect market needs.
              </p>
            </div>
            <div className="rounded-lg border p-3 hover:bg-muted/50 transition-colors">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  5
                </span>
                Audit Admin Logs
              </h4>
              <p className="mt-1 text-xs text-muted-foreground pl-7">
                Review AdminLog regularly to ensure all administrative actions
                are properly tracked and authorized.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer spacer */}
      <div className="h-4" />
    </div>
  );
}