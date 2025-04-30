"use client"

import Link from "next/link"
import { useState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Youtube, Mail } from "lucide-react"
import { subscribeToNewsletter } from "@/app/actions"
import { toast } from "@/hooks/use-toast"
import { useLanguage } from "@/context/language-context"
import { useContent } from "@/context/content-context"
import DynamicContent from "@/components/dynamic-content"

function SubscribeButton() {
  const { pending } = useFormStatus()
  const { t } = useLanguage()

  return (
    <Button type="submit" className="ml-2 bg-green-600 hover:bg-green-500" disabled={pending}>
      {pending ? "..." : t("footer.subscribe_button")}
    </Button>
  )
}

export default function Footer() {
  const [email, setEmail] = useState("")
  const { t } = useLanguage()
  const { content } = useContent()

  async function handleSubscribe(formData: FormData) {
    const result = await subscribeToNewsletter(formData)

    if (result.success) {
      toast({
        title: "Success!",
        description: result.message,
      })
      setEmail("")
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      })
    }
  }

  return (
    <footer className="bg-green-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">{t("footer.about")}</h3>
            <p className="text-green-100 mb-4">
              <DynamicContent section="footer" contentKey="about" fallback={t("footer.about_desc")} />
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-white hover:text-green-300">
                <Facebook size={20} />
              </Link>
              <Link href="#" className="text-white hover:text-green-300">
                <Youtube size={20} />
              </Link>
              <Link href="mailto:info@samridhauttar.org" className="text-white hover:text-green-300">
                <Mail size={20} />
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">{t("footer.quick_links")}</h3>
            <ul className="space-y-2">
              {[
                { key: "footer.about", href: "/about" },
                { key: "nav.programs", href: "/programs" },
                { key: "header.donate", href: "/donate" },
                { key: "nav.news", href: "/news" },
                { key: "nav.contact", href: "/contact" },
              ].map((item) => (
                <li key={item.key}>
                  <Link href={item.href} className="text-green-100 hover:text-white hover:underline">
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">{t("footer.contact")}</h3>
            <address className="not-italic text-green-100 space-y-2">
              <p>
                <DynamicContent section="footer" contentKey="address-line1" fallback="123 Foundation Street" />
              </p>
              <p>
                <DynamicContent section="footer" contentKey="address-line2" fallback="City, State 12345" />
              </p>
              <p>
                Email: <DynamicContent section="footer" contentKey="email" fallback="info@samridhauttar.org" />
              </p>
              <p>
                Phone: <DynamicContent section="footer" contentKey="phone" fallback="+1 (234) 567-8900" />
              </p>
            </address>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">{t("footer.newsletter")}</h3>
            <p className="text-green-100 mb-4">{t("footer.subscribe")}</p>
            <form action={handleSubscribe} className="flex">
              <Input
                type="email"
                name="email"
                placeholder={t("donation.email")}
                className="bg-green-700 text-white border-green-600 focus:ring-green-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <SubscribeButton />
            </form>
          </div>
        </div>
        <div className="border-t border-green-700 mt-8 pt-8 text-center text-green-100">
          <p>
            © {new Date().getFullYear()}{" "}
            <DynamicContent section="footer" contentKey="copyright" fallback="Samridha Uttar" />. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  )
}
