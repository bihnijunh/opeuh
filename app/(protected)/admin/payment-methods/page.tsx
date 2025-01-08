"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Switch } from "@/components/ui/switch";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QRCodeSVG } from 'qrcode.react';

import { PaymentMethodType } from "@/types/payment-method";

import { 
  createPaymentMethod, 
  updatePaymentMethod, 
  deletePaymentMethod,
  getPaymentMethods
} from "@/actions/payment-method";

interface PaymentMethod {
  id: string;
  name: string;
  type: PaymentMethodType;
  instructions: string | null;
  walletAddress: string | null;
  accountInfo: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface FormData {
  name: string;
  type: PaymentMethodType;
  instructions: string;
  accountInfo: string | null;
  walletAddress: string | null;
  isActive: boolean;
}

const paymentMethodTypes = [
  { label: "Bank Transfer", value: PaymentMethodType.BANK_TRANSFER },
  { label: "Credit Card", value: PaymentMethodType.CREDIT_CARD },
  { label: "Debit Card", value: PaymentMethodType.DEBIT_CARD },
];

export default function PaymentMethodsPage() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMethod, setCurrentMethod] = useState<PaymentMethod | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    type: PaymentMethodType.BANK_TRANSFER,
    instructions: "",
    accountInfo: null,
    walletAddress: null,
    isActive: true,
  });

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const methods = await getPaymentMethods();
      if (methods.data) {
        setPaymentMethods(methods.data.map(method => ({
          ...method,
          instructions: method.instructions || null,
          walletAddress: method.walletAddress || null,
          accountInfo: method.accountInfo || null,
          type: method.type as PaymentMethodType,
        })));
      }
    } catch (error) {
      toast.error("Failed to fetch payment methods");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const submitData = {
        name: formData.name,
        type: formData.type,
        instructions: formData.instructions || "",
        accountInfo: formData.type === PaymentMethodType.BANK_TRANSFER ? formData.accountInfo : null,
        walletAddress: formData.type === PaymentMethodType.CREDIT_CARD || formData.type === PaymentMethodType.DEBIT_CARD ? formData.walletAddress : null,
      };

      const result = isEditing
        ? await updatePaymentMethod(currentMethod!.id, submitData)
        : await createPaymentMethod(submitData);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(
          isEditing
            ? "Payment method updated successfully"
            : "Payment method added successfully"
        );
        fetchPaymentMethods();
        resetForm();
      }
    } catch (error) {
      toast.error("Failed to save payment method");
    }
  };

  const handleEdit = (method: PaymentMethod) => {
    setIsEditing(true);
    setCurrentMethod(method);
    setFormData({
      name: method.name,
      type: method.type,
      instructions: method.instructions || "",
      accountInfo: method.accountInfo,
      walletAddress: method.walletAddress,
      isActive: true,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this payment method?")) return;

    try {
      const result = await deletePaymentMethod(id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Payment method deleted successfully");
        fetchPaymentMethods();
      }
    } catch (error) {
      toast.error("Failed to delete payment method");
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentMethod(null);
    setFormData({
      name: "",
      type: PaymentMethodType.BANK_TRANSFER,
      instructions: "",
      accountInfo: null,
      walletAddress: null,
      isActive: true,
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">
          {isEditing ? "Edit Payment Method" : "Add Payment Method"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Bitcoin, Zelle"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                setFormData({ ...formData, type: value as PaymentMethodType })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethodTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Instructions</label>
            <Textarea
              value={formData.instructions}
              onChange={(e) =>
                setFormData({ ...formData, instructions: e.target.value })
              }
              placeholder="Enter payment instructions..."
              required
            />
          </div>

          {(formData.type === PaymentMethodType.CREDIT_CARD || formData.type === PaymentMethodType.DEBIT_CARD) && (
            <div>
              <label className="block text-sm font-medium mb-1">Wallet Address</label>
              <Input
                value={formData.walletAddress || ''}
                onChange={(e) =>
                  setFormData({ ...formData, walletAddress: e.target.value })
                }
                placeholder="Enter wallet address for card payments"
              />
            </div>
          )}

          {(formData.type === PaymentMethodType.BANK_TRANSFER) && (
            <div>
              <label className="block text-sm font-medium mb-1">Account Information</label>
              <Textarea
                value={formData.accountInfo || ''}
                onChange={(e) =>
                  setFormData({ ...formData, accountInfo: e.target.value })
                }
                placeholder="Enter account details..."
              />
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isActive: checked })
              }
            />
            <label>Active</label>
          </div>

          <div className="flex space-x-2">
            <Button type="submit">
              {isEditing ? "Update" : "Add"} Payment Method
            </Button>
            {isEditing && (
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Payment Methods</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className="p-4 border rounded-lg shadow-sm space-y-2"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{method.name}</h3>
                  <p className="text-sm text-gray-600">{method.type}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(method)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(method.id)}
                    className="p-1 hover:bg-gray-100 rounded text-red-600"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm">{method.instructions}</p>
              {(method.type === PaymentMethodType.CREDIT_CARD || method.type === PaymentMethodType.DEBIT_CARD) && method.walletAddress && (
                <div className="mt-2">
                  <div className="flex justify-center">
                    <QRCodeSVG value={method.walletAddress} size={150} />
                  </div>
                  <p className="text-xs mt-1 text-gray-500 break-all">{method.walletAddress}</p>
                </div>
              )}
              {(method.type === PaymentMethodType.BANK_TRANSFER) && method.accountInfo && (
                <p className="text-sm text-gray-600">{method.accountInfo}</p>
              )}
              <div className="flex items-center space-x-2">
                <Switch
                  checked={true}
                  onCheckedChange={async (checked) => {
                    try {
                      await updatePaymentMethod(method.id, {
                        name: method.name,
                        type: method.type,
                        instructions: method.instructions || "",
                        accountInfo: method.accountInfo,
                        walletAddress: method.walletAddress,
                      });
                      fetchPaymentMethods();
                    } catch (error) {
                      toast.error("Failed to update status");
                    }
                  }}
                />
                <span className="text-sm">
                  Active
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
