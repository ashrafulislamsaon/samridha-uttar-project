"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Download } from "lucide-react"
import { useLanguage } from "@/context/language-context"

export default function ReceiptPage() {
  const [receipt, setReceipt] = useState<any>(null)
  const router = useRouter()
  const { language } = useLanguage()

  useEffect(() => {
    // Get receipt data from localStorage
    const storedReceipt = localStorage.getItem("donation_receipt")

    if (storedReceipt) {
      setReceipt(JSON.parse(storedReceipt))
    } else {
      // If no receipt data, redirect to donation page
      router.push("/donate")
    }
  }, [router])

  if (!receipt) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString()
  }

  const handlePrint = () => {
    window.print()
  }

  // Currency symbol
  const currencySymbol = "৳"
  const currencyCode = receipt.currency || "BDT"

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg print:shadow-none">
            <CardHeader className="text-center border-b pb-6">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-700">
                {language === "BN" ? "দান রসিদ" : "Donation Receipt"}
              </CardTitle>
              <CardDescription>
                {language === "BN" ? "আপনার উদার অবদানের জন্য ধন্যবাদ!" : "Thank you for your generous contribution!"}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="flex justify-between border-b pb-4">
                  <div className="text-sm text-gray-500">{language === "BN" ? "রসিদ নম্বর" : "Receipt Number"}</div>
                  <div className="font-medium">{receipt.transactionId}</div>
                </div>

                <div className="flex justify-between border-b pb-4">
                  <div className="text-sm text-gray-500">{language === "BN" ? "তারিখ" : "Date"}</div>
                  <div className="font-medium">{formatDate(receipt.date)}</div>
                </div>

                <div className="flex justify-between border-b pb-4">
                  <div className="text-sm text-gray-500">{language === "BN" ? "দাতার নাম" : "Donor Name"}</div>
                  <div className="font-medium">
                    {receipt.firstName} {receipt.lastName}
                  </div>
                </div>

                <div className="flex justify-between border-b pb-4">
                  <div className="text-sm text-gray-500">{language === "BN" ? "ইমেইল" : "Email"}</div>
                  <div className="font-medium">{receipt.email}</div>
                </div>

                <div className="flex justify-between border-b pb-4">
                  <div className="text-sm text-gray-500">{language === "BN" ? "পরিমাণ" : "Amount"}</div>
                  <div className="font-medium text-xl">
                    {currencySymbol}
                    {receipt.amount.toFixed(2)} {currencyCode}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    {language === "BN"
                      ? "আপনার ফাউন্ডেশন একটি নিবন্ধিত অলাভজনক সংস্থা। আপনার দান কর-কর্তনযোগ্য হতে পারে। আরও তথ্যের জন্য আপনার কর পরামর্শদাতার সাথে পরামর্শ করুন।"
                      : "Your Foundation is a registered non-profit organization. Your donation may be tax-deductible. Please consult with your tax advisor for more information."}
                  </p>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col sm:flex-row gap-4 pt-6 print:hidden">
              <Button className="w-full sm:w-auto" onClick={handlePrint}>
                <Download className="mr-2 h-4 w-4" /> {language === "BN" ? "রসিদ ডাউনলোড করুন" : "Download Receipt"}
              </Button>
              <Link href="/" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full">
                  {language === "BN" ? "হোমপেজে ফিরে যান" : "Return to Homepage"}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
