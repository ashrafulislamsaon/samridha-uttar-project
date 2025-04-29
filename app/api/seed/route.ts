import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })

  // Sample projects
  const projects = [
    {
      title: "Education for All",
      slug: "education-for-all",
      description: "Providing quality education to underprivileged children in rural areas.",
      content:
        "Our Education for All program aims to provide quality education to underprivileged children in rural areas. We build schools, train teachers, and provide educational materials to ensure that every child has access to education.",
      goal_amount: 50000,
      current_amount: 35000,
      category: "education",
      featured: true,
      image_url: "/placeholder.svg?height=400&width=600&text=Education+Program",
    },
    {
      title: "Healthcare Initiative",
      slug: "healthcare-initiative",
      description: "Bringing medical services to those who need it most in remote communities.",
      content:
        "Our Healthcare Initiative brings medical services to those who need it most in remote communities. We organize medical camps, provide essential medicines, and train local health workers to ensure sustainable healthcare services.",
      goal_amount: 75000,
      current_amount: 45000,
      category: "healthcare",
      featured: true,
      image_url: "/placeholder.svg?height=400&width=600&text=Healthcare+Program",
    },
    {
      title: "Food Distribution",
      slug: "food-distribution",
      description: "Providing nutritious meals to families facing food insecurity.",
      content:
        "Our Food Distribution program provides nutritious meals to families facing food insecurity. We work with local farmers and food banks to ensure that no one goes hungry in our communities.",
      goal_amount: 30000,
      current_amount: 20000,
      category: "food",
      featured: true,
      image_url: "/placeholder.svg?height=400&width=600&text=Food+Program",
    },
  ]

  // Sample news
  const news = [
    {
      title: "New School Opened in Rural Community",
      slug: "new-school-opened",
      summary: "Your Foundation has opened a new school in a rural community, providing education to 200 children.",
      content:
        "Your Foundation has opened a new school in a rural community, providing education to 200 children. The school is equipped with modern facilities and qualified teachers to ensure quality education.",
      published: true,
      featured: true,
      category: "education",
      image_url: "/placeholder.svg?height=400&width=600&text=New+School",
    },
    {
      title: "Medical Camp Serves 500 Patients",
      slug: "medical-camp-serves-500",
      summary: "Our recent medical camp provided free healthcare services to 500 patients in a remote village.",
      content:
        "Our recent medical camp provided free healthcare services to 500 patients in a remote village. The camp offered general check-ups, eye care, dental services, and free medicines to those in need.",
      published: true,
      featured: false,
      category: "healthcare",
      image_url: "/placeholder.svg?height=400&width=600&text=Medical+Camp",
    },
    {
      title: "Annual Fundraising Gala Raises $100,000",
      slug: "fundraising-gala-success",
      summary: "Our annual fundraising gala was a huge success, raising $100,000 for our programs.",
      content:
        "Our annual fundraising gala was a huge success, raising $100,000 for our programs. The event featured inspiring speeches, entertainment, and a silent auction. We thank all our donors and supporters for their generosity.",
      published: true,
      featured: true,
      category: "fundraising",
      image_url: "/placeholder.svg?height=400&width=600&text=Fundraising+Gala",
    },
  ]

  // Sample testimonials
  const testimonials = [
    {
      name: "John Smith",
      role: "Community Leader",
      content:
        "Your Foundation has made a tremendous impact in our community. The education program has given our children hope for a better future.",
      rating: 5,
      is_featured: true,
    },
    {
      name: "Maria Rodriguez",
      role: "Parent",
      content:
        "I am grateful for the healthcare services provided by Your Foundation. My family now has access to quality healthcare that we couldn't afford before.",
      rating: 5,
      is_featured: true,
    },
    {
      name: "David Johnson",
      role: "Volunteer",
      content:
        "Volunteering with Your Foundation has been a rewarding experience. I've seen firsthand the positive impact of their programs on communities.",
      rating: 5,
      is_featured: true,
    },
  ]

  try {
    // Insert projects
    const { error: projectsError } = await supabase.from("projects").insert(projects)
    if (projectsError) throw projectsError

    // Insert news
    const { error: newsError } = await supabase.from("news").insert(news)
    if (newsError) throw newsError

    // Insert testimonials
    const { error: testimonialsError } = await supabase.from("testimonials").insert(testimonials)
    if (testimonialsError) throw testimonialsError

    return NextResponse.json({ success: true, message: "Database seeded successfully" })
  } catch (error: any) {
    console.error("Error seeding database:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
