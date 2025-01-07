'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export function LoanApplicationFormComponent() {
  const [formData, setFormData] = useState({
    facilityAmount: '',
    loanType: '',
    loanDuration: '',
    loanRemarks: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prevState => ({ ...prevState, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prevState => ({ ...prevState, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // Here you would typically send the data to your backend
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Loan Application</h1>
        <Card>
          <CardHeader>
            <CardTitle>Recipient Information</CardTitle>
            <CardDescription>Please enter only valid information in the spaces provided.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="facilityAmount">Facility Amount</Label>
                  <Input 
                    id="facilityAmount" 
                    name="facilityAmount" 
                    type="number" 
                    placeholder="0.00" 
                    step="0.01" 
                    min="0" 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loanType">Loan Type</Label>
                  <Select name="loanType" onValueChange={(value) => handleSelectChange('loanType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Loan type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personal">Personal Loan</SelectItem>
                      <SelectItem value="business">Business Loan</SelectItem>
                      <SelectItem value="mortgage">Mortgage</SelectItem>
                      <SelectItem value="auto">Auto Loan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loanDuration">Loan Duration</Label>
                  <Select name="loanDuration" onValueChange={(value) => handleSelectChange('loanDuration', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Loan Duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6 months</SelectItem>
                      <SelectItem value="12">12 months</SelectItem>
                      <SelectItem value="24">24 months</SelectItem>
                      <SelectItem value="36">36 months</SelectItem>
                      <SelectItem value="48">48 months</SelectItem>
                      <SelectItem value="60">60 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="loanRemarks">Loan Remarks</Label>
                  <Textarea 
                    id="loanRemarks" 
                    name="loanRemarks" 
                    placeholder="Enter any additional information or remarks about your loan application" 
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">Send Request</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}