"use client";

import { useState } from "react";
import { Search, Plus, MoreVertical, Edit, Trash2, HelpCircle, Eye, EyeOff, X } from "lucide-react";
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
import { Card, CardContent } from "@/components/ui/card";
import DashboardHeading from "@/components/common/DashboardHeading";
import {
  useGetAdminFaqsQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
  useToggleFaqStatusMutation,
} from "@/redux/features/api/adminDashboard/faqApi";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export default function FaqManagementPage() {
  const { data, isLoading } = useGetAdminFaqsQuery();
  const [createFaq] = useCreateFaqMutation();
  const [updateFaq] = useUpdateFaqMutation();
  const [deleteFaq] = useDeleteFaqMutation();
  const [toggleStatus] = useToggleFaqStatusMutation();

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<any>(null);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    is_active: true,
  });

  const faqs = data?.data || [];

  const filteredFaqs = faqs.filter((faq: any) =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (faq: any = null) => {
    if (faq) {
      setEditingFaq(faq);
      setFormData({
        question: faq.question,
        answer: faq.answer,
        is_active: Boolean(faq.is_active),
      });
    } else {
      setEditingFaq(null);
      setFormData({
        question: "",
        answer: "",
        is_active: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingFaq) {
        await updateFaq({ id: editingFaq.id, ...formData }).unwrap();
        toast.success("FAQ updated successfully");
      } else {
        await createFaq(formData).unwrap();
        toast.success("FAQ created successfully");
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
          await deleteFaq(id).unwrap();
          Swal.fire("Deleted!", "FAQ has been deleted.", "success");
        } catch (err: any) {
          Swal.fire("Error!", err?.data?.message || "Failed to delete FAQ", "error");
        }
      }
    });
  };

  const handleToggleStatus = async (id: number) => {
    try {
      await toggleStatus(id).unwrap();
      toast.success("Status updated successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update status");
    }
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
          heading="FAQ Management"
          subheading="Create and manage frequently asked questions for your platform"
        />
        <Button
          onClick={() => handleOpenModal()}
          className="bg-[#0FA4A9] hover:bg-[#0D8E92] text-white flex items-center gap-2 cursor-pointer"
        >
          <Plus size={18} />
          Add New FAQ
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border border-slate-100 shadow-md bg-white hover:shadow-lg transition-shadow duration-200">
          <CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total FAQs</p>
                <h3 className="text-3xl font-bold text-slate-900">{faqs.length}</h3>
                <p className="text-sm text-slate-500 mt-1">All FAQs in repository</p>
              </div>
              <div className="p-3 rounded-xl bg-teal-50 text-teal-600">
                <HelpCircle size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-100 shadow-md bg-white hover:shadow-lg transition-shadow duration-200">
          <CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active FAQs</p>
                <h3 className="text-3xl font-bold text-slate-900">{faqs.filter((f: any) => f.is_active).length}</h3>
                <p className="text-sm text-slate-500 mt-1">Visible to end users</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                <Eye size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-100 shadow-md bg-white hover:shadow-lg transition-shadow duration-200">
          <CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Inactive FAQs</p>
                <h3 className="text-3xl font-bold text-slate-900">{faqs.filter((f: any) => !f.is_active).length}</h3>
                <p className="text-sm text-slate-500 mt-1">Draft or hidden items</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-100 text-slate-500">
                <EyeOff size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
        <Input
          placeholder="Search FAQs by question or answer..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-11 bg-white border-gray-100 shadow-sm focus:ring-[#0FA4A9]"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead className="w-[40%] font-semibold text-gray-700">Question</TableHead>
              <TableHead className="w-[40%] font-semibold text-gray-700">Answer</TableHead>
              <TableHead className="font-semibold text-gray-700">Status</TableHead>
              <TableHead className="text-right font-semibold text-gray-700">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq: any) => (
                <TableRow key={faq.id} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell className="font-medium text-[#1F2D2E]">
                    {faq.question}
                  </TableCell>
                  <TableCell className="text-gray-500 max-w-xs truncate">
                    {faq.answer}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={Boolean(faq.is_active)}
                        onCheckedChange={() => handleToggleStatus(faq.id)}
                        className="data-[state=checked]:bg-[#10B981]"
                      />
                      <Badge
                        variant="outline"
                        className={Boolean(faq.is_active) 
                          ? "bg-green-50 text-green-600 border-green-100" 
                          : "bg-gray-50 text-gray-500 border-gray-100"}
                      >
                        {Boolean(faq.is_active) ? "Active" : "Inactive"}
                      </Badge>
                    </div>
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
                          onClick={() => handleOpenModal(faq)}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <Edit size={14} />
                          Edit FAQ
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(faq.id)}
                          className="flex items-center gap-2 text-red-600 focus:text-red-600 cursor-pointer"
                        >
                          < Trash2 size={14} />
                          Delete FAQ
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-gray-500">
                  No FAQs found. Add your first one to get started!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Custom Modal Implementation */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold text-[#1F2D2E]">
                {editingFaq ? "Edit FAQ" : "Add New FAQ"}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="question" className="text-sm font-semibold">Question</Label>
                <Input
                  id="question"
                  placeholder="e.g. How do I track my progress?"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  required
                  className="h-11 shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="answer" className="text-sm font-semibold">Answer</Label>
                <Textarea
                  id="answer"
                  placeholder="Provide a clear and concise answer..."
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  required
                  className="min-h-[120px] shadow-sm resize-none"
                />
              </div>
              <div className="flex items-center justify-between py-2 px-1 bg-gray-50 rounded-xl p-3">
                <div className="space-y-0.5">
                  <Label className="text-sm font-semibold">Publish FAQ</Label>
                  <p className="text-[10px] text-gray-500">Make this FAQ visible on the landing page</p>
                </div>
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  className="data-[state=checked]:bg-[#10B981]"
                />
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
                  {editingFaq ? "Save Changes" : "Create FAQ"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
