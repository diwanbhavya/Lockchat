import React, { useState, useEffect } from "react";
import {
  Shield,
  User,
  Calendar,
  CheckCircle,
  XCircle,
  Search,
  Download,
  AlertTriangle,
} from "lucide-react";
import { getAllUsers, authService } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AdminPanelProps {
  adminToken?: string;
}

const AdminPanel = ({ adminToken = "" }: AdminPanelProps) => {
  const [token, setToken] = useState(adminToken || "");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userData, setUserData] = useState<Record<string, any>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleTokenSubmit = () => {
    try {
      const data = authService.getAdminUserData(token);
      if (data) {
        setUserData(data);
        setIsAuthorized(true);
        setError(null);
      } else {
        setError("Invalid admin token. Access denied.");
      }
    } catch (err) {
      setError("Error accessing admin data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // If we have a token on mount, try to authenticate
    if (token) {
      handleTokenSubmit();
    } else {
      setIsLoading(false);
    }
  }, []);

  const filteredUsers = Object.values(userData).filter((user: any) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.username?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.fullName?.toLowerCase().includes(searchLower)
    );
  });

  const exportUserData = () => {
    const dataStr = JSON.stringify(userData, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;

    const exportFileDefaultName = `user_data_export_${new Date().toISOString()}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const getPasswordStrengthBadge = (
    strength?: "weak" | "medium" | "strong",
  ) => {
    switch (strength) {
      case "weak":
        return (
          <Badge
            variant="outline"
            className="bg-red-100 text-red-800 border-red-200"
          >
            Weak
          </Badge>
        );
      case "medium":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-100 text-yellow-800 border-yellow-200"
          >
            Medium
          </Badge>
        );
      case "strong":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 border-green-200"
          >
            Strong
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            Unknown
          </Badge>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <Card className="border-2 border-red-100">
          <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-red-500" />
              <CardTitle>Admin Authentication</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Admin Token</label>
              <Input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter admin security token"
                className="border-gray-300"
              />
            </div>

            <Button
              onClick={handleTokenSubmit}
              className="w-full bg-red-600 hover:bg-red-700"
              disabled={!token.trim()}
            >
              Authenticate
            </Button>

            <p className="text-xs text-gray-500 text-center pt-2">
              This area is restricted to authorized administrators only.
              <br />
              <span className="font-medium">
                Hint: The admin token is in the authService.ts file.
              </span>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-500">
            Manage users and monitor system activity
          </p>
        </div>
        <div className="bg-indigo-100 p-3 rounded-full">
          <Shield className="h-6 w-6 text-indigo-600" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="mr-4 rounded-full p-2 bg-blue-100">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {Object.keys(userData).length}
                </div>
                <div className="text-xs text-gray-500">Registered accounts</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Verified Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="mr-4 rounded-full p-2 bg-green-100">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {
                    Object.values(userData).filter(
                      (user: any) => user.isVerified,
                    ).length
                  }
                </div>
                <div className="text-xs text-gray-500">
                  Email verified accounts
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="mr-4 rounded-full p-2 bg-purple-100">
                <Calendar className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {
                    Object.values(userData).filter(
                      (user: any) => user.lastLogin,
                    ).length
                  }
                </div>
                <div className="text-xs text-gray-500">Users logged in</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                View and manage all registered users
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-indigo-300 text-indigo-700 hover:bg-indigo-50"
              onClick={exportUserData}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search users by name, email or username"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm
                ? "No users found matching your search"
                : "No users registered yet"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableCaption>List of all registered users</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Password Strength</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user: any) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage
                              src={user.avatarUrl}
                              alt={user.username}
                            />
                            <AvatarFallback>
                              {user.username.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.fullName}</div>
                            <div className="text-sm text-gray-500">
                              @{user.username}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user.isVerified ? (
                          <Badge
                            variant="outline"
                            className="bg-green-100 text-green-800 border-green-200"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" /> Verified
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-amber-100 text-amber-800 border-amber-200"
                          >
                            <XCircle className="h-3 w-3 mr-1" /> Pending
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {getPasswordStrengthBadge(user.passwordStrength)}
                      </TableCell>
                      <TableCell>
                        {user.lastLogin ? (
                          new Date(user.lastLogin).toLocaleString()
                        ) : (
                          <span className="text-gray-400">Never</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" className="mr-2">
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel;
