import MainNavigation from "@/components/main-navigation"
import DonationForm from "@/components/donation-form"
import Image from "next/image"

export default function DonatePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Top Bar and Header would be included here */}
      <MainNavigation />

      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative h-[300px]">
          <Image src="/placeholder.svg?height=300&width=1600&text=Donate" alt="Donate" fill className="object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <h1 className="text-4xl font-bold text-white">Support Our Cause</h1>
          </div>
        </div>

        {/* Donation Form Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
              <DonationForm />
            </div>
          </div>
        </section>

        {/* Other Ways to Donate */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Other Ways to Support</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-green-700 mb-4">Bank Transfer</h3>
                <p className="text-gray-700 mb-4">You can make a direct bank transfer to our foundation account.</p>
                <div className="space-y-2 text-gray-600">
                  <p>
                    <span className="font-medium">Account Name:</span> Your Foundation
                  </p>
                  <p>
                    <span className="font-medium">Account Number:</span> 1234567890
                  </p>
                  <p>
                    <span className="font-medium">Bank Name:</span> Example Bank
                  </p>
                  <p>
                    <span className="font-medium">Branch:</span> Main Branch, City
                  </p>
                  <p>
                    <span className="font-medium">Swift Code:</span> EXAMPLECODE
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-green-700 mb-4">Recurring Donations</h3>
                <p className="text-gray-700 mb-4">
                  Set up a monthly donation to provide consistent support to our programs.
                </p>
                <p className="text-gray-600 mb-4">
                  Monthly donations help us plan and implement long-term projects that create lasting impact in
                  communities.
                </p>
                <p className="text-gray-600">
                  Contact us at donations@yourfoundation.org to set up a recurring donation plan.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-green-700 mb-4">In-Kind Donations</h3>
                <p className="text-gray-700 mb-4">
                  Donate goods, services, or expertise to support our various programs.
                </p>
                <p className="text-gray-600 mb-4">
                  We accept donations of food, clothing, medical supplies, educational materials, and more.
                </p>
                <p className="text-gray-600">
                  Please contact us at inkind@yourfoundation.org to discuss your in-kind donation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto space-y-6">
              {[
                {
                  question: "Is my donation tax-deductible?",
                  answer:
                    "Yes, Your Foundation is a registered non-profit organization, and all donations are tax-deductible to the extent allowed by law. You will receive a receipt for your donation that you can use for tax purposes.",
                },
                {
                  question: "How is my donation used?",
                  answer:
                    "Your donation goes directly to supporting our programs in education, healthcare, emergency relief, and community development. We ensure that at least 85% of all donations go directly to program implementation, with the remainder covering essential administrative costs.",
                },
                {
                  question: "Can I specify which program my donation supports?",
                  answer:
                    "When making a donation, you can select which specific program or initiative you would like your contribution to support. If you have any special requests, please include them in the notes section of the donation form.",
                },
                {
                  question: "Is my payment information secure?",
                  answer:
                    "Yes, we use industry-standard encryption and security protocols to ensure that your payment information is protected. We do not store your credit card information on our servers.",
                },
                {
                  question: "How can I get a receipt for my donation?",
                  answer:
                    "You will automatically receive a receipt via email after your donation is processed. If you need an additional copy or have not received your receipt, please contact us at donations@yourfoundation.org.",
                },
              ].map((faq, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold text-green-700 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer would be included here */}
    </div>
  )
}
