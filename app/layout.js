import { Montserrat } from 'next/font/google'
import './globals.css'
import MainComponent from "@/components/MainComponent"

const montserrat = Montserrat({ subsets: ['latin'] })

export const metadata = {
  title: 'myAssistant',
  description: 'Create your own GPT Assistant powered by OpenAI',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${montserrat.className}`}>
        <MainComponent children={children}/>
      </body>
    </html>
  )
}
