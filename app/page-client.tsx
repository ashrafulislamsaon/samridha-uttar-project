"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import DonationForm from "@/components/donation-form"
import MainNavigation from "@/components/main-navigation"
import HeroSlider from "@/components/hero-slider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useLanguage } from "@/context/language-context"

export default function HomeClient({ projects, news }: { projects: any[]; news: any[] }) {
  const { t } = useLanguage()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <MainNavigation />

      {/* Hero Section */}
      <HeroSlider />

      {/* Donation Form Section */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <DonationForm />
            <div className="text-center mt-4 text-sm text-gray-600">
              <p>
                {t("donation.secure")}{" "}
                <Link href="/donation-details" className="text-green-600 underline">
                  {t("donation.details")}
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">{t("programs.title")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.length > 0
              ? projects.map((project) => (
                  <Card key={project.id} className="overflow-hidden">
                    <Image
                      src={project.image_url || `/placeholder.svg?height=200&width=400&text=Project`}
                      alt={project.title}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <CardContent className="p-4">
                      <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                      <p className="text-gray-600 mb-4">
                        {project.description || "A brief description of this program and how it helps the community."}
                      </p>
                      <Link href={`/projects/${project.slug}`}>
                        <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50">
                          {t("programs.learn_more")}
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))
              : // Fallback if no projects are found
                [1, 2, 3].map((item) => (
                  <Card key={item} className="overflow-hidden">
                    <Image
                      src={`/placeholder.svg?height=200&width=400&text=Program+${item}`}
                      alt={`Program ${item}`}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <CardContent className="p-4">
                      <h3 className="text-xl font-semibold mb-2">Program Title {item}</h3>
                      <p className="text-gray-600 mb-4">
                        A brief description of this program and how it helps the community through various initiatives.
                      </p>
                      <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50">
                        {t("programs.learn_more")}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-12 bg-green-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">{t("impact.title")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            {[
              { number: "50+", label: t("impact.projects") },
              { number: "10,000+", label: t("impact.beneficiaries") },
              { number: "25+", label: t("impact.locations") },
              { number: "15+", label: t("impact.years") },
            ].map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-3xl font-bold text-green-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">{t("news.title")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {news.length > 0
              ? news.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <Image
                      src={item.image_url || `/placeholder.svg?height=200&width=400&text=News`}
                      alt={item.title}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <CardContent className="p-4">
                      <div className="text-sm text-gray-500 mb-2">
                        {new Date(item.published_at || item.created_at).toLocaleDateString()}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                      <p className="text-gray-600 mb-4">{item.summary || item.content.substring(0, 100) + "..."}</p>
                      <Link href={`/news/${item.slug}`} className="text-green-600 hover:underline">
                        {t("news.read_more")} →
                      </Link>
                    </CardContent>
                  </Card>
                ))
              : // Fallback if no news are found
                [1, 2, 3].map((item) => (
                  <Card key={item} className="overflow-hidden">
                    <Image
                      src={`/placeholder.svg?height=200&width=400&text=News+${item}`}
                      alt={`News ${item}`}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <CardContent className="p-4">
                      <div className="text-sm text-gray-500 mb-2">June {item + 10}, 2023</div>
                      <h3 className="text-xl font-semibold mb-2">News Title {item}</h3>
                      <p className="text-gray-600 mb-4">
                        A brief summary of this news article about the foundation's recent activities and achievements.
                      </p>
                      <Link href={`/news/${item}`} className="text-green-600 hover:underline">
                        {t("news.read_more")} →
                      </Link>
                    </CardContent>
                  </Card>
                ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/news">
              <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                {t("news.view_all")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
