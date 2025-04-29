import Image from "next/image"
import { Button } from "@/components/ui/button"
import MainNavigation from "@/components/main-navigation"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Top Bar and Header would be included here - consider making a layout component */}
      <MainNavigation />

      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative h-[300px]">
          <Image
            src="/placeholder.svg?height=300&width=1600&text=About+Us"
            alt="About Us"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <h1 className="text-4xl font-bold text-white">About Us</h1>
          </div>
        </div>

        {/* Mission & Vision */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold text-green-700 mb-6">Our Mission</h2>
                <p className="text-gray-700 mb-4">
                  Our mission is to serve humanity by providing essential services to those in need, regardless of their
                  background, religion, or ethnicity. We strive to create a world where everyone has access to
                  education, healthcare, and basic necessities.
                </p>
                <p className="text-gray-700 mb-4">
                  Through our various programs and initiatives, we aim to empower communities and individuals to build a
                  better future for themselves and generations to come.
                </p>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-green-700 mb-6">Our Vision</h2>
                <p className="text-gray-700 mb-4">
                  We envision a world where poverty, hunger, and inequality are eliminated, and every person has the
                  opportunity to live a dignified life. We believe in the power of compassion, generosity, and
                  collective action to transform lives and communities.
                </p>
                <p className="text-gray-700 mb-4">
                  Our vision is to be a leading organization in humanitarian work, known for our integrity,
                  effectiveness, and commitment to sustainable development.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* History */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-green-700 mb-8">Our History</h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-gray-700 mb-4">
                Your Foundation was established in 2005 with a simple goal: to help those in need. What began as a small
                initiative by a group of dedicated individuals has grown into a recognized non-profit organization with
                a global reach.
              </p>
              <p className="text-gray-700 mb-4">
                Over the years, we have implemented numerous projects in education, healthcare, emergency relief, and
                community development. Our work has touched the lives of thousands of people across multiple countries.
              </p>
              <p className="text-gray-700 mb-4">
                Despite our growth, we remain committed to our core values of compassion, integrity, and excellence in
                all that we do. We continue to adapt and evolve to meet the changing needs of the communities we serve.
              </p>

              <div className="mt-8">
                <h3 className="text-xl font-semibold text-green-700 mb-4">Key Milestones</h3>
                <ul className="space-y-4">
                  <li className="flex">
                    <span className="font-bold mr-4">2005:</span>
                    <span>Foundation established with first education program</span>
                  </li>
                  <li className="flex">
                    <span className="font-bold mr-4">2008:</span>
                    <span>Launched healthcare initiative in underserved communities</span>
                  </li>
                  <li className="flex">
                    <span className="font-bold mr-4">2012:</span>
                    <span>Expanded operations to three additional countries</span>
                  </li>
                  <li className="flex">
                    <span className="font-bold mr-4">2015:</span>
                    <span>Established emergency relief fund for natural disasters</span>
                  </li>
                  <li className="flex">
                    <span className="font-bold mr-4">2020:</span>
                    <span>Reached milestone of helping over 10,000 beneficiaries</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-green-700 mb-8">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="text-center">
                  <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden mb-4">
                    <Image
                      src={`/placeholder.svg?height=200&width=200&text=Team+Member+${item}`}
                      alt={`Team Member ${item}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-1">Team Member Name</h3>
                  <p className="text-green-600 mb-2">Position / Role</p>
                  <p className="text-gray-600 text-sm">
                    Brief description about this team member and their contribution to the foundation.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-12 bg-green-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Join Us in Making a Difference</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Whether through volunteering, donating, or spreading awareness, your support can help us continue our
              mission.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button className="bg-white text-green-600 hover:bg-gray-100">Volunteer With Us</Button>
              <Button className="bg-green-700 hover:bg-green-800">Make a Donation</Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer would be included here */}
    </div>
  )
}
