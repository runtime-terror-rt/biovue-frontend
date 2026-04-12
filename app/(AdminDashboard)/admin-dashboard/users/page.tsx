"use client";

import { useState } from "react";
import { MoreHorizontal, Search, X, User, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { USERS_DATA, UserType } from "@/components/AdminDashboard/Data";
import DashboardHeading from "@/components/common/DashboardHeading";
import {
  useGetAdminUsersQuery,
  useDeleteAdminUserMutation,
} from "@/redux/features/api/adminDashboard/users";
import { toast } from "sonner";
import Swal from "sweetalert2";
import Image from "next/image";

const getSubscriptionColor = (
  subscription: string,
): "default" | "secondary" | "destructive" | "outline" => {
  switch (subscription) {
    case "Active":
      return "default";
    case "Expired":
      return "destructive";
    case "Free Trail":
      return "secondary";
    case "Cancelled":
      return "outline";
    default:
      return "default";
  }
};

const getTypeColor = (type: string) => {
  return type?.toLowerCase() === "professional"
    ? "bg-[#0FA4A926] text-[#0FA4A9] border-[#0FA4A9]"
    : "bg-[#8746E726] text-[#8746E7] border-[#8746E7]";
};

export default function UsersPage() {
  const { data, isLoading, error } = useGetAdminUsersQuery({});
  const [deleteUser, { isLoading: isDeleting }] = useDeleteAdminUserMutation();
  console.log(data,"users")

  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [filterType, setFilterType] = useState<
    "all" | "individual" | "professional"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");

  const users = data?.users_table || [];

  const filteredUsers = users.filter((user: any) => {
    const matchesType =
      filterType === "all" || user.user_type?.toLowerCase() === filterType;
    const matchesSearch =
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleDeleteUser = async (id: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteUser(id).unwrap();
          Swal.fire({
            title: "Deleted!",
            text: "User has been deleted.",
            icon: "success",
          });
        } catch (err: any) {
          Swal.fire({
            title: "Error!",
            text: err?.data?.message || "Failed to delete user",
            icon: "error",
          });
        }
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0FA4A9]"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-screen ">
      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="mb-6">
          <DashboardHeading
            heading="Users"
            subheading="View and manage all platform users"
          />
        </div>

        {/* Filter Tabs */}
        {/* Filter Tabs */}
        <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
          {["all", "individual", "professional"].map((type) => (
            <div
              key={type}
              onClick={() =>
                setFilterType(type as "all" | "individual" | "professional")
              }
              className={`
        cursor-pointer whitespace-nowrap text-sm sm:text-base pb-1
        ${filterType === type ? "border-b-2 border-[#0FA4A9] font-semibold text-[#0FA4A9]" : "text-gray-600"}
        transition-colors
      `}
            >
              {type === "all"
                ? "All Users"
                : type === "individual"
                  ? "Individual Users"
                  : "Professional Users"}
            </div>
          ))}
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 text-sm"
            />
          </div>
        </div>

        {/* Table - Responsive */}
        <div className=" rounded-lg border-b border-gray-200 overflow-hidden ">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#0FA4A91A] border-b border-gray-200">
                  <TableHead className="text-gray-700 font-semibold text-xs sm:text-base px-4 py-4">
                    USERS
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold text-xs sm:text-base px-4 py-4">
                    EMAIL
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold text-xs sm:text-base px-4 py-4">
                    USER TYPE
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold text-xs sm:text-base px-4 py-4">
                    SUBSCRIPTION
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold text-xs sm:text-base px-4 py-4">
                    STATUS
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold text-xs sm:text-base px-4 py-4">
                    JOINED DATE
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold w-10 px-4 py-4">
                    {" "}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user: any) => (
                  <TableRow
                    key={user.id}
                    className=" hover:bg-gray-50 border-b border-gray-200 transition-colors"
                  >
                    <TableCell className="font-medium text-gray-900 text-sm px-4 py-4">
                      {user.name || "N/A"}
                    </TableCell>
                    <TableCell className="text-gray-600 text-sm px-4 py-4">
                      {user.email}
                    </TableCell>
                    <TableCell className="px-4 py-4 capitalize">
                      <Badge
                        variant="outline"
                        className={`${getTypeColor(user.user_type)} text-xs`}
                      >
                        {user.user_type}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <Badge
                        variant={getSubscriptionColor(user.subscription)}
                        className="text-xs"
                      >
                        {user.subscription}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <span className="text-green-600 font-medium text-sm">
                        ● {user.account_status}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-600 text-sm px-4 py-4">
                      {user.joined_date?.split(" ")[0]}
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-4  w-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedUser(user);
                            }}
                            className="cursor-pointer hover:opacity-80"
                          >
                            View Details
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="text-red-600 cursor-pointer hover:bg-red-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteUser(user.id);
                            }}
                          >
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden">
            <div className="divide-y divide-gray-200">
              {filteredUsers.map((user: any) => (
                <div
                  key={user.id}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {user.name || "N/A"}
                      </h3>
                      <p className="text-xs text-gray-600">{user.email}</p>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedUser(user);
                          }}
                        >
                          View Details
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteUser(user.id);
                          }}
                        >
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge
                      variant="outline"
                      className={`${getTypeColor(user.user_type)} text-xs capitalize`}
                    >
                      {user.user_type}
                    </Badge>
                    <Badge
                      variant={getSubscriptionColor(user.subscription)}
                      className="text-xs"
                    >
                      {user.subscription}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-green-600 font-medium">
                      ● {user.account_status}
                    </span>
                    <span className="text-gray-600">
                      {user.joined_date?.split(" ")[0]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 ">
          <Card className="w-full max-w-md shadow-xl rounded-xl relative p-6 bg-white">
            {/* Header */}
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                User Profile
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setSelectedUser(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>

            {/* Content */}
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-4 pb-3 border-b">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#0FA4A926]">
                  {selectedUser.profile_image ? (
                    <Image
                      height={64}
                      width={64}
                      src={selectedUser.profile_image}
                      alt={selectedUser.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-[#0FA4A9] to-[#3A86FF] flex items-center justify-center">
                      <User className="w-8 h-8 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-xl text-[#041228]">
                    {selectedUser.name || "N/A"}
                  </h3>
                  <p className="text-sm text-[#5F6F73]">{selectedUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-[#5F6F73] uppercase tracking-wider">
                    User Type
                  </p>
                  <p className="text-sm font-semibold text-[#1F2D2E] capitalize">
                    {selectedUser.user_type}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-[#5F6F73] uppercase tracking-wider">
                    Status
                  </p>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-[#10B981]">
                    <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                    {selectedUser.account_status}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-[#5F6F73] uppercase tracking-wider">
                    Subscription
                  </p>
                  <p className="text-sm font-semibold text-[#3A86FF]">
                    {selectedUser.subscription}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-[#5F6F73] uppercase tracking-wider">
                    Member Since
                  </p>
                  <p className="text-sm font-semibold text-[#1F2D2E]">
                    {selectedUser.joined_date?.split(" ")[0]}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
