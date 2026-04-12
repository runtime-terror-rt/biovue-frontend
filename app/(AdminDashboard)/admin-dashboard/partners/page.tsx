"use client";

import { useState } from "react";
import { Search, Plus, MoreVertical, Edit, Trash2, HeartHandshake, X, Image as ImageIcon } from "lucide-react";
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
import { Card, CardContent } from "@/components/ui/card";
import DashboardHeading from "@/components/common/DashboardHeading";
import {
  useGetPartnersQuery,
  useCreatePartnerMutation,
  useUpdatePartnerMutation,
  useDeletePartnerMutation,
} from "@/redux/features/api/partnersApi";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { Label } from "@/components/ui/label";
import Image from "next/image";

export default function PartnersManagementPage() {
  const { data, isLoading } = useGetPartnersQuery({});
  const [createPartner] = useCreatePartnerMutation();
  const [updatePartner] = useUpdatePartnerMutation();
  const [deletePartner] = useDeletePartnerMutation();

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const partners = data?.data || [];

  const filteredPartners = partners.filter((partner: any) =>
    partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    partner.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    partner.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (partner: any = null) => {
    if (partner) {
      setEditingPartner(partner);
      setFormData({
        name: partner.name,
        email: partner.email,
        company: partner.company,
      });
      setImagePreview(partner.image_url);
    } else {
      setEditingPartner(null);
      setFormData({
        name: "",
        email: "",
        company: "",
      });
      setImagePreview(null);
    }
    setSelectedImage(null);
    setIsModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("email", formData.email);
    submitData.append("company", formData.company);
    if (selectedImage) {
      submitData.append("image", selectedImage);
    }

    try {
      if (editingPartner) {
        submitData.append("_method", "PUT");
        await updatePartner({ id: editingPartner.id, data: submitData }).unwrap();
        toast.success("Partner updated successfully");
      } else {
        await createPartner(submitData).unwrap();
        toast.success("Partner created successfully");
      }
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async (id: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deletePartner(id).unwrap();
          Swal.fire("Deleted!", "Partner has been deleted.", "success");
        } catch (err: any) {
          Swal.fire("Error!", err?.data?.message || "Failed to delete partner", "error");
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
    <div className="flex flex-col gap-6 min-h-screen p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <DashboardHeading
          heading="Partner Management"
          subheading="Create and manage your business partners"
        />
        <Button
          onClick={() => handleOpenModal()}
          className="bg-[#0FA4A9] hover:bg-[#0D8E92] text-white flex items-center gap-2 cursor-pointer"
        >
          <Plus size={18} />
          Add New Partner
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        <Card className="border-none shadow-sm bg-[#F4FBFA]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Partners</p>
                <h3 className="text-2xl font-bold text-[#1F2D2E]">{partners.length}</h3>
              </div>
              <div className="p-3 bg-white rounded-xl text-[#0FA4A9]">
                <HeartHandshake size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
        <Input
          placeholder="Search partners by name, company or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-11 bg-white border-gray-100 shadow-sm focus:ring-[#0FA4A9] w-1/2"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead className="font-semibold text-gray-700">Partner</TableHead>
              <TableHead className="font-semibold text-gray-700">Company</TableHead>
              <TableHead className="font-semibold text-gray-700">Email</TableHead>
              <TableHead className="text-right font-semibold text-gray-700">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPartners.length > 0 ? (
              filteredPartners.map((partner: any) => (
                <TableRow key={partner.id} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center">
                        {partner.image_url ? (
                          <Image
                            src={partner.image_url || "/images/placeholder.png"}
                            alt={partner.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <ImageIcon size={20} className="text-gray-300" />
                        )}
                      </div>
                      <span className="font-medium text-[#1F2D2E]">{partner.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600 font-medium">
                    {partner.company}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {partner.email}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="cursor-pointer">
                          <MoreVertical size={18} className="text-gray-500" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleOpenModal(partner)}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <Edit size={14} />
                          Edit Partner
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(partner.id)}
                          className="flex items-center gap-2 text-red-600 focus:text-red-600 cursor-pointer"
                        >
                          <Trash2 size={14} />
                          Delete Partner
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-gray-500">
                  No partners found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold text-[#1F2D2E]">
                {editingPartner ? "Edit Partner" : "Add New Partner"}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold">Partner Name</Label>
                <Input
                  id="name"
                  placeholder="Enter partner name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="h-11 shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="partner@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="h-11 shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company" className="text-sm font-semibold">Company</Label>
                <Input
                  id="company"
                  placeholder="Enter company name"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  required
                  className="h-11 shadow-sm"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Partner Logo/Image</Label>
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
                    {imagePreview ? (
                      <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                    ) : (
                      <Plus size={24} className="text-gray-300" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                  <div className="text-xs text-gray-500">
                    <p className="font-medium text-gray-700">Upload Image</p>
                    <p>PNG, JPG up to 2MB</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 h-11 border-gray-200 text-gray-600 font-semibold cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-11 bg-[#0FA4A9] hover:bg-[#0D8E92] text-white font-semibold shadow-md shadow-[#0FA4A9]/20 cursor-pointer"
                >
                  {editingPartner ? "Save Changes" : "Create Partner"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
