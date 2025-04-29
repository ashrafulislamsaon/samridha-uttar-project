import { getFeaturedProjects, getLatestNews } from "@/app/actions"
import HomeClient from "./page-client"

export default async function Home() {
  try {
    const [projects, news] = await Promise.all([getFeaturedProjects(), getLatestNews()])

    return <HomeClient projects={projects} news={news} />
  } catch (error) {
    console.error("Error loading home page data:", error)
    // Return the client component with empty arrays to prevent page crash
    return <HomeClient projects={[]} news={[]} />
  }
}
