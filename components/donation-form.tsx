"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { useLanguage } from "@/context/language-context"
import { getSupabaseClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export default function DonationForm() {
  const [amount, setAmount] = useState<string>("")
  const [customAmount, setCustomAmount] = useState<string>("")
  const [donationType, setDonationType] = useState<string>("general")
  const [firstName, setFirstName] = useState<string>("")
  const [lastName, setLastName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [phone, setPhone] = useState<string>("")
  const [message, setMessage] = useState<string>("")
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false)
  const [paymentMethod, setPaymentMethod] = useState<string>("credit_card")
  const [mobileProvider, setMobileProvider] = useState<string>("bkash")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const { user } = useAuth()
  const { t, language } = useLanguage()
  const router = useRouter()
  const supabase = getSupabaseClient()

  // Currency symbol based on language
  const currencySymbol = "৳"

  // Donation amounts in Taka
  const donationAmounts = ["500", "1000", "2000", "5000", "10000", "custom"]

  const handleAmountSelect = (value: string) => {
    setAmount(value)
    setCustomAmount("")
  }

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value)
    setAmount("custom")
  }

  const getActualAmount = () => {
    if (amount === "custom") {
      return Number.parseFloat(customAmount)
    }
    return Number.parseFloat(amount)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    // Validate form
    if (amount === "") {
      setError("Please select a donation amount")
      setIsLoading(false)
      return
    }

    if (amount === "custom" && (!customAmount || Number.parseFloat(customAmount) <= 0)) {
      setError("Please enter a valid donation amount")
      setIsLoading(false)
      return
    }

    if (!firstName || !lastName || !email) {
      setError("Please fill in all required fields")
      setIsLoading(false)
      return
    }

    try {
      // In a real application, you would process payment here
      // For this example, we'll simulate a successful payment

      // Generate a mock transaction ID
      const transactionId = `TX-${Math.random().toString(36).substring(2, 10).toUpperCase()}`

      // Insert donation into database
      const { data, error: insertError } = await supabase
        .from("donations")
        .insert({
          user_id: user?.id || null,
          amount: getActualAmount(),
          currency: "BDT", // Changed to BDT (Bangladeshi Taka)
          payment_method: paymentMethod === "mobile_banking" ? `mobile_banking_${mobileProvider}` : paymentMethod,
          payment_status: "completed", // In a real app, this would depend on payment processor response
          transaction_id: transactionId,
          is_anonymous: isAnonymous,
          donation_type: donationType,
          message: message || null,
        })
        .select()

      if (insertError) {
        throw insertError
      }

      // If user is not logged in, store their info for the receipt
      if (!user) {
        localStorage.setItem(
          "donation_receipt",
          JSON.stringify({
            firstName,
            lastName,
            email,
            amount: getActualAmount(),
            currency: "BDT", // Changed to BDT
            transactionId,
            date: new Date().toISOString(),
          }),
        )
      }

      setSuccess("Thank you for your donation! Your transaction has been completed successfully.")

      // Reset form
      setAmount("")
      setCustomAmount("")
      setDonationType("general")
      setFirstName("")
      setLastName("")
      setEmail("")
      setPhone("")
      setMessage("")
      setIsAnonymous(false)

      // Redirect to receipt page after a short delay
      setTimeout(() => {
        router.push("/donate/receipt")
      }, 2000)
    } catch (err: any) {
      setError(err.message || "An error occurred while processing your donation")
    } finally {
      setIsLoading(false)
    }
  }

  // Translations for mobile banking providers
  const mobileProviders = {
    bkash: language === "BN" ? "বিকাশ" : "bKash",
    nagad: language === "BN" ? "নগদ" : "Nagad",
    rocket: language === "BN" ? "রকেট" : "Rocket",
    upay: language === "BN" ? "উপায়" : "Upay",
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-6">{t("donation.title")}</h2>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-4 border-green-500 text-green-700">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Label>{t("donation.type")}</Label>
          <Select value={donationType} onValueChange={setDonationType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("donation.type")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">{t("donation.general")}</SelectItem>
              <SelectItem value="education">{t("donation.education")}</SelectItem>
              <SelectItem value="healthcare">{t("donation.healthcare")}</SelectItem>
              <SelectItem value="food">{t("donation.food")}</SelectItem>
              <SelectItem value="emergency">{t("donation.emergency")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <Label>{t("donation.amount")}</Label>
          <RadioGroup value={amount} onValueChange={handleAmountSelect} className="grid grid-cols-3 gap-4">
            {donationAmounts.map((value) => (
              <div key={value} className="flex items-center">
                <RadioGroupItem value={value} id={`amount-${value}`} className="sr-only" />
                <Label
                  htmlFor={`amount-${value}`}
                  className={`w-full py-2 px-4 border rounded-md text-center cursor-pointer transition-colors ${
                    amount === value
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {value === "custom" ? t("donation.custom") : `${currencySymbol}${value}`}
                </Label>
              </div>
            ))}
          </RadioGroup>

          {amount === "custom" && (
            <div className="mt-4">
              <Label htmlFor="custom-amount">{t("donation.custom_amount")}</Label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">{currencySymbol}</span>
                </div>
                <Input
                  id="custom-amount"
                  type="number"
                  min="1"
                  step="1"
                  placeholder={t("donation.custom_amount")}
                  className="pl-7"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                />
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="first-name">{t("donation.first_name")}</Label>
            <Input
              id="first-name"
              placeholder={t("donation.first_name")}
              className="mt-1"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="last-name">{t("donation.last_name")}</Label>
            <Input
              id="last-name"
              placeholder={t("donation.last_name")}
              className="mt-1"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email">{t("donation.email")}</Label>
          <Input
            id="email"
            type="email"
            placeholder={t("donation.email")}
            className="mt-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="phone">{t("donation.phone")}</Label>
          <Input
            id="phone"
            type="tel"
            placeholder={t("donation.phone")}
            className="mt-1"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="message">{t("donation.message")}</Label>
          <textarea
            id="message"
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            rows={3}
            placeholder={t("donation.message_placeholder")}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="anonymous"
            checked={isAnonymous}
            onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
          />
          <Label htmlFor="anonymous" className="cursor-pointer">
            {t("donation.anonymous")}
          </Label>
        </div>

        <div className="space-y-4">
          <Label>{t("donation.payment_method")}</Label>
          <RadioGroup
            value={paymentMethod}
            onValueChange={setPaymentMethod}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {[
              { value: "credit_card", label: t("donation.credit_card") },
              { value: "bank_transfer", label: t("donation.bank_transfer") },
              { value: "mobile_banking", label: language === "BN" ? "মোবাইল ব্যাংকিং" : "Mobile Banking" },
              { value: "cash", label: language === "BN" ? "নগদ" : "Cash" },
            ].map((option) => (
              <div key={option.value} className="flex items-center">
                <RadioGroupItem value={option.value} id={`payment-${option.value}`} className="sr-only" />
                <Label
                  htmlFor={`payment-${option.value}`}
                  className={`w-full py-2 px-4 border rounded-md text-center cursor-pointer transition-colors ${
                    paymentMethod === option.value
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Mobile Banking Provider Selection */}
        {paymentMethod === "mobile_banking" && (
          <div className="space-y-4">
            <Label>{language === "BN" ? "মোবাইল ব্যাংকিং প্রদানকারী" : "Mobile Banking Provider"}</Label>
            <RadioGroup
              value={mobileProvider}
              onValueChange={setMobileProvider}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {Object.entries(mobileProviders).map(([value, label]) => (
                <div key={value} className="flex items-center">
                  <RadioGroupItem value={value} id={`provider-${value}`} className="sr-only" />
                  <Label
                    htmlFor={`provider-${value}`}
                    className={`w-full py-2 px-4 border rounded-md text-center cursor-pointer transition-colors ${
                      mobileProvider === value
                        ? "bg-green-600 text-white border-green-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        <Button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg"
          disabled={isLoading}
        >
          {isLoading ? t("donation.processing") : t("donation.submit")}
        </Button>
      </form>
    </div>
  )
}
