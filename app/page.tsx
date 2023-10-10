import { App } from '../components/client/react-pdf'
import ClientWrapper from '@/components/client/client-wrapper'

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between m-8">
      <ClientWrapper>
        <App />
      </ClientWrapper>
    </main>
  )
}
