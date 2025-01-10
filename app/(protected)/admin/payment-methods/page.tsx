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
}

const paymentMethodTypes = [
  { label: "Bank Transfer", value: PaymentMethodType.BANK_TRANSFER },
  { label: "Credit Card", value: PaymentMethodType.CREDIT_CARD },
  { label: "Debit Card", value: PaymentMethodType.DEBIT_CARD },
  { label: "Cryptocurrency", value: PaymentMethodType.CRYPTOCURRENCY },
];

const PaymentMethodCard = ({ method, onEdit, onDelete }: {
  method: PaymentMethod;
  onEdit: (method: PaymentMethod) => void;
  onDelete: (id: string) => void;
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold">{method.name}</h3>
          <p className="text-sm text-gray-500">{method.type}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(method)}
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(method.id)}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        {method.instructions && (
          <p className="text-sm">{method.instructions}</p>
        )}
        {method.accountInfo && (
          <p className="text-sm font-mono bg-gray-50 p-2 rounded">
            {method.accountInfo}
          </p>
        )}
        {method.type === PaymentMethodType.CRYPTOCURRENCY && method.walletAddress && (
          <div className="mt-4">
            <p className="text-sm font-mono bg-gray-50 p-2 rounded mb-2">
              {method.walletAddress}
            </p>
            <div className="flex justify-center">
              <QRCodeSVG
                value={method.walletAddress}
                size={128}
                level="L"
                includeMargin={true}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const PaymentMethodForm = ({ 
  initialData,
  onSubmit,
  onCancel 
}: {
  initialData?: PaymentMethod;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: initialData?.name || "",
    type: initialData?.type || PaymentMethodType.BANK_TRANSFER,
    instructions: initialData?.instructions || "",
    accountInfo: initialData?.accountInfo || "",
    walletAddress: initialData?.walletAddress || "",
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit(formData);
    }} className="space-y-4">
      <div className="space-y-2">
        <Input
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      
      <div className="space-y-2">
        <Select
          value={formData.type}
          onValueChange={(value: PaymentMethodType) => 
            setFormData({ ...formData, type: value })
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

      <div className="space-y-2">
        <Textarea
          placeholder="Instructions"
          value={formData.instructions}
          onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
        />
      </div>

      {formData.type === PaymentMethodType.CRYPTOCURRENCY ? (
        <div className="space-y-2">
          <Input
            placeholder="Wallet Address"
            value={formData.walletAddress || ""}
            onChange={(e) => setFormData({ ...formData, walletAddress: e.target.value })}
          />
        </div>
      ) : (
        <div className="space-y-2">
          <Input
            placeholder="Account Information"
            value={formData.accountInfo || ""}
            onChange={(e) => setFormData({ ...formData, accountInfo: e.target.value })}
          />
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
};

export default function PaymentMethodsPage() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMethod, setCurrentMethod] = useState<PaymentMethod | undefined>(undefined);

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

  const handleSubmit = async (data: FormData) => {
    try {
      const submitData = {
        name: data.name,
        type: data.type,
        instructions: data.instructions || "",
        accountInfo: data.type === PaymentMethodType.BANK_TRANSFER ? data.accountInfo : null,
        walletAddress: data.type === PaymentMethodType.CRYPTOCURRENCY ? data.walletAddress : null,
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
    setCurrentMethod(undefined);
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
        <PaymentMethodForm 
          initialData={currentMethod}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Payment Methods</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paymentMethods.map((method) => (
            <PaymentMethodCard 
              key={method.id} 
              method={method} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}
