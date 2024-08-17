import { useRouter, usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'

export function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const { i18n } = useTranslation()

  const changeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const locale = e.target.value
    router.push(pathname.replace(/^\/[a-z]{2}/, `/${locale}`))
    i18n.changeLanguage(locale)
  }

  return (
    <select onChange={changeLanguage} defaultValue={i18n.language}>
      <option value="en">English</option>
      <option value="es">Español</option>
      <option value="fr">Français</option>
    </select>
  )
}