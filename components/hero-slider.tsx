"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/context/language-context"
import { useContent } from "@/context/content-context"
import DynamicContent from "@/components/dynamic-content"
import Link from "next/link"

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const { t } = useLanguage()
  const { content } = useContent()

  // Get hero content from the content context
  const heroContent = content.hero || []

  // Create slides from dynamic content or use fallback
  const slides =
    heroContent.length > 0
      ? heroContent.map((item) => ({
          image: item.image_url || "/placeholder.svg?height=600&width=1600&text=Samridha+Uttar",
          title: item.title_en,
          description: item.content_en,
          link: item.link,
        }))
      : [
          {
            image: "/placeholder.svg?height=600&width=1600&text=Samridha+Uttar",
            title: "Samridha Uttar - Prosperous North",
            description: "Supporting communities through education, service, and dawah initiatives",
          },
          {
            image: "/placeholder.svg?height=600&width=1600&text=Education+Program",
            title: t("hero.title2"),
            description: t("hero.desc2"),
          },
          {
            image: "/placeholder.svg?height=600&width=1600&text=Healthcare+Initiative",
            title: t("hero.title3"),
            description: t("hero.desc3"),
          },
        ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative overflow-hidden h-[400px] md:h-[500px]">
      <div
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="min-w-full relative">
            <Image
              src={slide.image || "/placeholder.svg"}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="text-center text-white px-4 max-w-3xl">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">
                  {heroContent.length > 0 ? (
                    <DynamicContent
                      section="hero"
                      contentKey={heroContent[index]?.key || "main-heading"}
                      type="title"
                      fallback={slide.title}
                    />
                  ) : (
                    slide.title
                  )}
                </h2>
                <p className="text-lg md:text-xl mb-6">
                  {heroContent.length > 0 ? (
                    <DynamicContent
                      section="hero"
                      contentKey={heroContent[index]?.key || "main-heading"}
                      fallback={slide.description}
                    />
                  ) : (
                    slide.description
                  )}
                </p>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  {slide.link ? <Link href={slide.link}>{t("hero.donate")}</Link> : t("hero.donate")}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 text-white rounded-full hover:bg-black/50"
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 text-white rounded-full hover:bg-black/50"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </Button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${currentSlide === index ? "bg-white" : "bg-white/50"}`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
